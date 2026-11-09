import type { Metadata, Viewport } from 'next';
import { Inter, Sora } from 'next/font/google';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { SkipLink } from '@/components/layout/SkipLink';
import { StickyCta } from '@/components/layout/StickyCta';
import { JsonLd } from '@/components/ui/JsonLd';
import { organizationJsonLd } from '@/lib/seo';
import './globals.css';

const sora = Sora({ subsets: ['latin'], variable: '--font-sora', display: 'swap' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'TopSmartLLC — Web, Mobile Apps, Content & E-book Services',
    template: '%s | TopSmartLLC',
  },
  description:
    'TopSmartLLC is your single partner for web design and development, Android and iOS apps, SEO content writing, and e-book creation and publishing.',
  openGraph: { type: 'website', siteName: 'TopSmartLLC', url: siteUrl },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0b1020' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable}`}>
      <body>
        <JsonLd data={organizationJsonLd()} />
        <SkipLink />
        <Header />
        <main id="main-content" tabIndex={-1} className="min-h-[60vh] outline-none">
          {children}
        </main>
        <Footer />
        <StickyCta />
      </body>
    </html>
  );
}
