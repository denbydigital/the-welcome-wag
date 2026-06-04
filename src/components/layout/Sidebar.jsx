import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { WWIcon, WWAvatar } from '../ui'

const NAV = [
  { id: 'today',    label: 'Today',    icon: 'sun',          path: '/app/today' },
  { id: 'records',  label: 'Records',  icon: 'folder-heart', path: '/app/records' },
  { id: 'guidance', label: 'Guidance', icon: 'book-open',    path: '/app/guidance' },
  { id: 'profile',  label: 'My dog',   icon: 'paw-print',    path: '/app/profile' },
]

const TOOLS = [
  { id: 'shopping',  label: 'Shopping',  icon: 'shopping-basket', path: '/app/shopping' },
  { id: 'food',      label: 'Food guide', icon: 'apple',          path: '/app/food' },
  { id: 'behaviour', label: 'Behaviour', icon: 'dog',             path: '/app/behaviour' },
  { id: 'vet',       label: 'Vet visit', icon: 'stethoscope',     path: '/app/vet' },
  { id: 'routine',   label: 'Routine',   icon: 'clock',           path: '/app/routine' },
]

export function Sidebar({ dog, onUrgent }) {
  const navigate = useNavigate()
  const location = useLocation()

  function NavItem({ item }) {
    const active = location.pathname.startsWith(item.path)
    return (
      <button
        onClick={() => navigate(item.path)}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 14px', borderRadius: 'var(--radius-sm)',
          border: 0, width: '100%', textAlign: 'left', cursor: 'pointer',
          background: active ? 'var(--brand-tint)' : 'transparent',
          color: active ? 'var(--brand-press)' : 'var(--ink-700)',
          fontWeight: active ? 600 : 500,
          fontSize: 15,
          transition: 'background 120ms var(--ease-out), color 120ms var(--ease-out)',
        }}
      >
        <WWIcon name={item.icon} size={18} color={active ? 'var(--brand)' : 'var(--ink-500)'} strokeWidth={active ? 2 : 1.75} />
        {item.label}
      </button>
    )
  }

  return (
    <div style={{
      width: 240, flexShrink: 0, height: '100vh', position: 'sticky', top: 0,
      background: 'var(--paper)', borderRight: '1px solid var(--cream-200)',
      display: 'flex', flexDirection: 'column', padding: '24px 12px',
      overflowY: 'auto',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px 24px' }}>
        <img src={`${import.meta.env.BASE_URL}assets/mark.svg`} style={{ width: 34, height: 34 }} alt="" />
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, color: 'var(--ink-900)' }}>
          Welcome Wag
        </span>
      </div>

      {/* Main nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 24 }}>
        {NAV.map((item) => <NavItem key={item.id} item={item} />)}
      </nav>

      <div style={{ height: 1, background: 'var(--cream-200)', margin: '0 8px 16px' }} />

      {/* Tools */}
      <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-300)', padding: '0 8px', marginBottom: 8 }}>
        Tools
      </p>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 24 }}>
        {TOOLS.map((item) => <NavItem key={item.id} item={item} />)}
      </nav>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Urgent */}
      <button
        onClick={onUrgent}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 14px', borderRadius: 'var(--radius-sm)',
          border: '1.5px solid var(--coral-300)', background: 'var(--coral-50)',
          color: 'var(--coral-700)', fontWeight: 600, fontSize: 14.5,
          cursor: 'pointer', width: '100%', textAlign: 'left', marginBottom: 12,
        }}
      >
        <WWIcon name="alert-triangle" size={18} color="var(--coral-600)" />
        Urgent help
      </button>

      {/* Dog chip */}
      {dog && (
        <button
          onClick={() => navigate('/app/profile')}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--cream-200)', background: 'var(--cream-100)',
            cursor: 'pointer', textAlign: 'left', width: '100%',
          }}
        >
          <WWAvatar name={dog.name} size={32} tone={dog.tone} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink-900)', margin: 0 }}>{dog.name}</p>
            <p style={{ fontSize: 12, color: 'var(--ink-500)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{dog.breed || 'No breed set'}</p>
          </div>
        </button>
      )}
    </div>
  )
}
