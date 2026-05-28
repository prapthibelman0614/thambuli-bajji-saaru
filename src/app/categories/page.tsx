import Link from 'next/link'
import Nav from '@/components/ui/Nav'
import { getCategories } from '@/lib/queries'
import styles from './page.module.css'

export const metadata = {
  title: 'Categories — Thambuli, Saaru & Bajji',
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <>
      <Nav />
      <main className={styles.page}>
        <div className={styles.pageHeader}>
          <p className={styles.eyebrow}>Browse the kitchen</p>
          <h1 className={styles.pageTitle}>Categories</h1>
          <p className={styles.pageSub}>Every dish has a home.</p>
        </div>

        <div className={styles.grid}>
          {categories.map((cat) => (
            <Link key={cat.id} href={`/categories/${cat.slug}`} className={styles.card}>
              <div className={styles.cardImage}>
                <span className={styles.cardLetter}>{cat.name[0]}</span>
              </div>
              <div className={styles.cardBody}>
                <h2 className={styles.cardName}>{cat.name}</h2>
                <p className={styles.cardDesc}>{cat.description}</p>
                <span className={styles.cardLink}>Browse {cat.name} →</span>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <footer className={styles.footer}>
        <p>Thambuli, Saaru &amp; Bajji</p>
        <div className={styles.footerLinks}>
          <Link href="/recipes">Recipes</Link>
          <Link href="/categories">Categories</Link>
          <Link href="/about">About</Link>
        </div>
        <p className={styles.footerCopy}>© {new Date().getFullYear()}</p>
      </footer>
    </>
  )
}
