import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDog } from '../contexts/DogContext'
import { WW_FOODS } from '../data/index'
import {
  WWScreen, WWHeader, WWCard, WWBadge, WWButton, WWInput,
  WWVerdict, WWConfidence, WWTrustChip, WWSourceLine, WWIcon,
} from '../components/ui'

function Disclaimer({ children }) {
  return (
    <p style={{ fontSize: 12, color: 'var(--ink-500)', textAlign: 'center', margin: '4px 0 0', lineHeight: 1.5 }}>
      {children || <>This is general guidance, not medical advice. For urgent concerns, <span style={{ color: 'var(--coral-600)', fontWeight: 600 }}>call your vet</span>.</>}
    </p>
  )
}

function FlagControl({ onFlag, flagged }) {
  return (
    <button onClick={onFlag} style={{
      display: 'inline-flex', alignItems: 'center', gap: 7,
      border: flagged ? '1px solid var(--coral-300)' : '1px solid var(--cream-300)',
      background: flagged ? 'var(--coral-50)' : 'transparent',
      color: flagged ? 'var(--coral-700)' : 'var(--ink-500)',
      padding: '8px 14px', borderRadius: 'var(--radius-pill)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
    }}>
      <WWIcon name="flag" size={15} />
      {flagged ? 'Flagged — thank you' : 'Flag this advice'}
    </button>
  )
}

export function FoodScreen({ tabBar }) {
  const navigate = useNavigate()
  const { dog } = useDog()
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('All')
  const [open, setOpen] = useState(null)
  const [flagged, setFlagged] = useState(false)

  const cats = ['All', 'Fruit', 'Vegetables', 'Meat', 'Dairy', 'Pantry']
  const results = useMemo(() => WW_FOODS.filter((f) =>
    (filter === 'All' || f.cat === filter) && f.name.toLowerCase().includes(q.toLowerCase())
  ), [q, filter])
  const noMatch = q.trim().length > 1 && results.length === 0
  const dogName = dog?.name || 'your dog'

  if (open) {
    const f = open
    return (
      <WWScreen tabBar={tabBar}>
        <WWHeader onBack={() => { setOpen(null); setFlagged(false) }} subtitle={`Food guide · ${f.cat}`} title={f.name} />
        <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <WWVerdict verdict={f.verdict} />
            {f.severity === 'high' && <WWBadge tone="coral" icon="alert-triangle">Toxic</WWBadge>}
            <WWConfidence level={f.conf} />
          </div>
          <p style={{ fontFamily: 'var(--font-accent)', fontStyle: 'italic', fontSize: 19, lineHeight: 1.35, color: 'var(--ink-900)', margin: 0 }}>{f.note}</p>
          <p style={{ fontSize: 15, lineHeight: 1.55, color: 'var(--ink-700)', margin: 0 }}>{f.detail}</p>

          {f.verdict === 'unsafe' && (
            <WWCard variant="urgent" style={{ padding: 16 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <WWIcon name="phone" size={18} color="var(--coral-600)" strokeWidth={2} style={{ marginTop: 2 }} />
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--coral-700)', margin: '0 0 3px' }}>If {dogName} has eaten this</p>
                  <p style={{ fontSize: 13.5, color: 'var(--coral-700)', margin: 0, lineHeight: 1.5 }}>
                    Call your vet or the Animal Poisons Helpline on <strong>1300 869 738</strong> straight away. Don't wait for symptoms.
                  </p>
                </div>
              </div>
            </WWCard>
          )}

          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, margin: '0 0 10px', color: 'var(--ink-900)' }}>Safe alternatives</h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {f.alts.map((a) => {
                const alt = WW_FOODS.find((x) => x.name === a)
                return (
                  <button key={a} onClick={() => alt && setOpen(alt)} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 7,
                    padding: '8px 13px', borderRadius: 999,
                    border: '1px solid var(--sage-100)', background: 'var(--sage-50)',
                    color: 'var(--sage-700)', fontWeight: 600, fontSize: 13.5,
                    cursor: alt ? 'pointer' : 'default',
                  }}>
                    <WWIcon name="circle-check" size={15} />
                    {a}
                  </button>
                )
              })}
            </div>
          </div>

          <WWSourceLine source={f.trust === 'vet' ? 'RSPCA Australia & vet review' : 'Welcome Wag community'} date="May 2026" location="Australia" />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
            <WWTrustChip type={f.trust} />
            <FlagControl flagged={flagged} onFlag={() => setFlagged(true)} />
          </div>
          <Disclaimer />
        </div>
      </WWScreen>
    )
  }

  return (
    <WWScreen tabBar={tabBar}>
      <WWHeader onBack={() => navigate(-1)} subtitle="Safe & unsafe" title="Food guide" />
      <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <WWInput value={q} onChange={setQ} placeholder="Search a food — e.g. grapes, pumpkin" prefixIcon="search" />

        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2, margin: '-2px -20px 0', padding: '0 20px' }}>
          {cats.map((c) => (
            <button key={c} onClick={() => setFilter(c)} style={{
              whiteSpace: 'nowrap', padding: '7px 14px', borderRadius: 999, fontSize: 13.5, fontWeight: 600, cursor: 'pointer',
              border: filter === c ? '1.5px solid var(--brand)' : '1px solid var(--cream-300)',
              background: filter === c ? 'var(--brand-tint)' : 'var(--paper)',
              color: filter === c ? 'var(--brand-press)' : 'var(--ink-700)',
            }}>
              {c}
            </button>
          ))}
        </div>

        {noMatch ? (
          <WWCard variant="honey" style={{ padding: 18 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <WWIcon name="search-x" size={20} color="var(--honey-600)" style={{ marginTop: 2 }} />
              <div>
                <p style={{ fontWeight: 600, fontSize: 15, color: 'var(--ink-900)', margin: '0 0 4px' }}>We don't have a trusted answer for "{q}"</p>
                <p style={{ fontSize: 13.5, color: 'var(--ink-700)', margin: '0 0 12px', lineHeight: 1.5 }}>
                  Rather than guess, we'd rather say so. If you're worried {dogName} has eaten something, check with a vet.
                </p>
                <WWButton variant="dangerSoft" size="sm" icon="phone">Call Animal Poisons Helpline</WWButton>
              </div>
            </div>
          </WWCard>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {results.map((f) => (
              <WWCard key={f.name} variant="default" onClick={() => setOpen(f)} style={{ padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                      <p style={{ fontSize: 15.5, fontWeight: 600, color: 'var(--ink-900)', margin: 0 }}>{f.name}</p>
                      <WWVerdict verdict={f.verdict} size="sm" />
                    </div>
                    <p style={{ fontSize: 12.5, color: 'var(--ink-500)', margin: 0, lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>{f.note}</p>
                  </div>
                  <WWIcon name="chevron-right" size={18} color="var(--ink-300)" />
                </div>
              </WWCard>
            ))}
          </div>
        )}

        <Disclaimer>Food safety here is general and not tailored to allergies or health conditions. When unsure, ask your vet.</Disclaimer>
      </div>
    </WWScreen>
  )
}
