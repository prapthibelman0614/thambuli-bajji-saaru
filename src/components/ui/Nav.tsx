import Link from 'next/link'
import styles from './Nav.module.css'

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logo}>
        Thambuli, Saaru &amp; Bajji
      </Link>
      <ul className={styles.links}>
        <li><Link href="/recipes">Recipes</Link></li>
        <li><Link href="/categories">Categories</Link></li>
        <li><Link href="/about">About</Link></li>
        <li>
          <Link href="/login" className={styles.signin}>
            Sign in
          </Link>
        </li>
      </ul>
    </nav>
  )
}
