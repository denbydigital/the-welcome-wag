import React from 'react'
import { useNavigate } from 'react-router-dom'
import { WWButton, WWScreen } from '../components/ui'

export function WelcomeScreen() {
  const navigate = useNavigate()

  return (
    <WWScreen>
      <div style={{ padding: '20px 24px 24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          <img
            src={`${import.meta.env.BASE_URL}assets/mark.svg`}
            style={{ position: 'absolute', right: -90, top: 90, width: 320, opacity: 0.05 }}
            alt=""
          />
        </div>

        <div style={{ marginTop: 18, display: 'flex', justifyContent: 'center', position: 'relative' }}>
          <img src={`${import.meta.env.BASE_URL}assets/mark.svg`} style={{ width: 88, height: 88 }} alt="Welcome Wag" />
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', gap: 18, position: 'relative' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 39, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.05, color: 'var(--ink-900)', margin: 0 }}>
            A warm welcome<br />for your new dog.
          </h1>
          <p style={{ fontFamily: 'var(--font-accent)', fontStyle: 'italic', fontSize: 19, lineHeight: 1.35, color: 'var(--ink-700)', margin: '0 14px', textWrap: 'pretty' }}>
            Tailored guidance, reminders and records — from day one to settled. Made for new owners across Australia.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 8, position: 'relative' }}>
          <WWButton variant="primary" size="lg" full onClick={() => navigate('/auth')} iconRight="arrow-right">
            Get started
          </WWButton>
          <WWButton variant="ghost" size="md" full onClick={() => navigate('/auth?mode=signin')}>
            I've used Welcome Wag before
          </WWButton>
        </div>
      </div>
    </WWScreen>
  )
}
