import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useDog } from '../contexts/DogContext'
import {
  WWScreen, WWCard, WWListRow, WWAvatar, WWBadge, WWIcon,
} from '../components/ui'

export function ProfileScreen({ tabBar }) {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const { dog } = useDog()

  async function handleSignOut() {
    try {
      await signOut()
      navigate('/', { replace: true })
    } catch (err) {
      console.error('Sign out failed:', err)
    }
  }

  if (!dog) {
    return (
      <WWScreen tabBar={tabBar}>
        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
          <p style={{ color: 'var(--ink-500)' }}>Loading…</p>
        </div>
      </WWScreen>
    )
  }

  const ageLabel = dog.age_value ? `${dog.age_value} ${dog.age_unit}` : null
  const suburb = dog.suburb || (dog.postcode ? `Postcode ${dog.postcode}` : null)

  return (
    <WWScreen tabBar={tabBar}>
      <div style={{ padding: '0 20px 20px' }}>
        {/* Avatar + name */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '8px 0 20px' }}>
          <WWAvatar name={dog.name} size={92} />
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 27, fontWeight: 600, margin: 0, letterSpacing: '-0.02em' }}>{dog.name}</h1>
            <p style={{ fontSize: 14, color: 'var(--ink-500)', margin: '4px 0 0' }}>
              {[dog.breed, dog.background].filter(Boolean).join(' · ')}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {dog.stage && <WWBadge tone="brand">{dog.stage}</WWBadge>}
            {ageLabel && <WWBadge tone="neutral">{ageLabel}</WWBadge>}
            {dog.weight_kg && <WWBadge tone="neutral">{dog.weight_kg} kg</WWBadge>}
            {suburb && <WWBadge tone="neutral">{suburb}</WWBadge>}
          </div>
        </div>

        {/* Profile completeness nudge */}
        {!dog.weight_kg && (
          <WWCard variant="honey" style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ position: 'relative', width: 44, height: 44, flexShrink: 0 }}>
                <svg width="44" height="44" viewBox="0 0 44 44">
                  <circle cx="22" cy="22" r="19" fill="none" stroke="var(--honey-100)" strokeWidth="5" />
                  <circle cx="22" cy="22" r="19" fill="none" stroke="var(--honey-500)" strokeWidth="5" strokeLinecap="round" strokeDasharray="119" strokeDashoffset="24" transform="rotate(-90 22 22)" />
                </svg>
                <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'var(--honey-600)' }}>80%</span>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, fontSize: 14.5, color: 'var(--ink-900)', margin: 0 }}>Add {dog.name}'s weight</p>
                <p style={{ fontSize: 13, color: 'var(--ink-700)', margin: '2px 0 0' }}>One more detail sharpens feeding & dosage guidance.</p>
              </div>
              <WWIcon name="chevron-right" size={18} color="var(--honey-600)" />
            </div>
          </WWCard>
        )}

        {/* Profile rows */}
        <WWCard variant="default" style={{ padding: 0, overflow: 'hidden', marginBottom: 14 }}>
          <WWListRow icon="user-round" iconTone="brand" title="Edit profile" sub="Name, breed, age, weight" />
          {suburb && <WWListRow icon="map-pin" iconTone="brand" title="Location" sub={suburb} />}
          <WWListRow icon="stethoscope" iconTone="brand" title="My vet" sub={dog.vet_name || 'Not set yet'} last />
        </WWCard>

        <WWCard variant="default" style={{ padding: 0, overflow: 'hidden', marginBottom: 14 }}>
          <WWListRow icon="bell" iconTone="neutral" title="Reminders" sub="Daily nudge at 8am" />
          <WWListRow icon="flag" iconTone="neutral" title="Advice I've flagged" sub="Help us keep guidance safe" />
          <WWListRow icon="languages" iconTone="neutral" title="Units & language" sub="kg · 24h · Australian English" last />
        </WWCard>

        <WWCard variant="flat" style={{ padding: 0, overflow: 'hidden', marginBottom: 14 }}>
          <WWListRow icon="info" iconTone="neutral" title="About Welcome Wag" sub="Guidance, not diagnosis." />
          <WWListRow
            icon="log-out"
            iconTone="neutral"
            title="Sign out"
            sub={user?.email || ''}
            onClick={handleSignOut}
            last
          />
        </WWCard>
      </div>
    </WWScreen>
  )
}
