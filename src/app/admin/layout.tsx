'use client'

import { useState, useEffect } from 'react'
import styles from './layout.module.css'

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? 'thambuli2024'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [error, setError] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const stored = sessionStorage.getItem('admin_auth')
    if (stored === 'true') setAuthed(true)
    setChecking(false)
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin_auth', 'true')
      setAuthed(true)
      setError(false)
    } else {
      setError(true)
    }
  }

  if (checking) return null

  if (!authed) {
    return (
      <div className={styles.loginPage}>
        <div className={styles.loginBox}>
          <p className={styles.loginEyebrow}>Admin</p>
          <h1 className={styles.loginTitle}>Thambuli, Saaru &amp; Bajji</h1>
          <p className={styles.loginSub}>Enter the admin password to continue.</p>
          <form onSubmit={handleSubmit} className={styles.loginForm}>
            <input
              type="password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              placeholder="Password"
              className={styles.loginInput}
              autoFocus
            />
            {error && <p className={styles.loginError}>Incorrect password</p>}
            <button type="submit" className={styles.loginBtn}>Sign in</button>
          </form>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
