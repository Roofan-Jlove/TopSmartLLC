import { ImageResponse } from 'next/og';

// The edge runtime loads the bundled font differently from Node, which avoids an "Invalid URL" build
// failure seen with next/og on Windows drive paths.
export const runtime = 'edge';

export const alt ='TopSmartLLC: websites, mobile apps, content writing and e-books';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const SERVICES = ['Web Design', 'Mobile Apps', 'Content Writing', 'E-book Publishing'];

/** Generated at build time, so there is no binary asset to maintain. Used for every page's share preview. */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          color: 'white',
          backgroundImage: 'linear-gradient(135deg, #3730a3 0%, #4f46e5 55%, #0e7490 100%)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 40, fontWeight: 700 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: 'rgba(255,255,255,0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 18,
              fontSize: 36,
            }}
          >
            T
          </div>
          TopSmartLLC
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
            One expert team for your website, app, content and e-book.
          </div>
        </div>

        <div style={{ display: 'flex' }}>
          {SERVICES.map((label) => (
            <div
              key={label}
              style={{
                marginRight: 16,
                padding: '12px 26px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.18)',
                fontSize: 28,
                fontWeight: 600,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
