import { ImageResponse } from 'next/og';

export const alt = 'Rufus Bird Art Advisory — Independent counsel for collectors';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#F4EFE4',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Georgia, serif',
          padding: '80px',
        }}
      >
        {/* Wordmark */}
        <div
          style={{
            display: 'flex',
            fontSize: 72,
            fontStyle: 'italic',
            color: '#1C1A17',
            letterSpacing: '-0.01em',
            lineHeight: 1.1,
          }}
        >
          Rufus&nbsp;
          <span style={{ color: '#6B1F2A' }}>Bird</span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            marginTop: 16,
            fontSize: 28,
            color: '#5A5140',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}
        >
          Art Advisory
        </div>

        {/* Rule */}
        <div
          style={{
            marginTop: 40,
            marginBottom: 40,
            width: 80,
            height: 1,
            background: '#C9BFA8',
          }}
        />

        {/* Tagline */}
        <div
          style={{
            fontSize: 22,
            color: '#7A6E55',
            fontStyle: 'italic',
            letterSpacing: '0.02em',
          }}
        >
          Counsel for the world&apos;s collectors.
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
