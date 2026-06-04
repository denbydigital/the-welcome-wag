import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const DogContext = createContext(null)

export function DogProvider({ children }) {
  const { user } = useAuth()
  const [dogs, setDogs] = useState([])
  const [dog, setDog] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadDogs = useCallback(async () => {
    if (!user) {
      setDogs([])
      setDog(null)
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('dogs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      if (error) throw error
      setDogs(data || [])
      const current = data?.find((d) => d.is_current) || data?.[0] || null
      setDog(current)
    } catch (err) {
      console.error('Failed to load dogs:', err)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadDogs()
  }, [loadDogs])

  async function saveDog(data) {
    if (!user) throw new Error('Not authenticated')
    // Mark all existing dogs as not current
    if (dogs.length > 0) {
      await supabase.from('dogs').update({ is_current: false }).eq('user_id', user.id)
    }
    const { data: newDog, error } = await supabase
      .from('dogs')
      .insert({ ...data, user_id: user.id, is_current: true })
      .select()
      .single()
    if (error) throw error
    await loadDogs()
    return newDog
  }

  async function updateDog(id, data) {
    const { data: updated, error } = await supabase
      .from('dogs')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    await loadDogs()
    return updated
  }

  async function setCurrentDog(id) {
    if (!user) return
    await supabase.from('dogs').update({ is_current: false }).eq('user_id', user.id)
    await supabase.from('dogs').update({ is_current: true }).eq('id', id)
    await loadDogs()
  }

  return (
    <DogContext.Provider value={{ dog, dogs, loading, saveDog, updateDog, setCurrentDog, reload: loadDogs }}>
      {children}
    </DogContext.Provider>
  )
}

export function useDog() {
  const ctx = useContext(DogContext)
  if (!ctx) throw new Error('useDog must be used within DogProvider')
  return ctx
}
