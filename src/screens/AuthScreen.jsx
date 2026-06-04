import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useDog } from '../contexts/DogContext'
import { WWButton, WWInput, WWIcon, WWScreen } from '../components/ui'

export function AuthScreen() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { signUp, signIn, signInWithGoogle, sendMagicLink, user } = useAuth()
  const { dog, loading: dogLoading } = useDog()

  const initialMode = searchParams.get('mode') === 'signin' ? 'signin' : 'signup'
  const [mode, setMode] = useState(initialMode)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [magicSent, setMagicSent] = useState(false)

  // Redirect if already authed
  useEffect(() => {
    if (user && !dogLoading) {
      navigate(dog ? '/app/today' : '/onboarding', { replace: true })
    }
  }, [user, dog, dogLoading, navigate])

  const emailValid = /\S+@\S+\.\S+/.test(email)
  const passwordStrong = password.length >= 8
  const canSubmit = emailValid && (mode === 'magic' ? true : passwordStrong)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'signup') {
        await signUp(email, password)
        navigate('/onboarding', { replace: true })
      } else if (mode === 'signin') {
        await signIn(email, password)
        // redirect handled by useEffect above
      } else if (mode === 'magic') {
        await sendMagicLink(email)
        setMagicSent(true)
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setError('')
    try {
      await signInWithGoogle()
    } catch (err) {
      setError(err.message || 'Google sign-in failed.')
    }
  }

  if (magicSent) {
    return (
      <WWScreen>
        <div style={{ padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 16 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--sage-100)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <WWIcon name="mail" size={28} color="var(--sage-700)" />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 600, margin: 0 }}>Check your email</h1>
          <p style={{ fontSize: 15, color: 'var(--ink-500)', lineHeight: 1.5 }}>
            We've sent a magic link to <strong style={{ color: 'var(--ink-900)' }}>{email}</strong>. Tap it to sign in — no password needed.
          </p>
          <WWButton variant="ghost" size="md" onClick={() => setMagicSent(false)}>Back</WWButton>
        </div>
      </WWScreen>
    )
  }

  const TABS = [
    { id: 'signup', label: 'Sign up' },
    { id: 'signin', label: 'Sign in' },
    { id: 'magic', label: 'Magic link' },
  ]

  return (
    <WWScreen>
      <div style={{ padding: '8px 20px 120px' }}>
        {/* Back */}
        <button onClick={() => navigate('/')} style={{ width: 38, height: 38, borderRadius: 'var(--radius-pill)', border: 0, background: 'var(--paper)', boxShadow: 'var(--shadow-xs)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--ink-900)', marginBottom: 22 }}>
          <WWIcon name="arrow-left" size={18} />
        </button>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'var(--cream-100)', borderRadius: 'var(--radius-pill)', padding: 4 }}>
          {TABS.map((t) => (
            <button key={t.id} onClick={() => { setMode(t.id); setError('') }} style={{
              flex: 1, padding: '8px 4px', borderRadius: 'var(--radius-pill)',
              border: 0, cursor: 'pointer', fontSize: 13.5, fontWeight: 600,
              background: mode === t.id ? 'var(--paper)' : 'transparent',
              color: mode === t.id ? 'var(--ink-900)' : 'var(--ink-500)',
              boxShadow: mode === t.id ? 'var(--shadow-xs)' : 'none',
              transition: 'all 140ms var(--ease-out)',
            }}>
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ marginBottom: 22 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 29, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.1, margin: 0 }}>
            {mode === 'signup' && "Let's set up a safe home for your dog's details."}
            {mode === 'signin' && 'Welcome back.'}
            {mode === 'magic' && 'Sign in without a password.'}
          </h1>
          <p style={{ fontSize: 14, color: 'var(--ink-500)', margin: '8px 0 0', lineHeight: 1.45 }}>
            {mode === 'signup' && "So your profile, plan and reminders are here whenever you come back. It's free, and we won't email you marketing."}
            {mode === 'signin' && 'Your dog is waiting — pick up right where you left off.'}
            {mode === 'magic' && "Enter your email and we'll send a link. Tap it to sign straight in."}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <WWInput
            label="Email"
            value={email}
            onChange={setEmail}
            placeholder="you@email.com"
            prefixIcon="mail"
            type="email"
            autoFocus
          />

          {(mode === 'signup' || mode === 'signin') && (
            <>
              <WWInput
                label="Password"
                value={password}
                onChange={setPassword}
                placeholder={mode === 'signup' ? 'At least 8 characters' : 'Your password'}
                prefixIcon="lock"
                type="password"
                help={mode === 'signup' && password.length === 0 ? 'Use 8+ characters.' : mode === 'signup' && !passwordStrong ? 'A little longer — 8 characters minimum.' : undefined}
              />
              {mode === 'signup' && password.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, height: 6, borderRadius: 999, background: 'var(--cream-200)', overflow: 'hidden' }}>
                    <div style={{ width: passwordStrong ? '100%' : '45%', height: '100%', borderRadius: 999, background: passwordStrong ? 'var(--sage-500)' : 'var(--honey-500)', transition: 'all 220ms var(--ease-out)' }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: passwordStrong ? 'var(--sage-700)' : 'var(--honey-600)' }}>
                    {passwordStrong ? 'Strong' : 'Keep going'}
                  </span>
                </div>
              )}
            </>
          )}

          {error && (
            <div style={{ background: 'var(--coral-50)', border: '1px solid var(--coral-300)', borderRadius: 'var(--radius-md)', padding: '12px 14px' }}>
              <p style={{ fontSize: 13.5, color: 'var(--coral-700)', margin: 0 }}>{error}</p>
            </div>
          )}

          <WWButton
            type="submit"
            variant="primary"
            size="lg"
            full
            disabled={!emailValid || loading}
            iconRight={loading ? undefined : 'arrow-right'}
          >
            {loading ? 'Please wait…' : mode === 'signup' ? 'Create account' : mode === 'signin' ? 'Sign in' : 'Send magic link'}
          </WWButton>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--cream-200)' }} />
          <span style={{ fontSize: 12, color: 'var(--ink-300)', fontWeight: 600 }}>or</span>
          <div style={{ flex: 1, height: 1, background: 'var(--cream-200)' }} />
        </div>

        <WWButton variant="ghost" size="md" full onClick={handleGoogle} icon="globe">
          Continue with Google
        </WWButton>

        {mode === 'signup' && (
          <p style={{ fontSize: 11.5, color: 'var(--ink-500)', textAlign: 'center', margin: '16px 0 0', lineHeight: 1.5 }}>
            By continuing you agree to our terms. The Welcome Wag offers guidance, not veterinary diagnosis.
          </p>
        )}
      </div>
    </WWScreen>
  )
}
