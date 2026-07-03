import { useEffect, useState } from "react";
import { supabase } from '../utils/supabase'
import "../styles/account.css";
import cogOutlineItem from '../img/cog-outline.svg'
import darkCogOutlineIcon from '../img/cog-outline-custom.png'

export default function Account({ setTab }) {
    const [user, setUser] = useState(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const getUser = async () => {
            const { data } = await supabase.auth.getUser();
            const u = data?.user;

            if (u) {
                setUser(u);
                setEmail(u.email);
                setName(u.user_metadata?.name || "");
            }
        };
        getUser();

        const checkDark = () => {
            setIsDark(document.body.classList.contains("dark"));
        };
        checkDark();
        const observer = new MutationObserver(checkDark);
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ["class"],
        });
        return () => observer.disconnect();
    }, []);

    const handleUpdate = async () => {
        await supabase.auth.updateUser({
            data: { name }
        });
        alert("Perfil actualizado");
    };

    const handleResetPassword = async () => {
        await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + "/reset-password"
        });
        alert("Revisa tu email");
    };

    if (!user) return <div className="account-grid">Cargando...</div>;

    return (
        <div className="account-grid">
            <button
                className="account-settings-floating"
                onClick={() => setTab('settings')}
            >
                <img
                    src={isDark ? darkCogOutlineIcon : cogOutlineItem}
                    alt="settings"
                />
            </button>
            <div className="account-card">
                <div className="account-header">
                    <div className="account-avatar">
                        {email.charAt(0).toUpperCase()}
                    </div>
                    <div className="account-info">
                        <span className="account-email">{email}</span>
                    </div>
                </div>
                <input
                    className="account-input"
                    value={name}
                    placeholder="Tu nombre"
                    onChange={(e) => setName(e.target.value)}
                />
                <div className="account-actions">
                    <button className="account-btn" onClick={handleUpdate}>
                        Guardar cambios
                    </button>
                    <div className="account-divider" />
                    <button
                        className="account-btn account-btn-secondary"
                        onClick={handleResetPassword}
                    >
                        Cambiar contraseña
                    </button>
                </div>
            </div>
        </div>
    );
}