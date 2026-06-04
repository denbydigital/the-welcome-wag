import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { WWIcon } from '../ui'

const TABS = [
  { id: 'today',    label: 'Today',    icon: 'sun',          path: '/app/today' },
  { id: 'records',  label: 'Records',  icon: 'folder-heart', path: '/app/records' },
  { id: 'guidance', label: 'Guidance', icon: 'book-open',    path: '/app/guidance' },
]

export function TabBar({ dogName }) {
  const navigate = useNavigate()
  const location = useLocation()

  const tabs = [
    ...TABS,
    { id: 'profile', label: dogName || 'My Dog', icon: 'paw-print', path: '/app/profile' },
  ]

  return (
    <div style={{
      position: 'absolute', left: 0, right: 0, bottom: 0,
      background: 'var(--paper)', borderTop: '1px solid var(--cream-200)',
      display: 'flex', alignItems: 'stretch',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      zIndex: 50, boxShadow: '0 -4px 12px rgba(46,33,27,0.06)',
    }}>
      {tabs.map((tab) => {
        const active = location.pathname.startsWith(tab.path)
        return (
          <button
            key={tab.id}
            onClick={() => navigate(tab.path)}
            style={{
              flex: 1, border: 0, background: 'transparent',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: 4, padding: '10px 4px',
              cursor: 'pointer', color: active ? 'var(--brand)' : 'var(--ink-500)',
              transition: 'color 120ms var(--ease-out)',
            }}
          >
            <WWIcon
              name={tab.icon}
              size={22}
              color={active ? 'var(--brand)' : 'var(--ink-300)'}
              strokeWidth={active ? 2 : 1.75}
            />
            <span style={{
              fontSize: 11, fontWeight: active ? 600 : 500,
              letterSpacing: '0.01em', lineHeight: 1,
            }}>
              {tab.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
