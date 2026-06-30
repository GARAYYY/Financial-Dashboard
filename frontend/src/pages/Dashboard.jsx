import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../utils/supabase'
import BottomNav from '../components/BottomNav'
import TransactionList from '../components/TransactionList'
import TransactionForm from '../components/TransactionForm'

export default function Dashboard({ user }) {
    const [tab, setTab] = useState('home')
    const [transactions, setTransactions] = useState([])
    const [categories, setCategories] = useState([])
    const [mode, setMode] = useState('list')
    const [editing, setEditing] = useState(null)

    // 📦 FETCH TRANSACTIONS
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

    // 📦 FETCH CATEGORIES 🆕
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
        fetchCategories() // 🆕
    }, [fetchTransactions, fetchCategories])

    // ➕ CREATE
    const handleCreate = async (data) => {
        await supabase.from('transactions').insert({
            ...data,
            user_id: user.id
        })

        fetchTransactions()
        setMode('list')
    }

    // ✏️ UPDATE
    const handleUpdate = async (data) => {
        await supabase
            .from('transactions')
            .update(data)
            .eq('id', data.id)

        fetchTransactions()
        setMode('list')
        setEditing(null)
    }

    // 🗑️ DELETE
    const handleDelete = async (id) => {
        await supabase
            .from('transactions')
            .delete()
            .eq('id', id)

        fetchTransactions()
    }

    // 💰 cálculos
    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((acc, t) => acc + Number(t.amount), 0)

    const expenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => acc + Number(t.amount), 0)

    const balance = income - expenses

    return (
        <div className="dashboard">

            <div className="content">

                {tab === 'home' && (
                    <h2>🏠 Home</h2>
                )}

                {tab === 'balance' && (
                    <div className="balance-card">
                        <h2>💰 Balance total</h2>

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

                        {/* LISTA */}
                        {mode === 'list' && (
                            <TransactionList
                                transactions={transactions}
                                categories={categories} // 🆕
                                onEdit={(t) => {
                                    setEditing(t)
                                    setMode('edit')
                                }}
                                onDelete={handleDelete}
                            />
                        )}

                        {/* CREAR */}
                        {mode === 'create' && (
                            <TransactionForm
                                categories={categories} // 🆕
                                onSave={handleCreate}
                                onCancel={() => setMode('list')}
                            />
                        )}

                        {/* EDITAR */}
                        {mode === 'edit' && (
                            <TransactionForm
                                categories={categories} // 🆕
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
                    <h2>📊 Gastos vs ingresos</h2>
                )}

            </div>

            <BottomNav tab={tab} setTab={setTab} />
        </div>
    )
}