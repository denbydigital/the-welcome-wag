import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDog } from '../contexts/DogContext'
import { useTimelineCompletions } from '../hooks/useTimelineCompletions'
import { WW_TIMELINE } from '../data/index'
import {
  WWScreen, WWCard, WWButton, WWSection, WWBadge, WWStageMarker,
  WWListRow, WWIconBadge, WWAvatar, WWIcon, WWToast,
} from '../components/ui'
import { UrgentSheet } from '../components/UrgentSheet'

export function TodayScreen({ tabBar }) {
  const navigate = useNavigate()
  const { dog } = useDog()
  const { completed, toggleComplete } = useTimelineCompletions(dog?.id)
  const [urgentOpen, setUrgentOpen] = useState(false)
  const [toast, setToast] = useState({ show: false, text: '' })

  function showToast(text) {
    setToast({ show: true, text })
    setTimeout(() => setToast({ show: false, text }), 2500)
  }

  if (!dog) {
    return (
      <WWScreen tabBar={tabBar}>
        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
          <p style={{ color: 'var(--ink-500)' }}>Loading your dog's profile…</p>
        </div>
      </WWScreen>
    )
  }

  const dogName = dog.name || 'Your dog'
  const stage = dog.stage || 'Day 1–7'
  const isPreArrival = stage === 'Pre-arrival' || dog.arrival_status === 'month' || dog.arrival_status === 'later'
  const dayLabel = isPreArrival ? 'Counting down' : 'Day 3'

  return (
    <WWScreen tabBar={tabBar}>
      <div style={{ padding: '8px 20px 0' }}>
        {/* Top bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="eyebrow">{isPreArrival ? 'Counting down' : `Today · ${dayLabel}`}</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 29, fontWeight: 600, letterSpacing: '-0.02em', margin: '2px 0 0', lineHeight: 1.08 }}>
              {isPreArrival ? `Nearly there, ${dogName}.` : `Morning — how's ${dogName}?`}
            </h1>
          </div>
          <button onClick={() => navigate('/app/profile')} style={{ border: 0, background: 'transparent', padding: 0, cursor: 'pointer' }}>
            <WWAvatar name={dogName} size={46} />
          </button>
        </div>

        {/* Hero card */}
        <WWCard variant="brand" style={{ marginBottom: 14 }}>
          <div className="eyebrow" style={{ color: 'var(--honey-100)', marginBottom: 8 }}>What matters now</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, lineHeight: 1.18, margin: '0 0 6px', letterSpacing: '-0.01em' }}>
            {isPreArrival ? 'Get the house ready before pickup' : 'Second vaccination this Friday'}
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.45, color: 'var(--terracotta-100)', margin: '0 0 16px' }}>
            {isPreArrival
              ? `Work through the shopping checklist so day one with ${dogName} is calm, not chaotic.`
              : `A week after, you can start short on-lead walks. Tap to prep — what to bring, what to ask your vet.`}
          </p>
          <WWButton
            variant="secondary"
            size="sm"
            onClick={() => navigate(isPreArrival ? '/app/shopping' : '/app/vet')}
            iconRight="chevron-right"
            style={{ background: 'var(--paper)', color: 'var(--brand-press)' }}
          >
            {isPreArrival ? 'Open shopping checklist' : 'Prep for the visit'}
          </WWButton>
        </WWCard>

        {/* This week */}
        <WWSection title="This week" action="See all" style={{ margin: '20px 4px 10px' }} />
        <WWCard variant="default" style={{ padding: 0, marginBottom: 14, overflow: 'hidden' }}>
          {WW_TIMELINE.today.map((t, i) => {
            const key = 'tl-' + i
            const done = completed.includes(key)
            return (
              <WWListRow
                key={i}
                icon={done ? 'check' : t.icon}
                iconTone={done ? 'sage' : t.tone}
                title={t.title}
                sub={done ? 'Done' : t.sub}
                chevron={false}
                metaEl={
                  <button
                    onClick={() => toggleComplete(key)}
                    style={{
                      width: 26, height: 26, borderRadius: 999, cursor: 'pointer', flexShrink: 0,
                      border: done ? '0' : '1.6px solid var(--cream-300)',
                      background: done ? 'var(--sage-500)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    {done && <WWIcon name="check" size={15} color="white" strokeWidth={2.4} />}
                  </button>
                }
                meta={done ? undefined : t.meta}
                last={i === WW_TIMELINE.today.length - 1}
              />
            )
          })}
        </WWCard>

        {/* Tools grid */}
        <WWSection title={`For ${dogName}, right now`} style={{ margin: '20px 4px 10px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
          {[
            { id: 'shopping', icon: 'shopping-basket', tone: 'brand', t: 'Shopping', s: 'Day-one kit' },
            { id: 'food', icon: 'apple', tone: 'sage', t: 'Food guide', s: 'Safe to share?' },
            { id: 'behaviour', icon: 'dog', tone: 'honey', t: 'Behaviour', s: 'Is this normal?' },
            { id: 'routine', icon: 'clock', tone: 'sky', t: 'Routine', s: 'Daily rhythm' },
          ].map((tool) => (
            <WWCard key={tool.id} variant="default" onClick={() => navigate(`/app/${tool.id}`)} style={{ padding: 16 }}>
              <WWIconBadge icon={tool.icon} tone={tool.tone} size={40} />
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, margin: '12px 0 2px', color: 'var(--ink-900)' }}>{tool.t}</h4>
              <p style={{ fontSize: 12.5, color: 'var(--ink-500)', margin: 0 }}>{tool.s}</p>
            </WWCard>
          ))}
        </div>

        {/* Featured guidance */}
        <WWCard variant="default" onClick={() => navigate('/app/behaviour')} style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <WWStageMarker stage={stage} />
            <WWBadge tone="honey">Updated today</WWBadge>
          </div>
          <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 600, margin: '0 0 4px', color: 'var(--ink-900)' }}>The first night, hour by hour</h4>
          <p style={{ fontSize: 13.5, color: 'var(--ink-700)', margin: 0, lineHeight: 1.5 }}>
            Settle a {dog.breed || 'puppy'} from 7pm onwards — what to expect, when to step in.
          </p>
        </WWCard>

        {/* Urgent rail */}
        <WWCard variant="urgent" onClick={() => setUrgentOpen(true)} style={{ padding: 14, cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 999, background: 'var(--coral-500)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <WWIcon name="alert-triangle" size={18} color="white" strokeWidth={2} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, color: 'var(--coral-700)', margin: 0 }}>Urgent help</p>
              <p style={{ fontSize: 12.5, color: 'var(--coral-700)', margin: '2px 0 0' }}>Poisoning, breathing, bleeding — reach a vet now.</p>
            </div>
            <WWIcon name="chevron-right" size={18} color="var(--coral-600)" />
          </div>
        </WWCard>
      </div>

      <WWToast show={toast.show}>{toast.text}</WWToast>
      {urgentOpen && <UrgentSheet dog={dog} onClose={() => setUrgentOpen(false)} />}
    </WWScreen>
  )
}
