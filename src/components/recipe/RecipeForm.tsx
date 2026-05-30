'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Recipe, Category, Ingredient, Step } from '@/types/database'
import styles from './RecipeForm.module.css'

interface Props {
  categories: Category[]
  initial?: Partial<Recipe>
  mode: 'create' | 'edit'
}

const emptyIngredient = (): Ingredient => ({ name: '', qty: null, unit: null, note: null })
const emptyStep = (order: number): Step => ({ order, instruction: '', tip: null })

export default function RecipeForm({ categories, initial, mode }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Basic fields
  const [title, setTitle] = useState(initial?.title ?? '')
  const [titleKannada, setTitleKannada] = useState(initial?.title_kannada ?? '')
  const [slug, setSlug] = useState(initial?.slug ?? '')
  const [categoryId, setCategoryId] = useState(initial?.category_id ?? categories[0]?.id ?? '')
  const [source, setSource] = useState<'mom' | 'family'>(initial?.source ?? 'mom')
  const [contributorName, setContributorName] = useState(initial?.contributor_name ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [familyNotes, setFamilyNotes] = useState(initial?.family_notes ?? '')
  const [momsTips, setMomsTips] = useState(initial?.moms_tips ?? '')

  // Timing
  const [prepTime, setPrepTime] = useState(initial?.prep_time_mins ?? 10)
  const [cookTime, setCookTime] = useState(initial?.cook_time_mins ?? 15)
  const [servings, setServings] = useState(initial?.servings ?? 4)
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>(initial?.difficulty ?? 'easy')
  const [spiceLevel, setSpiceLevel] = useState<1 | 2 | 3>(initial?.spice_level ?? 1)

  // Flags
  const [isPublished, setIsPublished] = useState(initial?.is_published ?? false)
  const [isFeatured, setIsFeatured] = useState(initial?.is_featured ?? false)
  const [isNew, setIsNew] = useState(initial?.is_new ?? true)

  // Ingredients
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    initial?.ingredients?.length ? initial.ingredients : [emptyIngredient()]
  )

  // Steps
  const [steps, setSteps] = useState<Step[]>(
    initial?.steps?.length ? initial.steps : [emptyStep(1)]
  )

  function autoSlug(t: string) {
    return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  function handleTitleChange(v: string) {
    setTitle(v)
    if (mode === 'create') setSlug(autoSlug(v))
  }

  // Ingredient helpers
  function updateIngredient(i: number, field: keyof Ingredient, value: string | number | null) {
    const updated = [...ingredients]
    updated[i] = { ...updated[i], [field]: value }
    setIngredients(updated)
  }

  function addIngredient() { setIngredients([...ingredients, emptyIngredient()]) }

  function removeIngredient(i: number) {
    setIngredients(ingredients.filter((_, idx) => idx !== i))
  }

  // Step helpers
  function updateStep(i: number, field: keyof Step, value: string | number | null) {
    const updated = [...steps]
    updated[i] = { ...updated[i], [field]: value }
    setSteps(updated)
  }

  function addStep() { setSteps([...steps, emptyStep(steps.length + 1)]) }

  function removeStep(i: number) {
    setSteps(steps.filter((_, idx) => idx !== i).map((s, idx) => ({ ...s, order: idx + 1 })))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const payload = {
      title,
      title_kannada: titleKannada || null,
      slug,
      category_id: categoryId,
      source,
      contributor_name: contributorName || null,
      description,
      family_notes: familyNotes || null,
      moms_tips: momsTips || null,
      prep_time_mins: Number(prepTime),
      cook_time_mins: Number(cookTime),
      servings: Number(servings),
      difficulty,
      spice_level: Number(spiceLevel),
      is_published: isPublished,
      is_featured: isFeatured,
      is_new: isNew,
      ingredients: ingredients.filter((ing) => ing.name.trim()),
      steps: steps.filter((s) => s.instruction.trim()),
    }

    let err
    if (mode === 'create') {
      const res = await (supabase.from('recipes') as any).insert(payload)
      err = res.error
    } else {
      const res = await (supabase.from('recipes') as any).update(payload).eq('id', initial!.id!)
      err = res.error
    }

    setSaving(false)
    if (err) { setError(err.message); return }
    router.push('/admin')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>

      {error && <div className={styles.error}>{error}</div>}

      {/* Basic info */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Basic info</h2>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Title <span className={styles.req}>*</span></label>
            <input className={styles.input} value={title} onChange={(e) => handleTitleChange(e.target.value)} required />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Title in Kannada</label>
            <input className={styles.input} value={titleKannada} onChange={(e) => setTitleKannada(e.target.value)} placeholder="Optional" />
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Slug <span className={styles.req}>*</span></label>
            <input className={styles.input} value={slug} onChange={(e) => setSlug(e.target.value)} required />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Category <span className={styles.req}>*</span></label>
            <select className={styles.select} value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Source <span className={styles.req}>*</span></label>
            <select className={styles.select} value={source} onChange={(e) => setSource(e.target.value as 'mom' | 'family')}>
              <option value="mom">Amma's recipe</option>
              <option value="family">Family recipe</option>
            </select>
          </div>
          {source === 'family' && (
            <div className={styles.field}>
              <label className={styles.label}>Contributor name</label>
              <input className={styles.input} value={contributorName} onChange={(e) => setContributorName(e.target.value)} placeholder="e.g. Ajji, Chikkamma" />
            </div>
          )}
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Description <span className={styles.req}>*</span></label>
          <textarea className={styles.textarea} value={description} onChange={(e) => setDescription(e.target.value)} rows={2} required placeholder="Short description shown on cards (1–2 sentences)" />
        </div>
      </div>

      {/* Timing */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Timing &amp; serving</h2>
        <div className={styles.rowFive}>
          <div className={styles.field}>
            <label className={styles.label}>Prep (min)</label>
            <input className={styles.input} type="number" min="0" value={prepTime} onChange={(e) => setPrepTime(Number(e.target.value))} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Cook (min)</label>
            <input className={styles.input} type="number" min="0" value={cookTime} onChange={(e) => setCookTime(Number(e.target.value))} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Serves</label>
            <input className={styles.input} type="number" min="1" value={servings} onChange={(e) => setServings(Number(e.target.value))} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Difficulty</label>
            <select className={styles.select} value={difficulty} onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Spice level</label>
            <select className={styles.select} value={spiceLevel} onChange={(e) => setSpiceLevel(Number(e.target.value) as 1 | 2 | 3)}>
              <option value={1}>● ○ ○ Mild</option>
              <option value={2}>● ● ○ Medium</option>
              <option value={3}>● ● ● Hot</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ingredients */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Ingredients</h2>
        <div className={styles.ingredientHeader}>
          <span>Name</span><span>Qty</span><span>Unit</span><span>Note</span><span></span>
        </div>
        {ingredients.map((ing, i) => (
          <div key={i} className={styles.ingredientRow}>
            <input className={styles.input} placeholder="e.g. ripe tomatoes" value={ing.name} onChange={(e) => updateIngredient(i, 'name', e.target.value)} />
            <input className={styles.input} placeholder="3" type="number" step="0.25" value={ing.qty ?? ''} onChange={(e) => updateIngredient(i, 'qty', e.target.value ? Number(e.target.value) : null)} />
            <input className={styles.input} placeholder="medium" value={ing.unit ?? ''} onChange={(e) => updateIngredient(i, 'unit', e.target.value || null)} />
            <input className={styles.input} placeholder="roughly chopped" value={ing.note ?? ''} onChange={(e) => updateIngredient(i, 'note', e.target.value || null)} />
            <button type="button" onClick={() => removeIngredient(i)} className={styles.removeBtn} disabled={ingredients.length === 1}>×</button>
          </div>
        ))}
        <button type="button" onClick={addIngredient} className={styles.addBtn}>+ Add ingredient</button>
      </div>

      {/* Steps */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Method</h2>
        {steps.map((step, i) => (
          <div key={i} className={styles.stepBlock}>
            <div className={styles.stepHeader}>
              <span className={styles.stepNum}>Step {step.order}</span>
              <button type="button" onClick={() => removeStep(i)} className={styles.removeBtn} disabled={steps.length === 1}>×</button>
            </div>
            <textarea
              className={styles.textarea}
              placeholder="Instruction"
              value={step.instruction}
              onChange={(e) => updateStep(i, 'instruction', e.target.value)}
              rows={2}
            />
            <input
              className={styles.input}
              placeholder="Amma's tip for this step (optional)"
              value={step.tip ?? ''}
              onChange={(e) => updateStep(i, 'tip', e.target.value || null)}
            />
          </div>
        ))}
        <button type="button" onClick={addStep} className={styles.addBtn}>+ Add step</button>
      </div>

      {/* Notes */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Notes</h2>
        <div className={styles.field}>
          <label className={styles.label}>Family notes</label>
          <textarea className={styles.textarea} value={familyNotes} onChange={(e) => setFamilyNotes(e.target.value)} rows={3} placeholder="Personal story, memory, or context" />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Amma's general tips</label>
          <textarea className={styles.textarea} value={momsTips} onChange={(e) => setMomsTips(e.target.value)} rows={3} placeholder="General tips (not tied to a specific step)" />
        </div>
      </div>

      {/* Flags */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Visibility</h2>
        <div className={styles.flagRow}>
          <label className={styles.flagLabel}>
            <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
            <span>Published — visible on the site</span>
          </label>
          <label className={styles.flagLabel}>
            <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
            <span>Featured — shown on homepage</span>
          </label>
          <label className={styles.flagLabel}>
            <input type="checkbox" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} />
            <span>New — shown in Newly Added strip</span>
          </label>
        </div>
      </div>

      {/* Submit */}
      <div className={styles.submitRow}>
        <button type="button" onClick={() => router.push('/admin')} className={styles.cancelBtn}>Cancel</button>
        <button type="submit" disabled={saving} className={styles.submitBtn}>
          {saving ? 'Saving...' : mode === 'create' ? 'Add recipe' : 'Save changes'}
        </button>
      </div>

    </form>
  )
}
