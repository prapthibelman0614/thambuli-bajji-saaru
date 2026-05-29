import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: 'Thambuli, Saaru & Bajji',
  description: 'Amma\'s recipes — generations of home cooking from one Karnataka kitchen.',
  openGraph: {
    title: 'Thambuli, Saaru & Bajji',
    description: 'Amma\'s recipes — generations of home cooking from one Karnataka kitchen.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}
        {/* Hide the Google widget visually but keep it functional */}
        <div id="google_translate_element" style={{ display: 'none' }} />

        {/* Our custom translate button */}
        <button
          onClick={() => {
            const select = document.querySelector('.goog-te-combo') as HTMLSelectElement
            if (select) {
              select.value = select.value === 'kn' ? 'en' : 'kn'
              select.dispatchEvent(new Event('change'))
            }
          }}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 1000,
            background: '#F5EDD8',
            border: '1px solid rgba(196,96,26,0.4)',
            borderRadius: '9999px',
            padding: '10px 18px',
            fontFamily: 'Georgia, serif',
            fontSize: '0.88rem',
            color: '#8B3A20',
            cursor: 'pointer',
            boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
          }}
        >
          ಕನ್ನಡ / EN
        </button>

        <Script src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" strategy="afterInteractive" />
        <Script id="google-translate-init" strategy="afterInteractive">{`
          function googleTranslateElementInit() {
            new google.translate.TranslateElement({
              pageLanguage: 'en',
              includedLanguages: 'kn,en',
              autoDisplay: false,
            }, 'google_translate_element');
          }
        `}</Script>
      </body>
    </html>
  )
}
