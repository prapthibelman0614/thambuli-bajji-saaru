'use client'

import { useState } from 'react'
import styles from './NewsletterForm.module.css'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')

    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    if (res.ok) {
      setStatus('success')
      setEmail('')
    } else {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {status === 'success' ? (
        <p className={styles.success}>You're in — we'll let you know when new recipes land.</p>
      ) : (
        <>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className={styles.input}
          />
          <button type="submit" disabled={status === 'loading'} className={styles.btn}>
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </>
      )}
      {status === 'error' && (
        <p className={styles.error}>Something went wrong — please try again.</p>
      )}
    </form>
  )
}
