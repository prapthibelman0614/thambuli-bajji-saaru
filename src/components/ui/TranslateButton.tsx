'use client'

export default function TranslateButton() {
  function toggle() {
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement
    if (select) {
      select.value = select.value === 'kn' ? 'en' : 'kn'
      select.dispatchEvent(new Event('change'))
    }
  }

  return (
    <button
      onClick={toggle}
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
  )
}
