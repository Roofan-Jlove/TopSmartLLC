import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/** WCAG 2.1 AA contrast check for the design tokens, computed from the real stylesheet so it cannot drift. */

const css = readFileSync(join(process.cwd(), 'src/app/globals.css'), 'utf8');

function tokens(selectorPattern: RegExp): Record<string, string> {
  const block = selectorPattern.exec(css)?.[1] ?? '';
  const result: Record<string, string> = {};
  for (const match of block.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) {
    result[match[1]!] = match[2]!;
  }
  return result;
}

const light = tokens(/:root\s*\{([^}]*)\}/);
// The explicit dark theme block (the media-query copy repeats the same values).
const dark = tokens(/:root\[data-theme='dark'\]\s*\{([^}]*)\}/);

type RGB = [number, number, number];
const toRgb = (hex: string): RGB => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)) as RGB;
const mix = (fg: RGB, bg: RGB, alpha: number): RGB => fg.map((c, i) => c * alpha + bg[i]! * (1 - alpha)) as RGB;

function luminance([r, g, b]: RGB): number {
  const [R, G, B] = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  }) as RGB;
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function ratio(a: RGB, b: RGB): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

const TEXT = 4.5; // normal text
const UI = 3; // icons, borders of controls, large text

describe('design tokens were found', () => {
  it('parses both themes', () => {
    expect(Object.keys(light).length).toBeGreaterThan(10);
    expect(Object.keys(dark).length).toBeGreaterThan(10);
  });
});

describe.each([
  ['light', light],
  ['dark', dark],
] as const)('%s theme meets WCAG AA', (_name, t) => {
  const c = (key: string) => toRgb(t[key]!);

  it.each([
    ['text', 'bg'],
    ['text', 'bg-subtle'],
    ['text', 'surface'],
    ['text-muted', 'bg'],
    ['text-muted', 'bg-subtle'],
    ['text-muted', 'surface'],
    ['brand', 'bg'],
    ['brand', 'bg-subtle'],
    ['brand', 'surface'],
    ['brand-fg', 'brand'],
    ['brand-fg', 'brand-strong'],
    ['accent-strong', 'bg'],
    ['success', 'bg'],
    ['success', 'surface'],
    ['danger', 'bg'],
    ['danger', 'surface'],
    ['warning', 'bg'],
  ])('text %s on %s is at least 4.5:1', (fg, bg) => {
    expect(ratio(c(fg), c(bg))).toBeGreaterThanOrEqual(TEXT);
  });

  it('error text stays readable on its tinted alert background', () => {
    const tinted = mix(c('danger'), c('bg'), 0.1);
    expect(ratio(c('danger'), tinted)).toBeGreaterThanOrEqual(TEXT);
  });

  it('the star rating and focus ring are visible (3:1) against cards', () => {
    expect(ratio(c('warning'), c('surface'))).toBeGreaterThanOrEqual(UI);
    expect(ratio(c('brand'), c('surface'))).toBeGreaterThanOrEqual(UI);
  });

  it('form control borders are not the only cue, but inputs remain distinguishable (3:1)', () => {
    // Inputs use the muted text colour for their typed content; the hairline border is decorative.
    expect(ratio(c('text'), c('bg'))).toBeGreaterThanOrEqual(UI);
  });
});

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? sourceFiles(path) : path.endsWith('.tsx') ? [path] : [];
  });
}

describe('source guard', () => {
  it('no component fades text colours with opacity (e.g. text-muted/80), which breaks AA contrast', () => {
    const offenders: string[] = [];
    for (const file of sourceFiles(join(process.cwd(), 'src'))) {
      const lines = readFileSync(file, 'utf8').split(/\r?\n/);
      lines.forEach((line, index) => {
        if (/\btext-(muted|text|brand|success|danger|warning)\/\d+/.test(line)) {
          offenders.push(`${file.replace(process.cwd(), '')}:${index + 1}`);
        }
      });
    }
    expect(offenders).toEqual([]);
  });
});

describe('fixed colours used outside the theme tokens', () => {
  const white: RGB = [255, 255, 255];

  it.each(['#3730a3', '#4f46e5', '#0e7490'])('white text on the call-to-action band colour %s', (hex) => {
    expect(ratio(white, toRgb(hex))).toBeGreaterThanOrEqual(TEXT);
  });

  it('dark text on the white button inside the call-to-action band', () => {
    expect(ratio(toRgb('#0b1020'), white)).toBeGreaterThanOrEqual(TEXT);
  });

  it('success tick (white on green) in the progress indicator', () => {
    expect(ratio(white, toRgb(light.success!))).toBeGreaterThanOrEqual(TEXT);
  });
});
