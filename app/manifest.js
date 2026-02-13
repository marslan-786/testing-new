export default function manifest() {
  return {
    name: 'StoreX - VIP Earning',
    short_name: 'StoreX',
    description: 'Best Earning Platform',
    start_url: '/',
    display: 'standalone', // Is se browser ka bar khatam ho jayega, full app lagegi
    background_color: '#0a0a0a',
    theme_color: '#0a0a0a',
    icons: [
      {
        src: '/logo.png', // Public folder mein jo logo hai
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
