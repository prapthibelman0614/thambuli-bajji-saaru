import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Nav from '@/components/ui/Nav'
import { getRecipeBySlug, getAllRecipes } from '@/lib/queries'
import styles from './page.module.css'

export const revalidate = 60

export async function generateStaticParams() {
  const recipes = await getAllRecipes()
  return recipes.map((r) => ({ slug: r.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const recipe = await getRecipeBySlug(slug)
  if (!recipe) return {}
  return {
    title: `${recipe.title} — Thambuli, Saaru & Bajji`,
    description: recipe.description,
  }
}

const difficultyLabel = { easy: 'Easy', medium: 'Medium', hard: 'Hard' }

export default async function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const recipe = await getRecipeBySlug(slug)
  if (!recipe) notFound()

  const totalTime = recipe.prep_time_mins + recipe.cook_time_mins
  const tags = recipe.recipe_tags?.map((rt: any) => rt.tags) ?? []

  return (
    <>
      <Nav />
      <main className={styles.page}>

        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <Link href="/">Home</Link>
          <span>·</span>
          <Link href="/recipes">Recipes</Link>
          <span>·</span>
          <Link href={`/categories/${recipe.categories.slug}`}>{recipe.categories.name}</Link>
          <span>·</span>
          <span>{recipe.title}</span>
        </div>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerText}>
            <div className={styles.headerMeta}>
              <Link href={`/categories/${recipe.categories.slug}`} className={styles.categoryTag}>
                {recipe.categories.name}
              </Link>
              {recipe.is_new && <span className={styles.newBadge}>New</span>}
              {recipe.source === 'mom' && <span className={styles.sourceBadge}>Amma's recipe</span>}
              {recipe.contributor_name && (
                <span className={styles.sourceBadge}>By {recipe.contributor_name}</span>
              )}
            </div>

            <h1 className={styles.title}>{recipe.title}</h1>
            {recipe.title_kannada && (
              <p className={styles.titleKannada}>{recipe.title_kannada}</p>
            )}
            <p className={styles.description}>{recipe.description}</p>

            {/* Stats row */}
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statLabel}>Prep</span>
                <span className={styles.statValue}>{recipe.prep_time_mins} min</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.stat}>
                <span className={styles.statLabel}>Cook</span>
                <span className={styles.statValue}>{recipe.cook_time_mins} min</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.stat}>
                <span className={styles.statLabel}>Total</span>
                <span className={styles.statValue}>{totalTime} min</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.stat}>
                <span className={styles.statLabel}>Serves</span>
                <span className={styles.statValue}>{recipe.servings}</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.stat}>
                <span className={styles.statLabel}>Difficulty</span>
                <span className={styles.statValue}>{difficultyLabel[recipe.difficulty]}</span>
              </div>
              <div className={styles.statDivider} />
              <div className={styles.stat}>
                <span className={styles.statLabel}>Spice</span>
                <div className={styles.spice}>
                  {[1,2,3].map((d) => (
                    <span key={d} className={`${styles.dot} ${d <= recipe.spice_level ? styles.dotActive : ''}`} />
                  ))}
                </div>
              </div>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className={styles.tags}>
                {tags.map((tag: any) => (
                  <span key={tag.id} className={styles.tag}>{tag.name}</span>
                ))}
              </div>
            )}
          </div>

          {/* Hero image */}
          <div className={styles.heroImage}>
            {recipe.hero_image_url ? (
              <Image
                src={recipe.hero_image_url}
                alt={recipe.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: 'cover' }}
                priority
              />
            ) : (
              <div className={styles.imagePlaceholder}>
                <span>{recipe.categories.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Body — ingredients + steps */}
        <div className={styles.body}>

          {/* Ingredients */}
          <aside className={styles.ingredients}>
            <h2 className={styles.sectionTitle}>Ingredients</h2>
            <p className={styles.servingNote}>For {recipe.servings} servings</p>
            <ul className={styles.ingredientList}>
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className={styles.ingredient}>
                  <span className={styles.ingName}>
                    {ing.name}
                    {ing.note && <em className={styles.ingNote}>, {ing.note}</em>}
                  </span>
                  <span className={styles.ingQty}>
                    {ing.qty !== null ? `${ing.qty}${ing.unit ? ` ${ing.unit}` : ''}` : ing.note ?? ''}
                  </span>
                </li>
              ))}
            </ul>
          </aside>

          {/* Steps */}
          <div className={styles.method}>
            <h2 className={styles.sectionTitle}>Method</h2>
            <ol className={styles.stepList}>
              {recipe.steps
                .sort((a, b) => a.order - b.order)
                .map((step) => (
                  <li key={step.order} className={styles.step}>
                    <div className={styles.stepNumber}>{step.order}</div>
                    <div className={styles.stepContent}>
                      <p className={styles.stepInstruction}>{step.instruction}</p>
                      {step.tip && (
                        <div className={styles.stepTip}>
                          <span className={styles.tipLabel}>Amma's tip</span>
                          <p>{step.tip}</p>
                        </div>
                      )}
                    </div>
                  </li>
                ))}
            </ol>
          </div>
        </div>

        {/* Notes */}
        {(recipe.family_notes || recipe.moms_tips) && (
          <div className={styles.notes}>
            {recipe.family_notes && (
              <div className={styles.noteBlock}>
                <h3 className={styles.noteTitle}>Family notes</h3>
                <p className={styles.noteText}>{recipe.family_notes}</p>
              </div>
            )}
            {recipe.moms_tips && (
              <div className={styles.noteBlock}>
                <h3 className={styles.noteTitle}>Amma's tips</h3>
                <p className={styles.noteText}>{recipe.moms_tips}</p>
              </div>
            )}
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
