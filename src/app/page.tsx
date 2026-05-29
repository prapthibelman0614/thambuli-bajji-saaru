import Link from 'next/link'
import Nav from '@/components/ui/Nav'
import RecipeCard from '@/components/recipe/RecipeCard'
import { getFeaturedRecipes, getNewRecipes, getCategories } from '@/lib/queries'
import styles from './page.module.css'

export const revalidate = 60 // revalidate every 60 seconds

export default async function HomePage() {
  const [featured, newRecipes, categories] = await Promise.all([
    getFeaturedRecipes(),
    getNewRecipes(),
    getCategories(),
  ])

  return (
    <>
      <Nav />
      <main>

        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.heroLeft}>
            <p className={styles.eyebrow}>Karnataka Kitchen · Family Recipes · Made with love</p>
            <h1 className={styles.heroTitle}>
              Amma&apos;s recipes,<br />
              as they were<br />
              <em>meant to be eaten</em>
            </h1>
            <p className={styles.heroSub}>
              Generations of home cooking from one Karnataka kitchen — Thambuli, Saaru,
              Bajji and everything in between. Preserved here so nothing gets lost.
            </p>
            <div className={styles.heroBtns}>
              <Link href="/recipes" className={styles.btnPrimary}>Browse all recipes</Link>
              <Link href="/about" className={styles.btnSecondary}>Our story →</Link>
            </div>
          </div>
          <div className={styles.heroRight}>
            <div className={styles.heroPattern} aria-hidden="true" />
            <div className={styles.heroLogoArea}>
              <div className={styles.heroLogo}>
              <img
                src="/Thambuli-Bajji-Saaru Logo.png"
                alt="Thambuli, Saaru & Bajji logo"
                width={280}
                height={280}
                style={{ objectFit: 'contain' }}
              />
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div className={styles.divider}>
          <span>From our kitchen to yours</span>
        </div>

        {/* Categories */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Browse by <em>category</em></h2>
            <Link href="/categories" className={styles.seeAll}>See all →</Link>
          </div>
          <div className={styles.categoryGrid}>
            {categories.map((cat) => (
              <Link key={cat.id} href={`/categories/${cat.slug}`} className={styles.catCard}>
                <div className={styles.catImage}>
                  <span>{cat.name[0]}</span>
                </div>
                <div className={styles.catInfo}>
                  <p className={styles.catName}>{cat.name}</p>
                  <p className={styles.catDesc}>{cat.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured recipes */}
        <section className={styles.sectionDark}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.darkHeading}>Featured <em>recipes</em></h2>
            <Link href="/recipes" className={styles.seeAllLight}>View all →</Link>
          </div>
          {featured.length > 0 ? (
            <div className={styles.recipeGrid}>
              {featured.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <p className={styles.emptyState}>Recipes coming soon — check back shortly.</p>
          )}
        </section>

        {/* Newly added */}
        {newRecipes.length > 0 && (
          <section className={styles.newStrip}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.newHeading}>Newly <em>added</em></h2>
              <Link href="/new" className={styles.seeAllLight}>See all new →</Link>
            </div>
            <div className={styles.newGrid}>
              {newRecipes.map((recipe) => (
                <Link key={recipe.id} href={`/recipes/${recipe.slug}`} className={styles.newCard}>
                  <p className={styles.newMeta}>{recipe.categories.name} · Added {new Date(recipe.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                  <h3 className={styles.newTitle}>{recipe.title}</h3>
                  <p className={styles.newDesc}>{recipe.description}</p>
                  <span className={styles.newLink}>View recipe →</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Meet the cook */}
        <section className={styles.meet}>
          <div className={styles.meetPhoto}>
            <span>Photo</span>
          </div>
          <div className={styles.meetText}>
            <p className={styles.meetEyebrow}>Meet the cook</p>
            <h2 className={styles.meetName}>Amma</h2>
            <p className={styles.meetBio}>
              For over thirty years, these recipes have come out of one kitchen in Karnataka.
              Each dish here has a story — a festival, a season, a memory. This site is our
              way of making sure they don&apos;t get lost.
            </p>
            <Link href="/about" className={styles.btnPrimary} style={{ display: 'inline-block', marginTop: '1.2rem' }}>
              Read her full story →
            </Link>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <p className={styles.footerLogo}>Thambuli, Saaru &amp; Bajji</p>
        <ul className={styles.footerLinks}>
          <li><Link href="/recipes">Recipes</Link></li>
          <li><Link href="/categories">Categories</Link></li>
          <li><Link href="/new">New</Link></li>
          <li><Link href="/about">About</Link></li>
        </ul>
        <p className={styles.footerCopy}>© {new Date().getFullYear()} Thambuli, Saaru &amp; Bajji</p>
      </footer>
    </>
  )
}
