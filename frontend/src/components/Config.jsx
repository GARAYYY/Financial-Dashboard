import '../styles/config.css'

export default function Config({ darkMode, setDarkMode }) {
    return (
        <div className="account-grid">
            <div className="account-card">
                <h3>Ajustes</h3>
                <div className="config-item">
                    <span>Modo oscuro</span>
                    <label className="switch">
                        <input 
                            type="checkbox"
                            checked={darkMode}
                            onChange={() => setDarkMode(!darkMode)}
                        />
                        <span className="slider"></span>
                    </label>
                </div>

            </div>
        </div>
    );
}