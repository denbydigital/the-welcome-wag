import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useDog } from '../contexts/DogContext'
import {
  WWScreen, WWCard, WWListRow, WWAvatar, WWBadge, WWIcon, WWInput, WWButton,
} from '../components/ui'

/* ── Edit sheet ─────────────────────────────────────────────── */
function EditDogSheet({ dog, onSave, onClose }) {
  const [name, setName] = useState(dog.name || '')
  const [breed, setBreed] = useState(dog.breed || '')
  const [ageValue, setAgeValue] = useState(dog.age_value ? String(dog.age_value) : '')
  const [ageUnit, setAgeUnit] = useState(dog.age_unit || 'weeks')
  const [weight, setWeight] = useState(dog.weight_kg ? String(dog.weight_kg) : '')
  const [postcode, setPostcode] = useState(dog.postcode || '')
  const [vetName, setVetName] = useState(dog.vet_name || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSave() {
    if (!name.trim()) { setError('Please enter your dog\'s name.'); return }
    setSaving(true)
    setError('')
    try {
      await onSave({
        name: name.trim(),
        breed: breed.trim() || null,
        age_value: ageValue ? parseInt(ageValue) : null,
        age_unit: ageUnit,
        weight_kg: weight ? parseFloat(weight) : null,
        postcode: postcode.trim() || null,
        vet_name: vetName.trim() || null,
      })
      onClose()
    } catch (err) {
      setError(err.message || 'Could not save. Please try again.')
      setSaving(false)
    }
  }

  const UnitChip = ({ u }) => (
    <button onClick={() => setAgeUnit(u)} style={{
      padding: '7px 14px', borderRadius: 999, fontSize: 13.5, fontWeight: 600, cursor: 'pointer',
      border: ageUnit === u ? '1.5px solid var(--brand)' : '1px solid var(--cream-300)',
      background: ageUnit === u ? 'var(--brand-tint)' : 'var(--paper)',
      color: ageUnit === u ? 'var(--brand-press)' : 'var(--ink-700)',
    }}>{u}</button>
  )

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100 }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: 'absolute', inset: 0, background: 'rgba(42,33,27,0.4)', animation: 'ww-fade 220ms var(--ease-out)' }} />
      {/* Sheet */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, maxHeight: '90vh',
        background: 'var(--cream-50)', borderTopLeftRadius: 28, borderTopRightRadius: 28,
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 -8px 32px rgba(46,33,27,0.18)', animation: 'ww-slide-up 280ms var(--ease-out)',
      }}>
        {/* Handle + header */}
        <div style={{ padding: '12px 20px 0', flexShrink: 0 }}>
          <div style={{ width: 36, height: 4, background: 'var(--cream-300)', borderRadius: 999, margin: '0 auto 16px' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, margin: 0, color: 'var(--ink-900)' }}>Edit {dog.name}'s profile</h2>
            <button onClick={onClose} style={{ width: 34, height: 34, borderRadius: 999, border: 0, background: 'var(--cream-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <WWIcon name="x" size={16} color="var(--ink-700)" />
            </button>
          </div>
        </div>

        {/* Scrollable fields */}
        <div className="ww-scroll" style={{ overflowY: 'auto', padding: '0 20px', flex: 1, minHeight: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 8 }}>
            <WWInput label="Name" value={name} onChange={setName} placeholder="e.g. Cooper" />
            <WWInput label="Breed" value={breed} onChange={setBreed} placeholder="e.g. Cocker Spaniel" />
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-900)', display: 'block', marginBottom: 6 }}>Age</label>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{ width: 100 }}>
                  <WWInput value={ageValue} onChange={setAgeValue} type="number" placeholder="e.g. 11" />
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['weeks', 'months', 'years'].map(u => <UnitChip key={u} u={u} />)}
                </div>
              </div>
            </div>
            <WWInput label="Weight (kg)" value={weight} onChange={setWeight} type="number" placeholder="e.g. 4.2" suffix="kg" />
            <WWInput label="Postcode" value={postcode} onChange={setPostcode} placeholder="e.g. 2042" prefixIcon="map-pin" />
            <WWInput label="Vet clinic" value={vetName} onChange={setVetName} placeholder="e.g. Newtown Veterinary Clinic" prefixIcon="stethoscope" />
            {error && (
              <div style={{ background: 'var(--coral-50)', border: '1px solid var(--coral-300)', borderRadius: 'var(--radius-md)', padding: '12px 14px' }}>
                <p style={{ fontSize: 13.5, color: 'var(--coral-700)', margin: 0 }}>{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Save footer */}
        <div style={{ padding: '16px 20px 32px', flexShrink: 0, borderTop: '1px solid var(--cream-200)' }}>
          <WWButton variant="primary" size="lg" full onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save changes'}
          </WWButton>
        </div>
      </div>
    </div>
  )
}

/* ── Profile screen ─────────────────────────────────────────── */
export function ProfileScreen({ tabBar }) {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const { dog, updateDog } = useDog()
  const [editOpen, setEditOpen] = useState(false)

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
    <>
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
            <WWCard variant="honey" style={{ marginBottom: 14, cursor: 'pointer' }} onClick={() => setEditOpen(true)}>
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
            <WWListRow icon="user-round" iconTone="brand" title="Edit profile" sub="Name, breed, age, weight" onClick={() => setEditOpen(true)} />
            <WWListRow icon="map-pin" iconTone="brand" title="Location" sub={suburb || 'Not set'} onClick={() => setEditOpen(true)} />
            <WWListRow icon="stethoscope" iconTone="brand" title="My vet" sub={dog.vet_name || 'Not set yet'} onClick={() => setEditOpen(true)} last />
          </WWCard>

          <WWCard variant="default" style={{ padding: 0, overflow: 'hidden', marginBottom: 14 }}>
            <WWListRow icon="bell" iconTone="neutral" title="Reminders" sub="Daily nudge at 8am" chevron={false} />
            <WWListRow icon="flag" iconTone="neutral" title="Advice I've flagged" sub="Help us keep guidance safe" chevron={false} />
            <WWListRow icon="languages" iconTone="neutral" title="Units & language" sub="kg · 24h · Australian English" chevron={false} last />
          </WWCard>

          <WWCard variant="flat" style={{ padding: 0, overflow: 'hidden', marginBottom: 14 }}>
            <WWListRow icon="info" iconTone="neutral" title="About Welcome Wag" sub="Guidance, not diagnosis." chevron={false} />
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

      {editOpen && (
        <EditDogSheet
          dog={dog}
          onSave={(data) => updateDog(dog.id, data)}
          onClose={() => setEditOpen(false)}
        />
      )}
    </>
  )
}
