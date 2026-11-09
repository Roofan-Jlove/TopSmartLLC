import { ImageResponse } from 'next/og';

// Same edge-runtime approach as opengraph-image.tsx (avoids a Windows build error with the Node runtime).
export const runtime = 'edge';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

/** iOS home-screen icon, generated so there is no binary file to maintain. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: 'linear-gradient(135deg, #4f46e5, #0e7490)',
          color: 'white',
          fontSize: 110,
          fontWeight: 800,
        }}
      >
        T
      </div>
    ),
    size,
  );
}
