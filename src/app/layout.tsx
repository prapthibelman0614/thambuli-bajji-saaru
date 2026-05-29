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
        <div id="google_translate_element" style={{
          position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000,
          background: '#F5EDD8', border: '0.5px solid rgba(196,96,26,0.3)',
          borderRadius: '6px', padding: '6px 10px',
        }} />
        <Script src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" strategy="afterInteractive" />
        <Script id="google-translate-init" strategy="afterInteractive">{`
          function googleTranslateElementInit() {
            new google.translate.TranslateElement({
              pageLanguage: 'en',
              includedLanguages: 'kn,en',
              layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false,
            }, 'google_translate_element');
          }
        `}</Script>
      </body>
    </html>
  )
}
