import { useState, useEffect } from 'react'
import { supabase } from './utils/supabase'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'

export default function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })

    const { data } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })

    return () => data.subscription.unsubscribe()
  }, [])

  if (!user) return <Auth />

  return <Dashboard user={user} />
}