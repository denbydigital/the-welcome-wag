import React from 'react'
import { WWIcon } from './ui'

export function UrgentSheet({ dog, onClose }) {
  const vetName = dog?.vet_name || dog?.vet || '—'
  const vetPhone = '(02) 9519 4111'

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
      <div
        onClick={onClose}
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(42,33,27,0.4)',
          animation: 'ww-fade 220ms var(--ease-out)',
        }}
      />
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        background: 'var(--cream-50)', borderTopLeftRadius: 28, borderTopRightRadius: 28,
        padding: '12px 20px 30px',
        boxShadow: '0 -8px 32px rgba(46,33,27,0.18)',
        animation: 'ww-slide-up 280ms var(--ease-out)',
        maxWidth: 600, margin: '0 auto',
      }}>
        <div style={{ width: 36, height: 4, background: 'var(--cream-300)', borderRadius: 999, margin: '0 auto 18px' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 999, background: 'var(--coral-500)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <WWIcon name="alert-triangle" size={18} color="white" strokeWidth={2} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, margin: 0, color: 'var(--ink-900)' }}>Get urgent help</h2>
        </div>

        <p style={{ fontSize: 14, color: 'var(--ink-700)', margin: '0 0 16px', lineHeight: 1.5 }}>
          The Welcome Wag doesn't diagnose. For poisoning, breathing trouble, or heavy bleeding, call a vet now — even if you're unsure.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            {
              icon: 'phone',
              bg: 'var(--coral-500)', fg: 'white',
              t: vetName !== '—' ? `Call ${vetName}` : 'Call your vet',
              s: vetName !== '—' ? `${vetName} · add phone in profile` : 'Add a vet in your profile',
            },
            {
              icon: 'droplet',
              bg: 'var(--paper)', fg: 'var(--coral-700)',
              border: '1.5px solid var(--coral-300)',
              t: 'Animal Poisons Helpline',
              s: 'Suspected poisoning · 1300 869 738 · 24/7',
            },
            {
              icon: 'ambulance',
              bg: 'var(--paper)', fg: 'var(--ink-900)',
              border: '1px solid var(--cream-300)',
              t: 'Nearest emergency vet',
              s: 'Search Google Maps for "emergency vet near me"',
            },
          ].map((b, i) => (
            <button key={i} style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '15px 18px',
              background: b.bg, color: b.fg, border: b.border || 0,
              borderRadius: 20, cursor: 'pointer', textAlign: 'left',
            }}>
              <WWIcon name={b.icon} size={22} color={b.fg} strokeWidth={2} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 16 }}>{b.t}</div>
                <div style={{ fontSize: 13, opacity: 0.9, color: b.fg }}>{b.s}</div>
              </div>
            </button>
          ))}
        </div>

        <button onClick={onClose} style={{
          marginTop: 16, width: '100%', padding: 14,
          background: 'transparent', border: 0,
          color: 'var(--ink-700)', fontSize: 15, fontWeight: 600, cursor: 'pointer',
        }}>
          Close
        </button>
      </div>
    </div>
  )
}
