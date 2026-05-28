import Link from 'next/link'
import Nav from '@/components/ui/Nav'
import RecipeCard from '@/components/recipe/RecipeCard'
import { getAllRecipes, getCategories } from '@/lib/queries'
import styles from './page.module.css'

export const revalidate = 60

export const metadata = {
  title: 'All Recipes — Thambuli, Saaru & Bajji',
  description: 'Browse all of Amma\'s recipes — Thambuli, Saaru, Bajji and more.',
}

export default async function RecipesPage({
  searchParams,
}: {
  searchParams: Promise<{ source?: string; category?: string }>
}) {
  const { source, category } = await searchParams
  const [allRecipes, categories] = await Promise.all([
    getAllRecipes(),
    getCategories(),
  ])

  // Filter client-side from the full list
  const filtered = allRecipes.filter((r) => {
    if (source && r.source !== source) return false
    if (category && r.categories.slug !== category) return false
    return true
  })

  const activeFilter = source || category || 'all'

  return (
    <>
      <Nav />
      <main className={styles.page}>

        {/* Page header */}
        <div className={styles.pageHeader}>
          <div>
            <p className={styles.eyebrow}>The collection</p>
            <h1 className={styles.pageTitle}>All <em>recipes</em></h1>
            <p className={styles.pageSub}>
              {allRecipes.length} recipe{allRecipes.length !== 1 ? 's' : ''} and counting.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className={styles.filters}>
          <Link
            href="/recipes"
            className={`${styles.filter} ${activeFilter === 'all' ? styles.filterActive : ''}`}
          >
            All
          </Link>
          <Link
            href="/recipes?source=mom"
            className={`${styles.filter} ${activeFilter === 'mom' ? styles.filterActive : ''}`}
          >
            Amma's recipes
          </Link>
          <Link
            href="/recipes?source=family"
            className={`${styles.filter} ${activeFilter === 'family' ? styles.filterActive : ''}`}
          >
            Family recipes
          </Link>
          <div className={styles.filterDivider} />
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/recipes?category=${cat.slug}`}
              className={`${styles.filter} ${activeFilter === cat.slug ? styles.filterActive : ''}`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className={styles.grid}>
            {filtered.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>No recipes here yet</p>
            <p className={styles.emptySub}>Check back soon — Amma is cooking.</p>
            <Link href="/recipes" className={styles.emptyLink}>See all recipes</Link>
          </div>
        )}

      </main>

      <footer className={styles.footer}>
        <p className={styles.footerLogo}>Thambuli, Saaru &amp; Bajji</p>
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
