import Link from 'next/link'
import Nav from '@/components/ui/Nav'
import styles from './page.module.css'

export const metadata = {
  title: 'About — Thambuli, Saaru & Bajji',
  description: 'The story behind Amma\'s kitchen and the recipes preserved here.',
}

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className={styles.page}>

        {/* Hero */}
        <div className={styles.hero}>
          <div className={styles.heroText}>
            <p className={styles.eyebrow}>Meet the cook</p>
            <h1 className={styles.title}>Amma&apos;s kitchen<br /><em>has always been open</em></h1>
          </div>
          <div className={styles.heroPhoto}>
            <div className={styles.photoPlaceholder}>
              <span>Amma&apos;s photo</span>
            </div>
          </div>
        </div>

        {/* Story */}
        <div className={styles.story}>
          <div className={styles.storyBody}>
            <p>
              For over thirty years, the same hands have been making the same Saaru on the same
              stove in Karnataka. The proportions were never written down. The timing was always felt.
            </p>
            <p>
              This site exists because those recipes deserve to outlast memory. Every dish here comes
              directly from Amma — the way she makes it, with her notes, her shortcuts, and her
              insistence on getting it right.
            </p>
            <p>
              Some of these dishes go back further than her — to her mother, and her mother before
              that. Thambuli made for temple days. Saaru cooked on rainy evenings. Bajji fried for
              anyone who arrived unannounced. Each one carries a context that a list of ingredients
              can&apos;t hold.
            </p>
            <p>
              So alongside the recipe, we&apos;ve tried to keep the story. The family notes, the tips
              she gives without being asked, the variations that appear depending on the season or
              who&apos;s eating. That&apos;s the part that usually gets lost first.
            </p>
          </div>

          {/* Stats */}
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>30+</span>
              <span className={styles.statLabel}>Years cooking</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>3</span>
              <span className={styles.statLabel}>Generations</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>1</span>
              <span className={styles.statLabel}>Kitchen</span>
            </div>
          </div>
        </div>

        {/* About the site */}
        <div className={styles.siteSection}>
          <h2 className={styles.sectionTitle}>About the site</h2>
          <div className={styles.siteCols}>
            <div>
              <h3 className={styles.subTitle}>Why we built this</h3>
              <p>
                This is a personal project built by Prapthi — Amma&apos;s daughter. The goal was
                simple: take every recipe that lived in Amma&apos;s head or on scraps of paper, and
                put them somewhere they&apos;ll never disappear.
              </p>
              <p>
                We cook together, she tells me what to write, and I make sure it ends up here exactly
                as she&apos;d want it. No embellishment, no food-magazine language. Just the food.
              </p>
            </div>
            <div>
              <h3 className={styles.subTitle}>What you&apos;ll find here</h3>
              <p>
                Karnataka home cooking — Thambuli (yogurt-based cooling salads), Saaru (thin
                tamarind rasam and soups), Bajji (fritters and snacks), and everything that fills
                out a proper meal: sides, sweets, drinks.
              </p>
              <p>
                These are everyday dishes, not restaurant food. Designed to be cooked on a Tuesday
                evening with whatever is in the kitchen.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className={styles.cta}>
          <h2 className={styles.ctaTitle}>Start with the recipes</h2>
          <p className={styles.ctaSub}>
            Browse everything Amma has shared so far — more is added every week.
          </p>
          <Link href="/recipes" className={styles.ctaBtn}>Browse all recipes →</Link>
        </div>

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
