import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDog } from '../contexts/DogContext'
import { useShoppingItems } from '../hooks/useShoppingItems'
import { WW_SHOPPING } from '../data/index'
import { WWScreen, WWHeader, WWCard, WWBadge, WWIconBadge, WWButton, WWIcon, WWToast } from '../components/ui'

const URGENCY = {
  now: { tone: 'coral', label: 'Get now' },
  soon: { tone: 'honey', label: 'Buy soon' },
  nice: { tone: 'neutral', label: 'Nice to have' },
}

export function ShoppingScreen({ tabBar }) {
  const navigate = useNavigate()
  const { dog } = useDog()
  const { have, toggleItem } = useShoppingItems(dog?.id)
  const [toast, setToast] = useState({ show: false, text: '' })

  function showToast(text) {
    setToast({ show: true, text })
    setTimeout(() => setToast({ show: false, text }), 2400)
  }

  const total = WW_SHOPPING.reduce((n, c) => n + c.items.length, 0)
  const got = WW_SHOPPING.reduce((n, c, ci) => {
    return n + c.items.filter((_, i) => have[ci + '-' + i]).length
  }, 0)

  return (
    <WWScreen tabBar={tabBar}>
      <WWHeader
        onBack={() => navigate(-1)}
        subtitle={dog ? `For ${dog.name}` : 'Day-one kit'}
        title="Day-one shopping"
        action={
          <button
            onClick={() => showToast('Checklist shared')}
            style={{ width: 38, height: 38, borderRadius: 'var(--radius-pill)', border: 0, background: 'var(--paper)', boxShadow: 'var(--shadow-xs)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--ink-900)' }}
          >
            <WWIcon name="share-2" size={17} />
          </button>
        }
      />

      <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Progress */}
        <WWCard variant="sage" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, fontSize: 14.5, color: 'var(--ink-900)', margin: 0 }}>{got} of {total} sorted</p>
              <p style={{ fontSize: 13, color: 'var(--ink-700)', margin: '2px 0 0' }}>Check off what you already have.</p>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 600, color: 'var(--sage-700)' }}>
              {Math.round(got / total * 100)}%
            </div>
          </div>
          <div style={{ height: 7, borderRadius: 999, background: 'var(--sage-100)', overflow: 'hidden', marginTop: 12 }}>
            <div style={{ width: (got / total * 100) + '%', height: '100%', background: 'var(--sage-500)', borderRadius: 999, transition: 'width 280ms var(--ease-out)' }} />
          </div>
        </WWCard>

        {WW_SHOPPING.map((cat, ci) => (
          <div key={ci}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '0 4px 10px' }}>
              <WWIconBadge icon={cat.icon} tone="brand" size={30} />
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 600, margin: 0 }}>{cat.cat}</h3>
            </div>
            <WWCard variant="default" style={{ padding: 6 }}>
              {cat.items.map((it, i) => {
                const key = ci + '-' + i
                const on = have[key]
                const u = URGENCY[it.urgency] || URGENCY.nice
                return (
                  <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 12px', borderBottom: i === cat.items.length - 1 ? 'none' : '1px solid var(--cream-200)' }}>
                    <button
                      onClick={() => toggleItem(key)}
                      style={{
                        width: 24, height: 24, borderRadius: 8, marginTop: 2, flexShrink: 0, cursor: 'pointer',
                        border: on ? 0 : '1.6px solid var(--cream-300)',
                        background: on ? 'var(--sage-500)' : 'transparent',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                    >
                      {on && <WWIcon name="check" size={14} color="white" strokeWidth={2.6} />}
                    </button>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, justifyContent: 'space-between' }}>
                        <p style={{ fontSize: 14.5, fontWeight: 600, color: on ? 'var(--ink-500)' : 'var(--ink-900)', margin: 0, textDecoration: on ? 'line-through' : 'none' }}>{it.name}</p>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-700)', whiteSpace: 'nowrap' }}>{it.price}</span>
                      </div>
                      <p style={{ fontSize: 12.5, color: 'var(--ink-500)', margin: '3px 0 8px', lineHeight: 1.45 }}>{it.why}</p>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                        <WWBadge tone={u.tone}>{u.label}</WWBadge>
                        <WWBadge tone="neutral" icon="tag">{it.brand.trim()}</WWBadge>
                      </div>
                    </div>
                  </div>
                )
              })}
            </WWCard>
          </div>
        ))}

        <WWCard variant="flat" style={{ padding: 14 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <WWIcon name="info" size={16} color="var(--ink-500)" style={{ marginTop: 2 }} />
            <p style={{ fontSize: 12.5, color: 'var(--ink-700)', margin: 0, lineHeight: 1.5 }}>
              Brand suggestions are Australian-available and <strong>community-sourced</strong> — prices are a guide only, not live. We never recommend a product not sold locally.
            </p>
          </div>
        </WWCard>

        <p style={{ fontSize: 12, color: 'var(--ink-500)', textAlign: 'center', margin: 0, lineHeight: 1.5 }}>
          Quantities suit {dog ? `an ${dog.age_value ? `${dog.age_value} ${dog.age_unit}` : ''} ${dog.breed || 'puppy'}` : 'a young puppy'}. Always check product age-suitability before buying.
        </p>
      </div>

      <WWToast show={toast.show}>{toast.text}</WWToast>
    </WWScreen>
  )
}
