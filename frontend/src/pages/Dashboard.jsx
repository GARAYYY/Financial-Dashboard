import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../utils/supabase'
import BottomNav from '../components/BottomNav'
import TransactionList from '../components/TransactionList'
import TransactionForm from '../components/TransactionForm'
import Account from '../components/Account'
import Config from '../components/Config'
import '../styles/dashboard.css'
import '../styles/balance.css'
import '../styles/transactions.css'
import '../styles/homeKpis.css'
import '../styles/charts.css'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell
} from 'recharts'

export default function Dashboard({ user }) {
    const [tab, setTab] = useState('home')
    const [transactions, setTransactions] = useState([])
    const [categories, setCategories] = useState([])
    const [mode, setMode] = useState('list')
    const [editing, setEditing] = useState(null)
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("darkMode") === "true";
    });

    const fetchTransactions = useCallback(async () => {
        if (!user) return
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', user.id)
            .order('date', { ascending: false })
        if (error) {
            console.error(error)
            return
        }
        setTransactions(data || [])
    }, [user])

    const fetchCategories = useCallback(async () => {
        if (!user) return
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .or(`user_id.is.null,user_id.eq.${user.id}`)
        if (error) {
            console.error(error)
            return
        }
        setCategories(data || [])
    }, [user])

    useEffect(() => {
        fetchTransactions()
        fetchCategories()
        if (darkMode) {
            document.body.classList.add('dark')
        } else {
            document.body.classList.remove('dark')
        }
        localStorage.setItem("darkMode", darkMode ? "true" : "false");
    }, [fetchTransactions, fetchCategories, darkMode])

    const handleCreate = async (data) => {
        await supabase.from('transactions').insert({
            ...data,
            user_id: user.id
        })
        fetchTransactions()
        setMode('list')
    }

    const handleUpdate = async (data) => {
        await supabase
            .from('transactions')
            .update(data)
            .eq('id', data.id)
        fetchTransactions()
        setMode('list')
        setEditing(null)
    }

    const handleDelete = async (id) => {
        await supabase
            .from('transactions')
            .delete()
            .eq('id', id)
        fetchTransactions()
    }

    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + Number(t.amount), 0)

    const expenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + Number(t.amount), 0)

    const balance = income - expenses

    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const currentMonthTransactions = transactions.filter(t => {
        const d = new Date(t.date)
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear
    })

    const monthlyIncome = currentMonthTransactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + Number(t.amount), 0)

    const monthlyExpenses = currentMonthTransactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + Number(t.amount), 0)

    const lastTransaction = transactions[0]

    const getMonthKey = (date) => {
        const d = new Date(date)
        return `${d.getFullYear()}-${d.getMonth()}`
    }

    const expensesByMonth = transactions.reduce((acc, t) => {
        if (t.type !== 'expense') return acc
        const key = getMonthKey(t.date)
        acc[key] = (acc[key] || 0) + Number(t.amount)
        return acc
    }, {})

    const months = Object.keys(expensesByMonth).sort()

    const currentMonthKey = months[months.length - 1]
    const previousMonthKey = months[months.length - 2]

    const currentMonthExpenses = expensesByMonth[currentMonthKey] || 0
    const previousMonthExpenses = expensesByMonth[previousMonthKey] || 0

    let expenseChangePercent = 0

    if (previousMonthExpenses > 0) {
        expenseChangePercent =
            ((currentMonthExpenses - previousMonthExpenses) /
                previousMonthExpenses) * 100
    }

    const incomeData = transactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => {
            const date = t.date
            const existing = acc.find(i => i.date === date)
            if (existing) {
                existing.total += Number(t.amount)
            } else {
                acc.push({ date, total: Number(t.amount) })
            }
            return acc
        }, [])

    const expenseData = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
            const date = t.date
            const existing = acc.find(i => i.date === date)
            if (existing) {
                existing.total += Number(t.amount)
            } else {
                acc.push({ date, total: Number(t.amount) })
            }
            return acc
        }, [])

    const groupByCategory = (type) => {
        const map = {}
        transactions
            .filter(t => t.type === type)
            .forEach(t => {
                const key = t.category_id || 'otros'
                map[key] = (map[key] || 0) + Number(t.amount)
            })
        return Object.entries(map).map(([category_id, total]) => {
            const category = categories.find(c => c.id == category_id)
            return {
                name: category?.name || 'Otros',
                value: total
            }
        })
    }

    const expenseByCategory = groupByCategory('expense')
    const incomeByCategory = groupByCategory('income')

    const sortedTransactions = [...transactions].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
    )

    const COLORS = [
        '#b71c1c', // rojo oscuro
        '#d32f2f',
        '#f44336',
        '#ff7043', // rojo-naranja
        '#ff9800', // naranja fuerte
        '#ffb74d',
        '#f06292', // rosa fuerte (rompe monotonía)
        '#ab47bc', // morado
        '#6a1b9a', // púrpura oscuro
        '#4e342e'  // marrón oscuro (cierre visual)
    ]
    const INCOME_COLORS = [
        '#1b5e20', // verde oscuro
        '#2e7d32',
        '#388e3c',
        '#43a047',
        '#4caf50',
        '#66bb6a',
        '#81c784',
        '#26a69a', // verde azulado (teal)
        '#009688', // teal fuerte
        '#00bcd4'  // cian (rompe monotonía)
    ]

    const topCategory = expenseByCategory.sort((a, b) => b.total - a.total)[0]

    return (
        <div className="dashboard">
            <div className="content">
                {tab === 'home' && (
                    <div className="home">
                        <div className="insight-card">
                            {previousMonthExpenses === 0 ? (
                                <p className="insight-text">
                                    No hay datos suficientes para comparar meses
                                </p>
                            ) : (
                                <p className="insight-text">
                                    {expenseChangePercent > 0 ? '⚠️' : '📉'} Has gastado{' '}
                                    <strong>
                                        {Math.abs(expenseChangePercent).toFixed(0)}%
                                    </strong>{' '}
                                    {expenseChangePercent > 0 ? 'más' : 'menos'} que el mes pasado
                                </p>
                            )}
                        </div>
                        <div className="kpi-row">
                            <div className="kpi-card">
                                <span className="kpi-label">Balance</span>
                                <span className="kpi-value">{balance.toFixed(2)} €</span>
                            </div>
                            <div className="kpi-card">
                                <span className="kpi-label">Ingresos (mes)</span>
                                <span className="kpi-value">{monthlyIncome.toFixed(2)} €</span>
                            </div>
                        </div>
                        <div className="kpi-row">
                            <div className="kpi-card">
                                <span className="kpi-label">Gastos (mes)</span>
                                <span className="kpi-value">{monthlyExpenses.toFixed(2)} €</span>
                            </div>
                            <div className="kpi-card">
                                <span className="kpi-label">Último movimiento</span>
                                <span className="kpi-sub">
                                    {lastTransaction?.description || 'Sin datos'}
                                </span>
                            </div>
                        </div>

                        <div className="kpi-card full">
                            <span className="kpi-label">Top categoría</span>
                            <span className="kpi-value">
                                {topCategory?.name || '—'}
                            </span>
                            <span className="kpi-sub">
                                {topCategory?.total?.toFixed(2) || 0} €
                            </span>
                        </div>
                    </div>
                )}
                {tab === 'balance' && (
                    <div className="balance-card">
                        <h2>Balance total</h2>
                        <p>Ingresos: <strong>{income.toFixed(2)} €</strong></p>
                        <p>Gastos: <strong>{expenses.toFixed(2)} €</strong></p>
                        <hr />
                        <p className="total">
                            Balance: <strong>{balance.toFixed(2)} €</strong>
                        </p>
                    </div>
                )}
                {tab === 'transactions' && (
                    <div className="transactions">
                        {mode === 'list' && (
                            <button
                                className="fab"
                                onClick={() => setMode('create')}
                            >
                                +
                            </button>
                        )}
                        {mode === 'list' && (
                            <TransactionList
                                transactions={transactions}
                                categories={categories}
                                onEdit={(t) => {
                                    setEditing(t)
                                    setMode('edit')
                                }}
                                onDelete={handleDelete}
                            />
                        )}
                        {mode === 'create' && (
                            <TransactionForm
                                categories={categories}
                                onSave={handleCreate}
                                onCancel={() => setMode('list')}
                            />
                        )}
                        {mode === 'edit' && (
                            <TransactionForm
                                categories={categories}
                                initial={editing}
                                onSave={handleUpdate}
                                onCancel={() => {
                                    setMode('list')
                                    setEditing(null)
                                }}
                            />
                        )}
                    </div>
                )}
                {tab === 'chart' && (
                    <div className="chart-grid">
                        <div className="chart-card">
                            <h3>Gastos</h3>
                            <div className="chart-card horizontal">
                                <div className="chart-left">
                                    <ResponsiveContainer width="100%" height={160}>
                                        <PieChart>
                                            <Pie
                                                data={expenseByCategory}
                                                dataKey="value"
                                                nameKey="name"
                                                innerRadius="60%"
                                                outerRadius="85%"
                                                paddingAngle={2}
                                                isAnimationActive={false}
                                            >
                                                {expenseByCategory.map((entry, index) => (
                                                    <Cell
                                                        key={index}
                                                        fill={COLORS[index % COLORS.length]}
                                                    />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="chart-right">
                                    {expenseByCategory.map((item, index) => (
                                        <div key={index} className="legend-item">
                                            <div
                                                className="legend-color"
                                                style={{ background: COLORS[index % COLORS.length] }}
                                            />
                                            <div className="legend-info">
                                                <span className="legend-name">{item.name}</span>
                                                <span className="legend-value">
                                                    €{item.value.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="chart-card">
                            <h3>Ingresos</h3>
                            <div className="chart-card horizontal">
                                <div className="chart-left">
                                    <ResponsiveContainer width="100%" height={160}>
                                        <PieChart>
                                            <Pie
                                                data={incomeByCategory}
                                                dataKey="value"
                                                nameKey="name"
                                                innerRadius="60%"
                                                outerRadius="85%"
                                                paddingAngle={2}
                                                isAnimationActive={false}
                                            >
                                                {incomeByCategory.map((entry, index) => (
                                                    <Cell
                                                        key={index}
                                                        fill={INCOME_COLORS[index % INCOME_COLORS.length]}
                                                    />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="chart-right">
                                    {incomeByCategory.map((item, index) => (
                                        <div key={index} className="legend-item">
                                            <div
                                                className="legend-color"
                                                style={{ background: INCOME_COLORS[index % INCOME_COLORS.length] }}
                                            />
                                            <div className="legend-info">
                                                <span className="legend-name">{item.name}</span>
                                                <span className="legend-value">
                                                    €{item.value.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {tab === 'account' && <Account setTab={setTab} />}
                {tab === 'settings' && <Config
                    darkMode={darkMode}
                    setDarkMode={setDarkMode}
                    setTab={setTab}
                />}
            </div>
            <BottomNav tab={tab} setTab={setTab} />
        </div>
    )
}