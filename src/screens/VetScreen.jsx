import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDog } from '../contexts/DogContext'
import { supabase } from '../lib/supabase'
import { WW_VETS, WW_VET_QUESTIONS } from '../data/index'
import {
  WWScreen, WWHeader, WWCard, WWListRow, WWIconBadge, WWBadge, WWButton,
  WWIcon, WWToast,
} from '../components/ui'

function Disclaimer() {
  return (
    <p style={{ fontSize: 12, color: 'var(--ink-500)', textAlign: 'center', margin: '4px 0 0', lineHeight: 1.5 }}>
      This is general guidance, not medical advice. For urgent concerns, <span style={{ color: 'var(--coral-600)', fontWeight: 600 }}>call your vet</span>.
    </p>
  )
}

export function VetScreen({ tabBar }) {
  const navigate = useNavigate()
  const { dog } = useDog()
  const [saved, setSaved] = useState(false)
  const [scheduled, setScheduled] = useState(false)
  const [toast, setToast] = useState({ show: false, text: '' })

  function showToast(text) {
    setToast({ show: true, text })
    setTimeout(() => setToast({ show: false, text }), 2400)
  }

  async function handleBooked() {
    setScheduled(true)
    showToast('Reminder added — day before your visit')
    if (dog) {
      try {
        await supabase.from('vet_records').upsert({
          dog_id: dog.id,
          record_type: 'vaccination',
          title: 'First vet visit — booked',
          status: 'booked',
        }, { onConflict: 'dog_id,title' })
      } catch (err) {
        console.error('Failed to save vet record:', err)
      }
    }
  }

  const dogName = dog?.name || 'your dog'
  const dogBreed = dog?.breed || 'puppy'
  const dogAgeUnit = dog?.age_unit || 'months'
  const postcode = dog?.postcode || ''
  const suburb = dog?.suburb || postcode || 'your area'

  return (
    <WWScreen tabBar={tabBar}>
      <WWHeader onBack={() => navigate(-1)} subtitle="First vet visit" title="Time to book a check-up" />
      <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Recommended window */}
        <WWCard variant="brand" style={{ padding: 20 }}>
          <div className="eyebrow" style={{ color: 'var(--honey-100)', marginBottom: 6 }}>Recommended window</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 21, fontWeight: 600, margin: '0 0 6px', lineHeight: 1.2 }}>Within the next 7 days</h2>
          <p style={{ fontSize: 14, color: 'var(--terracotta-100)', margin: 0, lineHeight: 1.45 }}>
            A young {dogBreed} is due a health check and second vaccination. Booking now keeps {dogName}'s schedule on track.
          </p>
        </WWCard>

        {/* What to expect */}
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, margin: '0 0 10px', color: 'var(--ink-900)' }}>What to expect</h3>
          <WWCard variant="default" style={{ padding: 0, overflow: 'hidden' }}>
            <WWListRow icon="clipboard-list" iconTone="sky" title="Check-in & weigh-in" sub="A quick weight and history" chevron={false} />
            <WWListRow icon="stethoscope" iconTone="sage" title="Nose-to-tail exam" sub="Heart, eyes, ears, teeth, joints" chevron={false} />
            <WWListRow icon="syringe" iconTone="honey" title="Vaccination & worming" sub="Second C3, plus a parasite plan" chevron={false} last />
          </WWCard>
        </div>

        {/* Questions to ask */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0 4px 10px' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, margin: 0, color: 'var(--ink-900)' }}>Questions to ask</h3>
            <button onClick={() => { setSaved(true); showToast('Questions saved to records') }} style={{ border: 0, background: 'transparent', color: 'var(--brand-hover)', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', gap: 6, alignItems: 'center' }}>
              <WWIcon name={saved ? 'check' : 'bookmark'} size={15} />
              {saved ? 'Saved' : 'Save list'}
            </button>
          </div>
          <WWCard variant="default" style={{ padding: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {WW_VET_QUESTIONS.map((qq, i) => (
                <div key={i} style={{ display: 'flex', gap: 11, alignItems: 'flex-start' }}>
                  <WWIcon name="message-circle-question" size={17} color="var(--brand)" style={{ marginTop: 2, flexShrink: 0 }} />
                  <p style={{ fontSize: 14, color: 'var(--ink-700)', margin: 0, lineHeight: 1.45 }}>{qq}</p>
                </div>
              ))}
            </div>
          </WWCard>
        </div>

        {/* Vets nearby */}
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, margin: '0 0 10px', color: 'var(--ink-900)' }}>
            Vets near {suburb.toString().split(',')[0]}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {WW_VETS.map((v, i) => (
              <WWCard key={i} variant={v.emergency ? 'outline' : 'default'} style={{ padding: 16 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <WWIconBadge icon={v.emergency ? 'ambulance' : 'map-pin'} tone={v.emergency ? 'coral' : 'sky'} size={40} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink-900)', margin: 0 }}>{v.name}</p>
                      {v.rating && <WWBadge tone="sage" icon="star">{v.rating}</WWBadge>}
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--ink-500)', margin: '3px 0 0' }}>{v.suburb} · {v.dist}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '8px 0 0', flexWrap: 'wrap' }}>
                      <WWBadge tone={v.emergency ? 'coral' : 'sage'} dot>{v.hours}</WWBadge>
                      <span style={{ fontSize: 12.5, color: 'var(--ink-500)' }}>{v.note}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                      <WWButton variant={v.emergency ? 'danger' : 'primary'} size="sm" icon="phone">{v.phone}</WWButton>
                      <WWButton variant="ghost" size="sm" icon="globe">Website</WWButton>
                    </div>
                  </div>
                </div>
              </WWCard>
            ))}
          </div>
          {postcode && (
            <p style={{ fontSize: 12, color: 'var(--ink-500)', margin: '10px 4px 0', lineHeight: 1.5 }}>
              Clinic list is information only — we don't book on your behalf. Distances from postcode {postcode}.
            </p>
          )}
        </div>

        <WWButton
          variant={scheduled ? 'secondary' : 'primary'}
          size="lg"
          full
          icon={scheduled ? 'check' : 'calendar-check'}
          onClick={handleBooked}
        >
          {scheduled ? 'Marked as booked' : "I've booked the visit"}
        </WWButton>
        <Disclaimer />
      </div>

      <WWToast show={toast.show}>{toast.text}</WWToast>
    </WWScreen>
  )
}
