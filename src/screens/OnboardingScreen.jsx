import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDog } from '../contexts/DogContext'
import { WWButton, WWInput, WWIcon, WWScreen } from '../components/ui'

export function OnboardingScreen() {
  const navigate = useNavigate()
  const { saveDog } = useDog()

  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [ageUnit, setAgeUnit] = useState('weeks')
  const [breed, setBreed] = useState('')
  const [background, setBackground] = useState('breeder')
  const [postcode, setPostcode] = useState('')
  const [arrivalStatus, setArrivalStatus] = useState('arrived')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const steps = ['Name', 'Age', 'Breed', 'Background', 'Postcode', 'Arrival']

  const next = async () => {
    if (step < steps.length - 1) {
      setStep(step + 1)
    } else {
      // Final step — save dog
      setSaving(true)
      setError('')
      try {
        await saveDog({
          name: name || 'My Dog',
          age_value: age ? parseInt(age) : null,
          age_unit: ageUnit,
          breed: breed || null,
          background,
          postcode: postcode || null,
          arrival_status: arrivalStatus,
          stage: arrivalStatus === 'arrived' ? 'Day 1–7' : arrivalStatus === 'Day 1–7' ? 'Arriving this week' : 'Pre-arrival',
          first_time_owner: true,
        })
        navigate('/app/today', { replace: true })
      } catch (err) {
        setError(err.message || 'Could not save your dog. Please try again.')
        setSaving(false)
      }
    }
  }

  const back = () => {
    if (step > 0) setStep(step - 1)
    else navigate('/')
  }

  function Chip({ active, onClick, children, sub }) {
    return (
      <button onClick={onClick} style={{
        textAlign: 'left',
        padding: sub ? '14px 16px' : '8px 14px',
        borderRadius: sub ? 16 : 999,
        cursor: 'pointer',
        border: active ? '1.5px solid var(--brand)' : '1px solid var(--cream-300)',
        background: active ? 'var(--brand-tint)' : 'var(--paper)',
        color: active ? 'var(--brand-press)' : 'var(--ink-700)',
        fontWeight: 600,
        fontSize: sub ? 15 : 13.5,
        display: sub ? 'flex' : 'inline-flex',
        flexDirection: 'column',
        gap: sub ? 3 : 0,
      }}>
        {children}
        {sub && <span style={{ fontSize: 13, fontWeight: 400, color: active ? 'var(--brand-press)' : 'var(--ink-500)' }}>{sub}</span>}
      </button>
    )
  }

  const footer = (
    <div style={{ padding: '16px 20px 24px', background: 'linear-gradient(to top, var(--cream-50) 70%, transparent)', flexShrink: 0 }}>
      <WWButton variant="primary" size="lg" full onClick={next} disabled={saving} iconRight="arrow-right">
        {saving ? 'Saving…' : step === steps.length - 1 ? 'Take me to my plan' : 'Continue'}
      </WWButton>
      {step < steps.length - 1 && (
        <button onClick={() => navigate('/app/today')} style={{ width: '100%', border: 0, background: 'transparent', color: 'var(--ink-500)', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', marginTop: 10 }}>
          Skip for now
        </button>
      )}
    </div>
  )

  return (
    <WWScreen footer={footer}>
      <div style={{ padding: '8px 20px 0' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
          <button onClick={back} style={{ width: 38, height: 38, borderRadius: 'var(--radius-pill)', border: 0, background: 'var(--paper)', boxShadow: 'var(--shadow-xs)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--ink-900)' }}>
            <WWIcon name="arrow-left" size={18} />
          </button>
          <div style={{ display: 'flex', gap: 6 }}>
            {steps.map((_, i) => (
              <span key={i} style={{ width: i === step ? 22 : 6, height: 6, borderRadius: 999, background: i <= step ? 'var(--brand)' : 'var(--cream-300)', transition: 'all 220ms var(--ease-out)' }} />
            ))}
          </div>
          <div style={{ width: 38 }} />
        </div>

        {/* Step heading */}
        <div style={{ marginBottom: 22 }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Step {step + 1} of {steps.length}</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 29, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.08, margin: 0 }}>
            {step === 0 && "What's your dog's name?"}
            {step === 1 && `How old is ${name || 'your dog'}?`}
            {step === 2 && `What breed is ${name || 'your dog'}?`}
            {step === 3 && `Where's ${name || 'your dog'} coming from?`}
            {step === 4 && "What's your postcode?"}
            {step === 5 && `When does ${name || 'your dog'} arrive?`}
          </h1>
          <p style={{ fontSize: 14, color: 'var(--ink-500)', margin: '8px 0 0', lineHeight: 1.45 }}>
            {step === 0 && "We'll use this everywhere, so the app feels like a conversation, not a manual."}
            {step === 1 && 'An estimate is fine — you can refine it any time.'}
            {step === 2 && 'Pick the closest if mixed. Breed shapes guidance on exercise, health checks and training.'}
            {step === 3 && 'A rescue or foster dog may need a gentler start, so we tailor early behaviour guidance.'}
            {step === 4 && 'Local rules vary across states — registration, tick season, even council requirements. Used for guidance only.'}
            {step === 5 && "Guidance changes a lot in the first weeks. We'll meet you where you are."}
          </p>
        </div>

        {/* Step content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {step === 0 && (
            <WWInput label="Your dog's name" value={name} onChange={setName} autoFocus help="You can change this later." />
          )}

          {step === 1 && (
            <>
              <WWInput label="Age" value={age} onChange={setAge} suffix={ageUnit} type="number" />
              <div style={{ display: 'flex', gap: 8 }}>
                {['weeks', 'months', 'years'].map((u) => (
                  <Chip key={u} active={ageUnit === u} onClick={() => setAgeUnit(u)}>{u}</Chip>
                ))}
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <WWInput label="Breed" value={breed} onChange={setBreed} help="Not sure? Pick 'Mixed / unknown'." />
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
                {['Cocker Spaniel', 'Kelpie', 'Labrador', 'Staffy', 'Cavoodle', 'Mixed / unknown'].map((b) => (
                  <Chip key={b} active={breed === b} onClick={() => setBreed(b)}>{b}</Chip>
                ))}
              </div>
            </>
          )}

          {step === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { id: 'breeder', t: 'From a breeder', s: 'Likely a young puppy with known history.' },
                { id: 'rescue', t: 'Rescue or shelter', s: "We'll allow for transition stress and unknowns." },
                { id: 'foster', t: 'Foster', s: 'Short-term care guidance, gentle settling.' },
                { id: 'rehome', t: 'Rehomed privately', s: 'Adjusting to a new home and routine.' },
              ].map((o) => (
                <Chip key={o.id} active={background === o.id} onClick={() => setBackground(o.id)} sub={o.s}>{o.t}</Chip>
              ))}
            </div>
          )}

          {step === 4 && (
            <WWInput
              label="Postcode"
              value={postcode}
              onChange={setPostcode}
              prefixIcon="map-pin"
              help="We use this for local vets, brands and council rules — not marketing."
            />
          )}

          {step === 5 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { id: 'arrived', t: 'Already home', s: 'Day-one essentials and a settling-in plan.' },
                { id: 'Day 1–7', t: 'Arriving this week', s: 'Prep the house, the kit and a first vet visit.' },
                { id: 'month', t: 'Within a month', s: 'Plan checks, shopping and the right time to collect them.' },
                { id: 'later', t: 'Just exploring', s: 'Browse guidance — set up properly later.' },
              ].map((o) => (
                <Chip key={o.id} active={arrivalStatus === o.id} onClick={() => setArrivalStatus(o.id)} sub={o.s}>{o.t}</Chip>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div style={{ marginTop: 16, background: 'var(--coral-50)', border: '1px solid var(--coral-300)', borderRadius: 'var(--radius-md)', padding: '12px 14px' }}>
            <p style={{ fontSize: 13.5, color: 'var(--coral-700)', margin: 0 }}>{error}</p>
          </div>
        )}
      </div>

    </WWScreen>
  )
}
