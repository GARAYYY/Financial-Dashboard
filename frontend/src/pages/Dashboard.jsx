import { useState } from 'react'
import BottomNav from '../components/BottomNav'

export default function Dashboard() {
    const [tab, setTab] = useState('home')

    return (
        <div className="dashboard">
            <div className="content">
                {tab === 'home' && <h2>🏠 Home</h2>}
                {tab === 'balance' && <h2>💰 Balance total</h2>}
                {tab === 'transactions' && <h2>📜 Últimas transacciones</h2>}
                {tab === 'chart' && <h2>📊 Gastos vs ingresos</h2>}
            </div>

            <BottomNav tab={tab} setTab={setTab} />
        </div>
    )
}