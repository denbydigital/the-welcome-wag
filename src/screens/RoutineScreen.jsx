import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDog } from '../contexts/DogContext'
import { WW_ROUTINE } from '../data/index'
import {
  WWScreen, WWHeader, WWCard, WWIconBadge, WWBadge, WWButton, WWIcon, WWToast,
} from '../components/ui'

function Disclaimer({ children }) {
  return (
    <p style={{ fontSize: 12, color: 'var(--ink-500)', textAlign: 'center', margin: '4px 0 0', lineHeight: 1.5 }}>
      {children}
    </p>
  )
}

export function RoutineScreen({ tabBar }) {
  const navigate = useNavigate()
  const { dog } = useDog()
  const [items] = useState(WW_ROUTINE)
  const [saved, setSaved] = useState(false)
  const [toast, setToast] = useState({ show: false, text: '' })

  function showToast(text) {
    setToast({ show: true, text })
    setTimeout(() => setToast({ show: false, text }), 2400)
  }

  const dogName = dog?.name || 'your dog'
  const dogAge = dog?.age_value ? `${dog.age_value} ${dog.age_unit}` : 'young'
  const dogBreed = dog?.breed || 'puppy'
  const toiletCount = items.filter((i) => i.label.toLowerCase().includes('toilet')).length

  return (
    <WWScreen tabBar={tabBar}>
      <WWHeader
        onBack={() => navigate(-1)}
        subtitle={`${dogName}'s day`}
        title="Daily routine"
        action={
          <button
            onClick={() => { setSaved(true); showToast('Routine saved') }}
            style={{
              width: 38, height: 38, borderRadius: 'var(--radius-pill)', border: 0,
              background: saved ? 'var(--sage-500)' : 'var(--brand)',
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'var(--shadow-pop)', cursor: 'pointer',
            }}
          >
            <WWIcon name={saved ? 'check' : 'save'} size={17} color="white" />
          </button>
        }
      />

      <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <WWCard variant="sky" style={{ padding: 16 }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <WWIcon name="wand-sparkles" size={18} color="var(--sky-600)" style={{ marginTop: 2 }} />
            <p style={{ fontSize: 13, color: 'var(--ink-700)', margin: 0, lineHeight: 1.5 }}>
              Pre-filled for a <strong>{dogAge} {dogBreed}</strong> — three meals, frequent toilet trips and plenty of rest. Tweak times to fit your day.
            </p>
          </div>
        </WWCard>

        {toiletCount >= 4 ? (
          <WWCard variant="sage" style={{ padding: 13 }}>
            <div style={{ display: 'flex', gap: 9, alignItems: 'center' }}>
              <WWIcon name="circle-check" size={17} color="var(--sage-700)" />
              <p style={{ fontSize: 13, color: 'var(--ink-700)', margin: 0 }}>{toiletCount} toilet breaks — good for a puppy this age.</p>
            </div>
          </WWCard>
        ) : (
          <WWCard variant="honey" style={{ padding: 13 }}>
            <div style={{ display: 'flex', gap: 9, alignItems: 'center' }}>
              <WWIcon name="info" size={17} color="var(--honey-600)" />
              <p style={{ fontSize: 13, color: 'var(--ink-700)', margin: 0 }}>Puppies need a toilet trip roughly every 2 hours — consider adding one.</p>
            </div>
          </WWCard>
        )}

        {/* Timeline */}
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: 27, top: 8, bottom: 8, width: 2, background: 'var(--cream-200)' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {items.map((it, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, position: 'relative' }}>
                <div style={{ width: 56, flexShrink: 0, textAlign: 'right', paddingTop: 14 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-500)', fontVariantNumeric: 'tabular-nums' }}>{it.time}</span>
                </div>
                <div style={{ position: 'relative', flexShrink: 0, paddingTop: 12 }}>
                  <div style={{ width: 14, height: 14, borderRadius: 999, background: 'var(--paper)', border: '3px solid var(--brand)', position: 'relative', zIndex: 1, marginLeft: -7 }} />
                </div>
                <WWCard variant="default" style={{ padding: 12, flex: 1, marginLeft: 2 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <WWIconBadge icon={it.icon} tone={it.tone} size={34} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <p style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--ink-900)', margin: 0 }}>{it.label}</p>
                        {it.essential && <WWBadge tone="sage" style={{ fontSize: 10.5, padding: '3px 8px' }}>Essential</WWBadge>}
                      </div>
                      {it.note && <p style={{ fontSize: 12, color: 'var(--ink-500)', margin: '2px 0 0', lineHeight: 1.4 }}>{it.note}</p>}
                    </div>
                  </div>
                </WWCard>
              </div>
            ))}
          </div>
        </div>

        <WWButton variant="ghost" size="md" full icon="plus" onClick={() => showToast('Add a custom activity')}>
          Add an activity
        </WWButton>
        <Disclaimer>Routine adapts to {dogName}'s age — revisit it weekly as they settle and grow.</Disclaimer>
      </div>

      <WWToast show={toast.show}>{toast.text}</WWToast>
    </WWScreen>
  )
}
