import { useState } from 'react'
import { supabase } from '../utils/supabase'
import '../App.css'

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            if (isLogin) {
                // LOGIN
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password
                })

                if (error) throw error

            } else {
                // REGISTER
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password
                })

                if (error) throw error

                // Crear perfil (opcional)
                if (data.user) {
                    await supabase.from('profiles').insert({
                        id: data.user.id,
                        full_name: name
                    })
                }
            }

        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-container">
            <h2>{isLogin ? 'Login' : 'Register'}</h2>

            <form onSubmit={handleSubmit}>
                {!isLogin && (
                    <input
                        type="text"
                        placeholder="Nombre"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                )}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button disabled={loading}>
                    {loading ? 'Cargando...' : isLogin ? 'Login' : 'Register'}
                </button>
            </form>

            {error && <p style={{ color: 'salmon' }}>{error}</p>}

            <p
                className="auth-toggle"
                onClick={() => setIsLogin(!isLogin)}
            >
                {isLogin
                    ? '¿No tienes cuenta? Regístrate'
                    : '¿Ya tienes cuenta? Login'}
            </p>
        </div>
    )
}