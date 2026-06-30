import { useEffect, useState } from 'react'
import { supabase } from './utils/supabase'
import Auth from './Auth'

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Obtener sesión inicial
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })

    // Escuchar cambios (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  if (!user) {
    return <Auth />
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={() => supabase.auth.signOut()}>
        Logout
      </button>
    </div>
  )
}

export default App