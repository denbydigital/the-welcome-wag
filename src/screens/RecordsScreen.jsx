import React, { useEffect, useState } from 'react'
import { useDog } from '../contexts/DogContext'
import { supabase } from '../lib/supabase'
import { WWScreen, WWHeader, WWCard, WWListRow, WWAvatar, WWBadge, WWIcon } from '../components/ui'

export function RecordsScreen({ tabBar }) {
  const { dog } = useDog()
  const [vetRecords, setVetRecords] = useState([])

  useEffect(() => {
    if (!dog) return
    supabase
      .from('vet_records')
      .select('*')
      .eq('dog_id', dog.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => setVetRecords(data || []))
  }, [dog])

  if (!dog) {
    return (
      <WWScreen tabBar={tabBar}>
        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
          <p style={{ color: 'var(--ink-500)' }}>Loading…</p>
        </div>
      </WWScreen>
    )
  }

  return (
    <WWScreen tabBar={tabBar}>
      <WWHeader
        title={`${dog.name}'s records`}
        action={
          <button style={{
            width: 38, height: 38, borderRadius: 'var(--radius-pill)', border: 0,
            background: 'var(--brand)', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--shadow-pop)', cursor: 'pointer',
          }}>
            <WWIcon name="plus" size={18} color="white" strokeWidth={2} />
          </button>
        }
      />

      <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Dog card */}
        <WWCard variant="default" style={{ padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <WWAvatar name={dog.name} size={56} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, margin: 0, color: 'var(--ink-900)' }}>{dog.name}</p>
              <p style={{ fontSize: 13, color: 'var(--ink-500)', margin: '2px 0 0' }}>
                {[dog.breed, dog.age_value ? `${dog.age_value} ${dog.age_unit}` : null].filter(Boolean).join(' · ') || 'No details yet'}
              </p>
            </div>
            <WWBadge tone="sage" dot>Healthy</WWBadge>
          </div>
        </WWCard>

        {/* Vaccinations */}
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, margin: '0 0 10px 4px' }}>Vaccinations</h3>
          <WWCard variant="default" style={{ padding: 0, overflow: 'hidden' }}>
            {vetRecords.filter((r) => r.record_type === 'vaccination').length > 0 ? (
              vetRecords
                .filter((r) => r.record_type === 'vaccination')
                .map((r, i, arr) => (
                  <WWListRow
                    key={r.id}
                    icon="syringe"
                    iconTone={r.status === 'completed' ? 'sage' : 'honey'}
                    title={r.title}
                    sub={r.notes || ''}
                    metaEl={r.status === 'completed' ? <WWIcon name="circle-check" size={18} color="var(--sage-600)" /> : undefined}
                    meta={r.due_date || undefined}
                    chevron={r.status !== 'completed'}
                    last={i === arr.length - 1}
                  />
                ))
            ) : (
              <>
                <WWListRow icon="syringe" iconTone="sage" title="C3 — first vaccination" sub="Given by breeder's vet" metaEl={<WWIcon name="circle-check" size={18} color="var(--sage-600)" />} chevron={false} />
                <WWListRow icon="syringe" iconTone="honey" title="C3 — second vaccination" sub="Book with your vet" meta="Upcoming" />
                <WWListRow icon="bug" iconTone="neutral" title="Flea, tick & worming" sub="Ask your vet at next visit" meta="Due" last />
              </>
            )}
          </WWCard>
        </div>

        {/* Documents */}
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, margin: '0 0 10px 4px' }}>Documents</h3>
          <WWCard variant="default" style={{ padding: 0, overflow: 'hidden' }}>
            {vetRecords.filter((r) => r.record_type === 'document').length > 0 ? (
              vetRecords
                .filter((r) => r.record_type === 'document')
                .map((r, i, arr) => (
                  <WWListRow key={r.id} icon="file-text" iconTone="brand" title={r.title} sub={r.notes || ''} last={i === arr.length - 1} />
                ))
            ) : (
              <>
                <WWListRow icon="file-text" iconTone="brand" title="Breeder paperwork" sub="Add by tapping +" />
                <WWListRow icon="scan-line" iconTone="brand" title="Microchip certificate" sub="Add by tapping +" />
                <WWListRow icon="shield-check" iconTone="brand" title="Pet insurance" sub="Add by tapping +" last />
              </>
            )}
          </WWCard>
        </div>
      </div>
    </WWScreen>
  )
}
