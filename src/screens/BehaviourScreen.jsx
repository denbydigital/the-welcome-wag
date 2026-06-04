import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDog } from '../contexts/DogContext'
import { WW_BEHAVIOURS } from '../data/index'
import {
  WWScreen, WWHeader, WWCard, WWListRow, WWIconBadge, WWBadge, WWButton,
  WWInput, WWTrustChip, WWSourceLine, WWIcon,
} from '../components/ui'

function Disclaimer() {
  return (
    <p style={{ fontSize: 12, color: 'var(--ink-500)', textAlign: 'center', margin: '4px 0 0', lineHeight: 1.5 }}>
      Behaviour guidance is general. Serious aggression or severe distress needs a vet or qualified trainer.
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

export function BehaviourScreen({ tabBar }) {
  const navigate = useNavigate()
  const { dog } = useDog()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(null)
  const [flagged, setFlagged] = useState(false)

  const dogName = dog?.name || 'your dog'
  const dogAge = dog?.age_value ? `${dog.age_value} ${dog.age_unit}` : 'young'
  const dogBreed = dog?.breed || 'puppy'

  const results = WW_BEHAVIOURS.filter((b) =>
    (b.title + b.cat).toLowerCase().includes(q.toLowerCase())
  )

  if (open) {
    const b = open
    const related = WW_BEHAVIOURS.filter((x) => x.id !== b.id && x.cat === b.cat).slice(0, 2)
    const moreRelated = related.length ? related : WW_BEHAVIOURS.filter((x) => x.id !== b.id).slice(0, 2)
    return (
      <WWScreen tabBar={tabBar}>
        <WWHeader onBack={() => { setOpen(null); setFlagged(false) }} subtitle={`Behaviour · ${b.cat}`} title={b.title} />
        <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <WWCard variant="sage" style={{ padding: 16 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 44, height: 44, borderRadius: 999, background: 'var(--sage-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <WWIcon name="circle-check" size={22} color="var(--sage-700)" />
              </div>
              <div>
                <p style={{ fontWeight: 600, fontSize: 15, color: 'var(--ink-900)', margin: 0 }}>{b.normal} for {dogName}</p>
                <p style={{ fontSize: 13, color: 'var(--ink-700)', margin: '2px 0 0', lineHeight: 1.4 }}>{b.sub} Typical for a {dogAge} {dogBreed}.</p>
              </div>
            </div>
          </WWCard>

          <p style={{ fontFamily: 'var(--font-accent)', fontStyle: 'italic', fontSize: 19, lineHeight: 1.35, color: 'var(--ink-900)', margin: 0 }}>
            It isn't bad behaviour — it's a young dog learning the rules of a brand-new world.
          </p>

          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, margin: '0 0 10px', color: 'var(--ink-900)' }}>What to try</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                'Keep your response calm and boring — big reactions can accidentally reward it.',
                'Redirect to the right outlet: a chew toy, a settle mat, or a quick toilet trip.',
                'Reward the moment it stops, so the quiet choice becomes the easy one.',
                `Stay consistent for a week — most ${dogBreed}s settle fast once the pattern is clear.`,
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 24, height: 24, borderRadius: 999, background: 'var(--brand-tint)', color: 'var(--brand-press)', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</div>
                  <p style={{ fontSize: 14.5, color: 'var(--ink-700)', margin: 0, lineHeight: 1.5, paddingTop: 1 }}>{s}</p>
                </div>
              ))}
            </div>
          </div>

          <WWCard variant="honey" style={{ padding: 16 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <WWIcon name="stethoscope" size={18} color="var(--honey-600)" style={{ marginTop: 2 }} />
              <div>
                <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink-900)', margin: '0 0 3px' }}>When to call a vet or trainer</p>
                <p style={{ fontSize: 13.5, color: 'var(--ink-700)', margin: 0, lineHeight: 1.5 }}>
                  If it's getting worse after two weeks, comes with signs of real distress, or you ever feel out of your depth — a professional makes it easier.
                </p>
              </div>
            </div>
          </WWCard>

          <WWSourceLine source="RSPCA Australia behaviour guidance" date="April 2026" location="Australia" />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
            <WWTrustChip type={b.trust} />
            <FlagControl flagged={flagged} onFlag={() => setFlagged(true)} />
          </div>

          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, margin: '4px 0 10px', color: 'var(--ink-900)' }}>Related behaviours</h3>
            <WWCard variant="default" style={{ padding: 0, overflow: 'hidden' }}>
              {moreRelated.map((r, i) => (
                <WWListRow key={r.id} icon={r.icon} iconTone={r.tone} title={r.title} sub={r.sub} onClick={() => { setOpen(r); setFlagged(false) }} last={i === moreRelated.length - 1} />
              ))}
            </WWCard>
          </div>
          <Disclaimer />
        </div>
      </WWScreen>
    )
  }

  return (
    <WWScreen tabBar={tabBar}>
      <WWHeader onBack={() => navigate(-1)} subtitle="Is this normal?" title="Behaviour library" />
      <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <WWInput value={q} onChange={setQ} placeholder="Search — e.g. crying at night, chewing" prefixIcon="search" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {results.map((b) => (
            <WWCard key={b.id} variant="default" onClick={() => setOpen(b)} style={{ padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <WWIconBadge icon={b.icon} tone={b.tone} size={40} />
                <WWBadge tone={b.tone === 'coral' ? 'coral' : 'sage'} style={{ fontSize: 11 }}>{b.normal}</WWBadge>
              </div>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, margin: '0 0 3px', color: 'var(--ink-900)' }}>{b.title}</h4>
              <p style={{ fontSize: 12.5, color: 'var(--ink-500)', margin: 0, lineHeight: 1.4 }}>{b.sub}</p>
            </WWCard>
          ))}
        </div>
        <Disclaimer />
      </div>
    </WWScreen>
  )
}
