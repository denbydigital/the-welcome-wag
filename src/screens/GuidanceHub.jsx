import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDog } from '../contexts/DogContext'
import { WWScreen, WWHeader, WWCard, WWIconBadge } from '../components/ui'

const TOOLS = [
  { id: 'shopping',  icon: 'shopping-basket', tone: 'brand',  t: 'Shopping checklist', s: 'Day-one kit for your dog' },
  { id: 'food',      icon: 'apple',           tone: 'sage',   t: 'Food guide',          s: 'Safe & unsafe foods' },
  { id: 'behaviour', icon: 'dog',             tone: 'honey',  t: 'Behaviour library',   s: 'Is this normal?' },
  { id: 'vet',       icon: 'stethoscope',     tone: 'sky',    t: 'Vet visit guide',      s: 'Prep for your first check-up' },
  { id: 'routine',   icon: 'clock',           tone: 'sky',    t: 'Routine builder',      s: 'Build a daily rhythm' },
]

export function GuidanceHub({ tabBar }) {
  const navigate = useNavigate()
  const { dog } = useDog()

  return (
    <WWScreen tabBar={tabBar}>
      <WWHeader title="Guidance" subtitle={dog ? `For ${dog.name}` : 'Your toolkit'} />
      <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {TOOLS.map((tool) => (
          <WWCard key={tool.id} variant="default" onClick={() => navigate(`/app/${tool.id}`)} style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <WWIconBadge icon={tool.icon} tone={tool.tone} size={44} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, margin: '0 0 3px', color: 'var(--ink-900)' }}>{tool.t}</h4>
                <p style={{ fontSize: 13, color: 'var(--ink-500)', margin: 0 }}>{tool.s}</p>
              </div>
            </div>
          </WWCard>
        ))}
      </div>
    </WWScreen>
  )
}
