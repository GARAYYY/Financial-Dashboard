import homeOutlineIcon from '../img/home-outline.svg'
import homeIcon from '../img/home.svg'
import darkHomeOutlineIcon from '../img/home-outline-custom.png'
import darkHomeIcon from '../img/home-custom.png'
import balanceOutlineIcon from '../img/wallet-outline.svg'
import balanceIcon from '../img/wallet.svg'
import darkBalanceOutlineIcon from '../img/wallet-outline-custom.png'
import darkBalanceIcon from '../img/wallet-custom.png'
import movementOutlineIcon from '../img/briefcase-arrow-left-right-outline.svg'
import movementIcon from '../img/briefcase-arrow-left-right.svg'
import darkMovementOutlineIcon from '../img/briefcase-arrow-left-right-outline-custom.png'
import darkMovementIcon from '../img/briefcase-arrow-left-right-custom.png'
import graphOutlineIcon from '../img/chart-box-outline.svg'
import graphIcon from '../img/chart-box.svg'
import darkGraphOutlineIcon from '../img/chart-box-outline-custom.png'
import darkGraphIcon from '../img/chart-box-custom.png'
import accountOutlineIcon from '../img/account-settings-outline.svg'
import accountIcon from '../img/account-settings.svg'
import darkAccountOutlineIcon from '../img/account-settings-outline-custom.png'
import darkAccountIcon from '../img/account-settings-custom.png'
import '../styles/bottomNav.css'
import { useEffect, useState } from "react";

export default function BottomNav({ tab, setTab }) {
    const [isDark, setIsDark] = useState(false);

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
        <div className="bottom-nav">
            <button
                className={tab === 'home' ? 'active' : ''}
                onClick={() => setTab('home')}
            >
                <img
                    src={
                        tab === 'home'
                            ? (isDark ? darkHomeIcon : homeIcon)
                            : (isDark ? darkHomeOutlineIcon : homeOutlineIcon)
                    }
                    className="icon"
                />
                <span className="label">Inicio</span>
            </button>
            <button
                className={tab === 'balance' ? 'active' : ''}
                onClick={() => setTab('balance')}
            >
                <img
                    src={
                        tab === 'balance'
                            ? (isDark ? darkBalanceIcon : balanceIcon)
                            : (isDark ? darkBalanceOutlineIcon : balanceOutlineIcon)
                    }
                    className="icon"
                />
                <span className="label">Balance</span>
            </button>
            <button
                className={tab === 'transactions' ? 'active' : ''}
                onClick={() => setTab('transactions')}
            >
                <img
                    src={
                        tab === 'transactions'
                            ? (isDark ? darkMovementIcon : movementIcon)
                            : (isDark ? darkMovementOutlineIcon : movementOutlineIcon)
                    }
                    className="icon"
                />
                <span className="label">Movimientos</span>
            </button>
            <button
                className={tab === 'chart' ? 'active' : ''}
                onClick={() => setTab('chart')}
            >
                <img
                    src={
                        tab === 'chart'
                            ? (isDark ? darkGraphIcon : graphIcon)
                            : (isDark ? darkGraphOutlineIcon : graphOutlineIcon)
                    }
                    className="icon"
                />
                <span className="label">Gr&aacute;ficos</span>
            </button>
            <button
                className={tab === 'account' ? 'active' : ''}
                onClick={() => setTab('account')}
            >
                <img
                    src={
                        tab === 'account'
                            ? (isDark ? darkAccountIcon : accountIcon)
                            : (isDark ? darkAccountOutlineIcon : accountOutlineIcon)
                    }
                    className="icon"
                />
                <span className="label">Cuenta</span>
            </button>
        </div>
    )
}