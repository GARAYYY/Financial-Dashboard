import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import '../styles/config.css'
import arrowIcon from '../img/arrow-left.svg'
import darkArrowIcon from '../img/arrow-left-custom.png'


export default function Config({ darkMode, setDarkMode, setTab }) {

    const [isDark, setIsDark] = useState(false);

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Error al cerrar sesión:", error.message);
        }
    };

    useEffect(() => {
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
    return (
        <div className="account-card">
            <div className="account-card">
                <h3>Ajustes</h3>
                <div className="config-item">
                    <span>Modo oscuro</span>
                    <label className="switch">
                        <input
                            type="checkbox"
                            checked={darkMode}
                            onChange={(e) => setDarkMode(e.target.checked)} />
                        <span className="slider"></span>
                    </label>
                </div>
            </div>
            <button
                className="logout-button"
                onClick={handleLogout}
            >
                Cerrar sesión
            </button>
        </div>
    );
}