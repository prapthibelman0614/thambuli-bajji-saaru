export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      recipes: {
        Row: Recipe
        Insert: Omit<Recipe, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Recipe, 'id' | 'created_at' | 'updated_at'>>
      }
      categories: {
        Row: Category
        Insert: Omit<Category, 'id'>
        Update: Partial<Omit<Category, 'id'>>
      }
      tags: {
        Row: Tag
        Insert: Omit<Tag, 'id'>
        Update: Partial<Omit<Tag, 'id'>>
      }
      recipe_tags: {
        Row: RecipeTag
        Insert: RecipeTag
        Update: RecipeTag
      }
    }
  }
}

export interface Recipe {
  id: string
  slug: string
  title: string
  title_kannada: string | null
  category_id: string
  source: 'mom' | 'family'
  contributor_name: string | null
  is_featured: boolean
  is_published: boolean
  is_new: boolean
  description: string
  family_notes: string | null
  moms_tips: string | null
  prep_time_mins: number
  cook_time_mins: number
  servings: number
  difficulty: 'easy' | 'medium' | 'hard'
  spice_level: 1 | 2 | 3
  ingredients: Ingredient[]
  steps: Step[]
  hero_image_url: string | null
  gallery_urls: string[]
  created_at: string
  updated_at: string
}

export interface Ingredient {
  name: string
  qty: number | null
  unit: string | null
  note: string | null
}

export interface Step {
  order: number
  instruction: string
  tip: string | null
}

export interface Category {
  id: string
  slug: string
  name: string
  description: string | null
  cover_image_url: string | null
  sort_order: number
}

export interface Tag {
  id: string
  slug: string
  name: string
}

export interface RecipeTag {
  recipe_id: string
  tag_id: string
}

// Joined types for UI use
export interface RecipeWithCategory extends Recipe {
  categories: Category
}

export interface RecipeWithTags extends Recipe {
  recipe_tags: { tags: Tag }[]
}

export interface RecipeFull extends Recipe {
  categories: Category
  recipe_tags: { tags: Tag }[]
}
