import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { OrderForm } from '@/components/forms/OrderForm';

const MB = 1024 * 1024;
const PNG_BYTES = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 1, 2, 3]);

const fetchMock = vi.fn();

beforeEach(() => {
  sessionStorage.clear();
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
  URL.createObjectURL = vi.fn(() => 'blob:preview');
  URL.revokeObjectURL = vi.fn();
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const renderForm = (props: Partial<Parameters<typeof OrderForm>[0]> = {}) =>
  render(<OrderForm initialServices={[]} initialSource="contact" maxUploadBytes={4 * MB} {...props} />);

const click = (name: RegExp | string, role: 'button' | 'checkbox' | 'radio' = 'button') =>
  fireEvent.click(screen.getByRole(role, { name }));

async function completeStep1() {
  click(/Web Design & Development/, 'checkbox');
  click('$5,000 – $15,000', 'radio');
  click('1 – 3 months', 'radio');
  click(/Continue/);
  await screen.findByText('Tell us about your project', { selector: 'h3' });
}

async function completeStep2(description = 'We need a new online store with a blog and product pages.') {
  fireEvent.change(screen.getByLabelText(/Tell us about your project/), { target: { value: description } });
  click(/Continue/);
  await screen.findByText('How can we reach you?', { selector: 'h3' });
}

function fillStep3() {
  fireEvent.change(screen.getByLabelText('Full name'), { target: { value: 'Amelia Hart' } });
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'amelia@example.com' } });
  click(/I agree/, 'checkbox');
}

describe('OrderForm', () => {
  it('blocks step 1 until services, budget and timeline are chosen', async () => {
    renderForm();
    click(/Continue/);
    expect(await screen.findByText('Select at least one service.')).toBeTruthy();
    expect(screen.getByText('Please choose a budget range.')).toBeTruthy();
    expect(screen.getByText('Please choose a timeline.')).toBeTruthy();
    expect(screen.getByText(/Please fix the 3 highlighted fields/)).toBeTruthy();
    expect(screen.getByText('What do you need?', { selector: 'h3' })).toBeTruthy();
  });

  it('pre-selects services passed from a service page or the calculator', () => {
    renderForm({ initialServices: ['app', 'ebook'], initialSource: 'service-page' });
    expect((screen.getByRole('checkbox', { name: /Mobile App Development/ }) as HTMLInputElement).checked).toBe(true);
    expect((screen.getByRole('checkbox', { name: /E-book Creation/ }) as HTMLInputElement).checked).toBe(true);
    expect((screen.getByRole('checkbox', { name: /Web Design/ }) as HTMLInputElement).checked).toBe(false);
  });

  it('requires a meaningful description on step 2', async () => {
    renderForm();
    await completeStep1();
    fireEvent.change(screen.getByLabelText(/Tell us about your project/), { target: { value: 'too short' } });
    click(/Continue/);
    expect(await screen.findByText('Tell us a bit more (at least 20 characters).')).toBeTruthy();
  });

  it('rejects disallowed files with a clear message and accepts valid ones', async () => {
    const { container } = renderForm();
    await completeStep1();
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;

    fireEvent.change(input, { target: { files: [new File([new Uint8Array(4)], 'setup.exe')] } });
    expect(await screen.findByText("setup.exe isn't an allowed file type.")).toBeTruthy();

    fireEvent.change(input, { target: { files: [new File([PNG_BYTES], 'logo.png', { type: 'image/png' })] } });
    expect(await screen.findByText('logo.png')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Remove logo.png' })).toBeTruthy();

    click('Remove logo.png');
    await waitFor(() => expect(screen.queryByText('logo.png')).toBeNull());
  });

  it('requires consent and a valid email on the last step', async () => {
    renderForm();
    await completeStep1();
    await completeStep2();
    fireEvent.change(screen.getByLabelText('Full name'), { target: { value: 'Amelia Hart' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'nope' } });
    click(/Send my request/);
    expect(await screen.findByText('Please enter a valid email address.')).toBeTruthy();
    expect(screen.getByText('Please accept the privacy terms to continue.')).toBeTruthy();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('submits the form data and files, then shows the reference number', async () => {
    fetchMock.mockResolvedValue({
      json: async () => ({ ok: true, referenceId: 'TSL-20261109-ABC234', attachmentsReceived: 1 }),
    });
    const { container } = renderForm();
    await completeStep1();
    fireEvent.change(container.querySelector('input[type="file"]') as HTMLInputElement, {
      target: { files: [new File([PNG_BYTES], 'logo.png', { type: 'image/png' })] },
    });
    await screen.findByText('logo.png');
    await completeStep2();
    fillStep3();
    click(/Send my request/);

    expect(await screen.findByText('TSL-20261109-ABC234')).toBeTruthy();
    expect(screen.getByText(/amelia@example.com/)).toBeTruthy();

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('/api/contact');
    expect(init.method).toBe('POST');
    const body = init.body as FormData;
    expect(body.get('name')).toBe('Amelia Hart');
    expect(body.get('email')).toBe('amelia@example.com');
    expect(body.getAll('services')).toEqual(['web']);
    expect(body.get('budget')).toBe('5k-15k');
    expect(body.get('timeline')).toBe('1-3-months');
    expect(body.get('consent')).toBe('true');
    expect(body.get('website')).toBe('');
    const files = body.getAll('attachments') as File[];
    expect(files).toHaveLength(1);
    expect(files[0]?.name).toBe('logo.png');

    // Draft is cleared after a successful send.
    expect(sessionStorage.getItem('tsl.draft')).toBeNull();
  });

  it('shows server errors, keeps the data and lets the visitor retry', async () => {
    fetchMock.mockResolvedValue({
      json: async () => ({
        ok: false,
        error: { code: 'DISPATCH_FAILED', message: "We couldn't send your request. Please try again or email hello@topsmartllc.com." },
      }),
    });
    renderForm();
    await completeStep1();
    await completeStep2();
    fillStep3();
    click(/Send my request/);

    expect(await screen.findByText(/We couldn't send your request/)).toBeTruthy();
    expect((screen.getByLabelText('Full name') as HTMLInputElement).value).toBe('Amelia Hart');
    expect((screen.getByRole('button', { name: /Send my request/ }) as HTMLButtonElement).disabled).toBe(false);
  });

  it('maps server field errors back to the right step', async () => {
    fetchMock.mockResolvedValue({
      json: async () => ({
        ok: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Please fix the highlighted fields.',
          fields: { description: 'Tell us a bit more (at least 20 characters).' },
        },
      }),
    });
    renderForm();
    await completeStep1();
    await completeStep2();
    fillStep3();
    click(/Send my request/);

    expect(await screen.findByText('Tell us about your project', { selector: 'h3' })).toBeTruthy();
    expect(screen.getByText('Tell us a bit more (at least 20 characters).')).toBeTruthy();
  });

  it('shows a friendly error when the network fails', async () => {
    fetchMock.mockRejectedValue(new Error('offline'));
    renderForm();
    await completeStep1();
    await completeStep2();
    fillStep3();
    click(/Send my request/);
    expect(await screen.findByText('We could not send your request. Please try again.')).toBeTruthy();
  });

  it('restores a saved draft of text fields but never the consent', async () => {
    sessionStorage.setItem(
      'tsl.draft',
      JSON.stringify({ name: 'Saved Name', email: 'saved@example.com', description: 'Saved description text here', consent: true }),
    );
    renderForm({ initialServices: ['web'] });
    // Web is already pre-selected, so only choose budget and timeline.
    click('$5,000 – $15,000', 'radio');
    click('1 – 3 months', 'radio');
    click(/Continue/);
    await screen.findByText('Tell us about your project', { selector: 'h3' });
    await completeStep2('Saved description text here');
    await waitFor(() => expect((screen.getByLabelText('Full name') as HTMLInputElement).value).toBe('Saved Name'));
    expect((screen.getByRole('checkbox', { name: /I agree/ }) as HTMLInputElement).checked).toBe(false);
  });

  it('includes the calculator estimate when arriving from the calculator', async () => {
    sessionStorage.setItem(
      'tsl.estimate',
      JSON.stringify({ services: ['web'], summary: 'Web Design & Development (Growth, 5 pages): $3,500' }),
    );
    renderForm({ initialSource: 'calculator', initialServices: ['web'] });
    expect(await screen.findByText(/Your calculator estimate is attached/)).toBeTruthy();
  });
});

describe('OrderForm error handling does not get in the way of clicking', () => {
  it('clears each error as soon as its field is fixed, so a single click on Continue then advances', async () => {
    renderForm({ initialServices: ['web'] });
    click(/Continue/);
    expect(await screen.findByText('Please choose a budget range.')).toBeTruthy();
    expect(screen.getByText(/Please fix the 2 highlighted fields/)).toBeTruthy();

    click('$5,000 – $15,000', 'radio');
    await waitFor(() => expect(screen.queryByText('Please choose a budget range.')).toBeNull());
    expect(screen.getByText(/Please fix the 1 highlighted field to continue/)).toBeTruthy();

    click('1 – 3 months', 'radio');
    await waitFor(() => expect(screen.queryByText('Please choose a timeline.')).toBeNull());
    // The banner is already gone before the visitor reaches for Continue, so nothing shifts under the pointer.
    expect(screen.queryByText(/Please fix the/)).toBeNull();

    click(/Continue/);
    expect(await screen.findByText('Tell us about your project', { selector: 'h3' })).toBeTruthy();
  });

  it('does not show an error just because the visitor tabbed through a field (no validation on blur)', async () => {
    renderForm();
    await completeStep1();
    await completeStep2();
    const email = screen.getByLabelText('Email');
    fireEvent.focus(email);
    fireEvent.blur(email);
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(screen.queryByText('Please enter a valid email address.')).toBeNull();
  });

  it('re-checks a text field while the visitor types once it has an error', async () => {
    renderForm();
    await completeStep1();
    await completeStep2();
    click(/Send my request/);
    expect(await screen.findByText('Please enter your full name.')).toBeTruthy();

    fireEvent.change(screen.getByLabelText('Full name'), { target: { value: 'Amelia Hart' } });
    await waitFor(() => expect(screen.queryByText('Please enter your full name.')).toBeNull());
  });
});
