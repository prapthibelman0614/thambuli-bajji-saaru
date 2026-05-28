import { notFound } from 'next/navigation'
import Link from 'next/link'
import Nav from '@/components/ui/Nav'
import RecipeCard from '@/components/recipe/RecipeCard'
import { getCategoryBySlug, getRecipesByCategory, getCategories } from '@/lib/queries'
import styles from './page.module.css'

export const revalidate = 60

export async function generateStaticParams() {
  const categories = await getCategories()
  return categories.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) return {}
  return {
    title: `${category.name} — Thambuli, Saaru & Bajji`,
    description: category.description ?? undefined,
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [category, recipes] = await Promise.all([
    getCategoryBySlug(slug),
    getRecipesByCategory(slug),
  ])

  if (!category) notFound()

  return (
    <>
      <Nav />
      <main className={styles.page}>

        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <span>·</span>
          <Link href="/categories">Categories</Link>
          <span>·</span>
          <span>{category.name}</span>
        </div>

        {/* Header */}
        <div className={styles.pageHeader}>
          <p className={styles.eyebrow}>Category</p>
          <h1 className={styles.pageTitle}>{category.name}</h1>
          {category.description && (
            <p className={styles.pageSub}>{category.description}</p>
          )}
          <p className={styles.recipeCount}>
            {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Recipes */}
        {recipes.length > 0 ? (
          <div className={styles.grid}>
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>No {category.name} recipes yet</p>
            <p className={styles.emptySub}>Amma is working on it.</p>
            <Link href="/recipes" className={styles.emptyLink}>Browse all recipes →</Link>
          </div>
        )}

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
