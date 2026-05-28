import Link from 'next/link'
import Image from 'next/image'
import type { RecipeWithCategory } from '@/types/database'
import styles from './RecipeCard.module.css'

interface Props {
  recipe: RecipeWithCategory
}

const difficultyLabel = { easy: 'Easy', medium: 'Medium', hard: 'Hard' }

export default function RecipeCard({ recipe }: Props) {
  const totalTime = recipe.prep_time_mins + recipe.cook_time_mins

  return (
    <Link href={`/recipes/${recipe.slug}`} className={styles.card}>
      <div className={styles.image}>
        {recipe.hero_image_url ? (
          <Image
            src={recipe.hero_image_url}
            alt={recipe.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: 'cover' }}
          />
        ) : (
          <div className={styles.placeholder}>
            <span>{recipe.categories.name}</span>
          </div>
        )}
        {recipe.is_new && <span className={styles.newBadge}>New</span>}
      </div>
      <div className={styles.body}>
        <span className={styles.tag}>{recipe.categories.name}</span>
        <h3 className={styles.title}>{recipe.title}</h3>
        <p className={styles.description}>{recipe.description}</p>
        <div className={styles.meta}>
          <span>{totalTime} min</span>
          <span>·</span>
          <span>{difficultyLabel[recipe.difficulty]}</span>
          <span>·</span>
          <div className={styles.spice} aria-label={`Spice level ${recipe.spice_level} of 3`}>
            {[1, 2, 3].map((dot) => (
              <span
                key={dot}
                className={`${styles.dot} ${dot <= recipe.spice_level ? styles.dotActive : ''}`}
              />
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}
