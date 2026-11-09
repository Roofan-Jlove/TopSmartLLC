import { site } from './site';

/**
 * Legal page content. Written to describe exactly what this website does today
 * (order form, email delivery, no database, no analytics). It is a solid starting
 * point but is not legal advice: have a qualified lawyer review it for your
 * jurisdiction before launch, and update it if tracking or analytics are added.
 */

export type LegalSection = {
  heading: string;
  paragraphs?: string[];
  list?: string[];
};

export type LegalDocument = {
  title: string;
  description: string;
  path: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
};

const contact = `${site.email}`;

export const privacyPolicy: LegalDocument = {
  title: 'Privacy Policy',
  description:
    'How TopSmartLLC collects, uses and protects the personal data and files you send through our website.',
  path: '/privacy',
  lastUpdated: '9 November 2026',
  intro: `This policy explains what personal data ${site.name} collects through this website, why we collect it and what your rights are. We keep it deliberately simple because we collect very little.`,
  sections: [
    {
      heading: 'Who we are',
      paragraphs: [
        `${site.legalName} ("we", "us") operates this website and is the controller of the personal data described below. You can contact us at ${contact}.`,
      ],
    },
    {
      heading: 'What we collect',
      paragraphs: ['We collect only what you choose to send us through the order request form or by email:'],
      list: [
        'Contact details: your name, email address and, optionally, phone number and company name.',
        'Project details: the services you are interested in, your budget range, timeline, project description and any reference links.',
        'Files and images you choose to attach to your request.',
        'Estimate details, if you send us a price estimate from our calculator.',
        'The time you agreed to this policy, and a reference number for your request.',
        'Basic technical data that any web server processes to deliver pages and protect the form from abuse, such as your IP address and browser type.',
      ],
    },
    {
      heading: 'How we use your data',
      list: [
        'To read your request, reply to you and prepare a quote.',
        'To deliver the services you ask us to provide.',
        'To prevent spam and abuse of our forms (rate limiting and a hidden spam-trap field).',
        'To meet our legal and accounting obligations if you become a client.',
      ],
      paragraphs: ['We do not sell your data, and we do not use it for advertising.'],
    },
    {
      heading: 'Legal basis',
      paragraphs: [
        'Where data protection law applies, we rely on your consent (you tick a box before sending the form), on taking steps at your request before entering into a contract, and on our legitimate interest in keeping our website secure.',
      ],
    },
    {
      heading: 'How your request reaches us, and where it is stored',
      paragraphs: [
        'When you submit the form, your details and any attached files are sent to us by email through our email delivery provider. This website does not keep a database of requests and does not save your attached files on its own servers.',
        'Your request therefore exists in our business mailbox and in the delivery logs of our email provider. We keep it for as long as needed to respond to you and, if you become a client, to deliver and document the work.',
      ],
    },
    {
      heading: 'Who we share data with',
      list: [
        'Our email delivery provider, which transmits your request to us.',
        'Our website hosting provider, which serves this website and processes technical request data.',
        'An optional internal notification tool (for example a team chat or CRM) if we have enabled one. It receives your request details but never your file contents.',
        'Professional advisers or authorities where the law requires it.',
      ],
      paragraphs: ['These providers act on our instructions and may process data in countries outside your own.'],
    },
    {
      heading: 'Cookies and similar technologies',
      paragraphs: [
        'We do not use advertising or analytics cookies. While you fill in the order form, the page keeps a temporary draft in your browser so you do not lose your work. It is removed when you close the tab or send the form. See our Cookie Policy for details.',
      ],
    },
    {
      heading: 'Security',
      paragraphs: [
        'We use encrypted connections (HTTPS), validate and limit what the form accepts, check attached files before they are sent, and never expose secret keys to your browser. No system is perfectly secure, so please avoid sending highly sensitive information such as passwords or payment card numbers through the form.',
      ],
    },
    {
      heading: 'Your rights',
      paragraphs: [
        `Depending on where you live, you may have the right to access, correct, delete or restrict the use of your personal data, to object to its use, to withdraw consent, and to complain to your data protection authority. To use any of these rights, email ${contact}. We will reply within a reasonable time and, where we hold your request in our mailbox, delete it on request unless we must keep it by law.`,
      ],
    },
    {
      heading: 'Children',
      paragraphs: ['Our services are for businesses and adults. We do not knowingly collect data from children.'],
    },
    {
      heading: 'Changes to this policy',
      paragraphs: [
        'If we change how we handle data, for example by adding analytics, we will update this page and the date above before the change takes effect.',
      ],
    },
  ],
};

export const termsOfService: LegalDocument = {
  title: 'Terms of Service',
  description: 'The terms that apply when you use the TopSmartLLC website and engage us for web, app, content or e-book work.',
  path: '/terms',
  lastUpdated: '9 November 2026',
  intro: `These terms apply to your use of this website and to services we provide to you. Where you sign a written quote or agreement with ${site.name}, that document takes priority over these terms if they conflict.`,
  sections: [
    {
      heading: 'Our services',
      paragraphs: [
        'We provide web design and development, mobile app development, content writing and copywriting, and e-book creation and publishing support, together with related add-on services described on our website.',
      ],
    },
    {
      heading: 'Estimates, quotes and orders',
      paragraphs: [
        'Prices, ranges and the calculator on this website are indicative estimates and are not an offer. Submitting an order request does not create a contract.',
        'A contract is formed only when we send you a written quote that sets out the scope, price, timeline and payment schedule, and you accept it. The price in an accepted quote stays fixed unless the agreed scope changes.',
      ],
    },
    {
      heading: 'Payment',
      paragraphs: [
        'Payment amounts and milestones are stated in your accepted quote. We may pause work if an invoice is overdue. Third-party costs such as domain names, hosting, store developer accounts, stock assets or paid software licences are not included unless the quote says so.',
      ],
    },
    {
      heading: 'Revisions and your responsibilities',
      list: [
        'Each package includes the number of revision rounds shown on its description. Further revisions or changes to the agreed scope can be quoted separately.',
        'You agree to give us accurate information, content and feedback in good time. Delays on your side may move the delivery dates.',
        'You confirm that you have the right to use all text, images, logos, data and files you give us, and that they do not infringe anyone else’s rights or break the law.',
      ],
    },
    {
      heading: 'Timelines',
      paragraphs: [
        'Timelines on this website are typical ranges. The dates in your accepted quote are our commitment, subject to you providing what we need on time and to events outside our reasonable control.',
      ],
    },
    {
      heading: 'Ownership and licences',
      paragraphs: [
        'Once we have received full payment, you own the final deliverables created for you, including designs, source code, written content and manuscripts, apart from third-party and open-source components, which stay under their own licences.',
        'You grant us permission to use the materials you provide only to carry out the work. Unless you tell us otherwise in writing, we may describe the project and show non-confidential results in our portfolio.',
      ],
    },
    {
      heading: 'Confidentiality',
      paragraphs: [
        'We treat the non-public information and files you share with us as confidential and use them only to deliver your project. We will sign a non-disclosure agreement on request.',
      ],
    },
    {
      heading: 'Guarantees and refunds',
      paragraphs: [
        'Any satisfaction guarantee, refund or support period that applies to your project is stated in your accepted quote and applies only as written there.',
      ],
    },
    {
      heading: 'Limits on our liability',
      paragraphs: [
        'We take care in everything we deliver, but we cannot promise particular business results, such as search rankings, sales or app store approval, because they depend on factors outside our control. To the extent the law allows, we are not liable for indirect or consequential losses, and our total liability for any claim is limited to the amount you paid us for the service the claim relates to. Nothing in these terms limits liability that cannot be limited by law.',
      ],
    },
    {
      heading: 'Using this website',
      list: [
        'Do not misuse the website or its forms, attempt to disrupt or gain unauthorised access to it, or send malicious files.',
        'The website design, text and branding belong to us or our licensors and may not be copied without permission.',
      ],
    },
    {
      heading: 'Ending an engagement',
      paragraphs: [
        'Either of us can end an engagement with written notice. You will pay for work completed up to the end date, and we will hand over the work completed and paid for.',
      ],
    },
    {
      heading: 'Governing law and changes',
      paragraphs: [
        'These terms are governed by the laws of the jurisdiction in which TopSmartLLC is registered, and the courts of that jurisdiction will handle any dispute that cannot be settled by discussion.',
        `We may update these terms from time to time. The date at the top shows the latest version. Questions are welcome at ${contact}.`,
      ],
    },
  ],
};

export const cookiePolicy: LegalDocument = {
  title: 'Cookie Policy',
  description: 'What cookies and browser storage the TopSmartLLC website uses, and how to control them.',
  path: '/cookies',
  lastUpdated: '9 November 2026',
  intro: 'This page explains what small pieces of data this website keeps in your browser. At the time of writing we use no tracking, analytics or advertising cookies.',
  sections: [
    {
      heading: 'What are cookies?',
      paragraphs: [
        'Cookies are small text files that websites store on your device. Similar technologies, such as your browser’s session storage, can also remember information while you use a site.',
      ],
    },
    {
      heading: 'What this website stores',
      list: [
        'Order form draft (session storage, key "tsl.draft"): the text you type into the order form, kept so you do not lose it if you reload the page. It is deleted when you close the tab or send the form. Attached files, your consent tick and your calculator estimate are never part of it.',
        'Calculator estimate (session storage, key "tsl.estimate"): the summary of the estimate you choose to send to the order form. It is deleted once the form is sent.',
      ],
      paragraphs: [
        'These items are strictly necessary for the features you ask for, stay on your device, and are not used to track you, so they do not need a consent banner.',
      ],
    },
    {
      heading: 'What we do not use',
      paragraphs: [
        'We do not currently use analytics, advertising, social media or other tracking cookies. If we add any in future, we will ask for your consent first, give you a clear choice to refuse, and update this page.',
      ],
    },
    {
      heading: 'Third parties',
      paragraphs: [
        'Fonts and images on this website are served from our own domain, and we do not embed third-party widgets that set cookies. Links to social networks lead to their own sites, which have their own cookie policies.',
      ],
    },
    {
      heading: 'Controlling storage in your browser',
      paragraphs: [
        'You can delete or block cookies and site storage in your browser settings. The website will still work, but the order form will not keep a draft if you reload the page.',
      ],
    },
    {
      heading: 'Contact',
      paragraphs: [`Questions about this policy? Email ${contact}.`],
    },
  ],
};
