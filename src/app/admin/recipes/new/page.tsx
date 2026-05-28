import Link from 'next/link'
import RecipeForm from '@/components/recipe/RecipeForm'
import { getCategories } from '@/lib/queries'
import styles from './page.module.css'

export const metadata = { title: 'Add Recipe — Admin' }

export default async function NewRecipePage() {
  const categories = await getCategories()

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <Link href="/admin" className={styles.back}>← Back to recipes</Link>
          <h1 className={styles.title}>Add recipe</h1>
        </div>
      </div>
      <RecipeForm categories={categories} mode="create" />
    </div>
  )
}
