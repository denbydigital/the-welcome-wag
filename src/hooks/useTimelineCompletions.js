import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useTimelineCompletions(dogId) {
  const [completed, setCompleted] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!dogId) { setLoading(false); return }
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('timeline_completions')
        .select('item_key')
        .eq('dog_id', dogId)
      if (error) throw error
      setCompleted(data?.map((row) => row.item_key) || [])
    } catch (err) {
      console.error('Failed to load timeline completions:', err)
    } finally {
      setLoading(false)
    }
  }, [dogId])

  useEffect(() => { load() }, [load])

  async function toggleComplete(key) {
    const isDone = completed.includes(key)
    if (isDone) {
      setCompleted((prev) => prev.filter((k) => k !== key))
      try {
        await supabase
          .from('timeline_completions')
          .delete()
          .eq('dog_id', dogId)
          .eq('item_key', key)
      } catch (err) {
        console.error('Failed to remove completion:', err)
        setCompleted((prev) => [...prev, key])
      }
    } else {
      setCompleted((prev) => [...prev, key])
      try {
        await supabase
          .from('timeline_completions')
          .upsert({ dog_id: dogId, item_key: key }, { onConflict: 'dog_id,item_key' })
      } catch (err) {
        console.error('Failed to save completion:', err)
        setCompleted((prev) => prev.filter((k) => k !== key))
      }
    }
  }

  return { completed, toggleComplete, loading }
}
