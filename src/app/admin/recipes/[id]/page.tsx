import { notFound } from 'next/navigation'
import Link from 'next/link'
import RecipeForm from '@/components/recipe/RecipeForm'
import { getCategories } from '@/lib/queries'
import { supabase } from '@/lib/supabase'
import styles from './page.module.css'

export const metadata = { title: 'Edit Recipe — Admin' }

export default async function EditRecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [{ data: recipe }, categories] = await Promise.all([
    supabase.from('recipes').select('*').eq('id', id).single(),
    getCategories(),
  ])

  if (!recipe) notFound()

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <Link href="/admin" className={styles.back}>← Back to recipes</Link>
          <h1 className={styles.title}>Edit — {recipe.title}</h1>
        </div>
      </div>
      <RecipeForm categories={categories} initial={recipe} mode="edit" />
    </div>
  )
}
