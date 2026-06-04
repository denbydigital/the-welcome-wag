import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'

export function useShoppingItems(dogId) {
  const [have, setHave] = useState({})
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (!dogId) { setLoading(false); return }
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('shopping_items')
        .select('item_key, have')
        .eq('dog_id', dogId)
      if (error) throw error
      const map = {}
      data?.forEach((row) => { map[row.item_key] = row.have })
      setHave(map)
    } catch (err) {
      console.error('Failed to load shopping items:', err)
    } finally {
      setLoading(false)
    }
  }, [dogId])

  useEffect(() => { load() }, [load])

  async function toggleItem(key) {
    const next = !have[key]
    setHave((prev) => ({ ...prev, [key]: next }))
    try {
      await supabase.from('shopping_items').upsert(
        { dog_id: dogId, item_key: key, have: next },
        { onConflict: 'dog_id,item_key' }
      )
    } catch (err) {
      console.error('Failed to save shopping item:', err)
      // Revert on error
      setHave((prev) => ({ ...prev, [key]: !next }))
    }
  }

  return { have, toggleItem, loading }
}
