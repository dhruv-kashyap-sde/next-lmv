export default function manifest() {
  return {
    name: 'Loot My Vouchers',
    short_name: 'LMV',
    description: 'Claim free vouchers daily and earn rewards with Loot My Vouchers. Discover exclusive deals from top brands.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#f59e0b',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
    categories: ['shopping', 'lifestyle', 'utilities'],
    screenshots: [
      {
        src: '/screenshots/home.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Home Page',
      },
      {
        src: '/screenshots/vouchers.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Vouchers Page',
      },
    ],
  };
}
