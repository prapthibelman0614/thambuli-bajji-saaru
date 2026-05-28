import { supabase } from './supabase'
import type { RecipeFull, RecipeWithCategory, Category } from '@/types/database'

// ── Categories ───────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order')

  if (error) throw error
  return data
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) return null
  return data
}

// ── Recipes ──────────────────────────────────────────────────

export async function getFeaturedRecipes(): Promise<RecipeWithCategory[]> {
  const { data, error } = await supabase
    .from('recipes')
    .select('*, categories(*)')
    .eq('is_published', true)
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(4)

  if (error) throw error
  return data as RecipeWithCategory[]
}

export async function getNewRecipes(): Promise<RecipeWithCategory[]> {
  const { data, error } = await supabase
    .from('recipes')
    .select('*, categories(*)')
    .eq('is_published', true)
    .eq('is_new', true)
    .order('created_at', { ascending: false })
    .limit(3)

  if (error) throw error
  return data as RecipeWithCategory[]
}

export async function getAllRecipes(): Promise<RecipeWithCategory[]> {
  const { data, error } = await supabase
    .from('recipes')
    .select('*, categories(*)')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as RecipeWithCategory[]
}

export async function getRecipesByCategory(categorySlug: string): Promise<RecipeWithCategory[]> {
  const { data, error } = await supabase
    .from('recipes')
    .select('*, categories!inner(*)')
    .eq('is_published', true)
    .eq('categories.slug', categorySlug)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as RecipeWithCategory[]
}

export async function getRecipeBySlug(slug: string): Promise<RecipeFull | null> {
  const { data, error } = await supabase
    .from('recipes')
    .select('*, categories(*), recipe_tags(tags(*))')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error) return null
  return data as RecipeFull
}

export async function getRecipesBySource(source: 'mom' | 'family'): Promise<RecipeWithCategory[]> {
  const { data, error } = await supabase
    .from('recipes')
    .select('*, categories(*)')
    .eq('is_published', true)
    .eq('source', source)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as RecipeWithCategory[]
}
