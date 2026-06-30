import homeOutlineIcon from '../img/home-outline.svg'
import homeIcon from '../img/home.svg'
import balanceOutlineIcon from '../img/wallet-outline.svg'
import balanceIcon from '../img/wallet.svg'
import movementOultineIcon from '../img/briefcase-arrow-left-right-outline.svg'
import movementIcon from '../img/briefcase-arrow-left-right.svg'
import graphOutlineIncon from '../img/chart-box-outline.svg'
import graphIcon from '../img/chart-box.svg'
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
                <span className="label">Home</span>
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
                <span className="label">Transactions</span>
            </button>
            <button
                className={tab === 'chart' ? 'active' : ''}
                onClick={() => setTab('chart')}
            >
                <img
                    src={tab === 'chart' ? graphIcon : graphOutlineIncon}
                    className="icon"
                />
                <span className="label">Graph</span>
            </button> 
        </div>
    )
}