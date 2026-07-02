import homeOutlineIcon from '../img/home-outline.svg'
import homeIcon from '../img/home.svg'
import balanceOutlineIcon from '../img/wallet-outline.svg'
import balanceIcon from '../img/wallet.svg'
import movementOultineIcon from '../img/briefcase-arrow-left-right-outline.svg'
import movementIcon from '../img/briefcase-arrow-left-right.svg'
import graphOutlineIncon from '../img/chart-box-outline.svg'
import graphIcon from '../img/chart-box.svg'
import accountOutlineIcon from '../img/account-settings-outline.svg'
import accountIcon from '../img/account-settings.svg'
import '../styles/bottomNav.css'

export default function BottomNav({ tab, setTab }) {
    return (
        <div className="bottom-nav">
            <button
                className={tab === 'home' ? 'active' : ''}
                onClick={() => setTab('home')}
            >
                <img
                    src={tab === 'home' ? homeIcon : homeOutlineIcon}
                    className="icon"
                />
                <span className="label">Inicio</span>
            </button>
            <button
                className={tab === 'balance' ? 'active' : ''}
                onClick={() => setTab('balance')}
            >
                <img
                    src={tab === 'balance' ? balanceIcon : balanceOutlineIcon}
                    className="icon"
                />
                <span className="label">Balance</span>
            </button>
            <button
                className={tab === 'transactions' ? 'active' : ''}
                onClick={() => setTab('transactions')}
            >
                <img
                    src={tab === 'transactions' ? movementIcon : movementOultineIcon}
                    className="icon"
                />
                <span className="label">Movimientos</span>
            </button>
            <button
                className={tab === 'chart' ? 'active' : ''}
                onClick={() => setTab('chart')}
            >
                <img
                    src={tab === 'chart' ? graphIcon : graphOutlineIncon}
                    className="icon"
                />
                <span className="label">Gr&aacute;ficos</span>
            </button>
            <button
                className={tab === 'account' ? 'active' : ''}
                onClick={() => setTab('account')}
            >
                <img
                    src={tab === 'account' ? accountIcon : accountOutlineIcon}
                    className="icon"
                />
                <span className="label">Cuenta</span>
            </button> 
        </div>
    )
}