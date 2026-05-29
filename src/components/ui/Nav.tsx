'use client'

import { useState } from 'react'
import Link from 'next/link'
import styles from './Nav.module.css'

export default function Nav() {
  const [open, setOpen] = useState(false)

  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logo} onClick={() => setOpen(false)}>
        Thambuli, Saaru &amp; Bajji
      </Link>

      {/* Desktop links */}
      <ul className={styles.links}>
        <li><Link href="/recipes">Recipes</Link></li>
        <li><Link href="/categories">Categories</Link></li>
        <li><Link href="/about">About</Link></li>
      </ul>

      {/* Burger button — mobile only */}
      <button
        className={styles.burger}
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
        aria-expanded={open}
      >
        <span className={`${styles.bar} ${open ? styles.barOpen1 : ''}`} />
        <span className={`${styles.bar} ${open ? styles.barOpen2 : ''}`} />
        <span className={`${styles.bar} ${open ? styles.barOpen3 : ''}`} />
      </button>

      {/* Mobile dropdown */}
      {open && (
        <div className={styles.mobileMenu}>
          <ul className={styles.mobileLinks}>
            <li><Link href="/recipes" onClick={() => setOpen(false)}>Recipes</Link></li>
            <li><Link href="/categories" onClick={() => setOpen(false)}>Categories</Link></li>
            <li><Link href="/about" onClick={() => setOpen(false)}>About</Link></li>
          </ul>
        </div>
      )}
    </nav>
  )
}
