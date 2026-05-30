'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { RecipeWithCategory } from '@/types/database'
import styles from './page.module.css'

export default function AdminPage() {
  const [recipes, setRecipes] = useState<RecipeWithCategory[]>([])
  const [loading, setLoading] = useState(true)

  async function loadRecipes() {
    const { data } = await supabase
      .from('recipes')
      .select('*, categories(*)')
      .order('created_at', { ascending: false })
    setRecipes((data as RecipeWithCategory[]) ?? [])
    setLoading(false)
  }

  useEffect(() => { loadRecipes() }, [])

  async function toggleFlag(id: string, flag: 'is_published' | 'is_featured' | 'is_new', current: boolean) {
    if (flag === 'is_published') {
    await supabase.from('recipes').update({ is_published: !current } as any).eq('id', id)
    } else if (flag === 'is_featured') {
    await supabase.from('recipes').update({ is_featured: !current } as any).eq('id', id)
    } else {
    await supabase.from('recipes').update({ is_new: !current } as any).eq('id', id)
  }
  loadRecipes()
}

  async function deleteRecipe(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    await supabase.from('recipes').delete().eq('id', id)
    loadRecipes()
  }

  function signOut() {
    sessionStorage.removeItem('admin_auth')
    window.location.reload()
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <p className={styles.eyebrow}>Admin panel</p>
          <h1 className={styles.title}>Recipes</h1>
        </div>
        <div className={styles.headerActions}>
          <Link href="/admin/recipes/new" className={styles.btnPrimary}>+ Add recipe</Link>
          <button onClick={signOut} className={styles.btnSecondary}>Sign out</button>
        </div>
      </div>

      {loading ? (
        <p className={styles.loading}>Loading...</p>
      ) : recipes.length === 0 ? (
        <div className={styles.empty}>
          <p>No recipes yet.</p>
          <Link href="/admin/recipes/new" className={styles.btnPrimary}>Add your first recipe</Link>
        </div>
      ) : (
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <span>Recipe</span>
            <span>Category</span>
            <span>Published</span>
            <span>Featured</span>
            <span>New</span>
            <span>Actions</span>
          </div>
          {recipes.map((r) => (
            <div key={r.id} className={styles.tableRow}>
              <div className={styles.recipeInfo}>
                <p className={styles.recipeName}>{r.title}</p>
                <p className={styles.recipeSlug}>{r.slug}</p>
              </div>
              <span className={styles.tag}>{r.categories.name}</span>
              <button
                className={`${styles.toggle} ${r.is_published ? styles.toggleOn : ''}`}
                onClick={() => toggleFlag(r.id, 'is_published', r.is_published)}
                title="Toggle published"
              >
                {r.is_published ? 'Live' : 'Draft'}
              </button>
              <button
                className={`${styles.toggle} ${r.is_featured ? styles.toggleOn : ''}`}
                onClick={() => toggleFlag(r.id, 'is_featured', r.is_featured)}
                title="Toggle featured"
              >
                {r.is_featured ? '★ Yes' : '☆ No'}
              </button>
              <button
                className={`${styles.toggle} ${r.is_new ? styles.toggleOn : ''}`}
                onClick={() => toggleFlag(r.id, 'is_new', r.is_new)}
                title="Toggle new"
              >
                {r.is_new ? 'New' : '—'}
              </button>
              <div className={styles.actions}>
                <Link href={`/admin/recipes/${r.id}`} className={styles.editBtn}>Edit</Link>
                <Link href={`/recipes/${r.slug}`} target="_blank" className={styles.viewBtn}>View ↗</Link>
                <button
                  onClick={() => deleteRecipe(r.id, r.title)}
                  className={styles.deleteBtn}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
