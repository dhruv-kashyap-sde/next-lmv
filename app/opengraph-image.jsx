import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Loot My Vouchers - Claim Free Vouchers Daily';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
        }}
      >
        {/* Decorative elements */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(245, 158, 11, 0.15) 0%, transparent 50%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 80% 50%, rgba(245, 158, 11, 0.1) 0%, transparent 50%)',
          }}
        />

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
        >
          {/* Logo/Title */}
          <div
            style={{
              fontSize: 80,
              fontWeight: 'bold',
              color: '#f59e0b',
              marginBottom: 20,
              textShadow: '0 4px 20px rgba(245, 158, 11, 0.5)',
            }}
          >
            LOOT MY VOUCHERS
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 36,
              color: '#ffffff',
              marginBottom: 40,
              opacity: 0.9,
            }}
          >
            Claim Free Vouchers Daily
          </div>

          {/* Features */}
          <div
            style={{
              display: 'flex',
              gap: '40px',
              marginTop: 20,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#d1d5db',
                fontSize: 24,
              }}
            >
              <span style={{ color: '#f59e0b' }}>✓</span> Top Brands
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#d1d5db',
                fontSize: 24,
              }}
            >
              <span style={{ color: '#f59e0b' }}>✓</span> Daily Rewards
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#d1d5db',
                fontSize: 24,
              }}
            >
              <span style={{ color: '#f59e0b' }}>✓</span> Exclusive Deals
            </div>
          </div>
        </div>

        {/* Domain */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            fontSize: 24,
            color: '#6b7280',
          }}
        >
          lootmyvouchers.in
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
