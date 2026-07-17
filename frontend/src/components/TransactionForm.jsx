import { useState, useEffect } from 'react'
import '../styles/transactionForm.css'

export default function TransactionForm({ onSave, onCancel, initial, categories }) {

    const [type, setType] = useState(initial?.type || 'expense')
    const [amount, setAmount] = useState(initial?.amount || '')
    const [description, setDescription] = useState(initial?.description || '')
    const [date, setDate] = useState(
        initial?.date || new Date().toISOString().split('T')[0]
    )
    const [categoryId, setCategoryId] = useState(initial?.category_id || '')

    // 🆕 NUEVO
    const [isRecurring, setIsRecurring] = useState(initial?.is_recurring || false)
    const [recurringType, setRecurringType] = useState(initial?.recurring_type || 3)

    useEffect(() => {
        setCategoryId('')
    }, [type])

    const handleSubmit = (e) => {
        e.preventDefault()

        onSave({
            id: initial?.id,
            type,
            amount: Number(amount),
            description,
            date,
            category_id: categoryId,
            is_recurring: isRecurring,
            recurring_type: isRecurring ? Number(recurringType) : null,
            last_generated: isRecurring ? date : null // 👈 importante
        })
    }

    const filteredCategories = categories?.filter(c => c.type === type) || []

    return (
        <form className="tx-form" onSubmit={handleSubmit}>
            <h3>{initial ? 'Editar' : 'Nueva'} transacción</h3>
            <div className="tx-toggle">
                <button
                    type="button"
                    className={type === 'income' ? 'active' : ''}
                    onClick={() => setType('income')}
                >
                    Ingreso
                </button>
                <button
                    type="button"
                    className={type === 'expense' ? 'active' : ''}
                    onClick={() => setType('expense')}
                >
                    Gasto
                </button>
            </div>
            <input
                type="number"
                placeholder="Cantidad"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
            />
            <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
            >
                <option value="">Selecciona categoría</option>
                {filteredCategories.map(c => (
                    <option key={c.id} value={c.id}>
                        {c.name}
                    </option>
                ))}
            </select>
            <input
                type="text"
                placeholder="Descripción"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />
            <div className="tx-recurring">
                <label>
                    <input
                        type="checkbox"
                        checked={isRecurring}
                        onChange={(e) => setIsRecurring(e.target.checked)}
                    />
                    Recurrente
                </label>
                {isRecurring && (
                    <select
                        value={recurringType}
                        onChange={(e) => setRecurringType(e.target.value)}
                    >
                        <option value={1}>Diario</option>
                        <option value={2}>Semanal</option>
                        <option value={3}>Mensual</option>
                        <option value={4}>Anual</option>
                    </select>
                )}
            </div>

            {/* BOTONES */}
            <div className="tx-form-actions">
                <button type="submit" className="primary">
                    Guardar
                </button>
                <button type="button" className="secondary" onClick={onCancel}>
                    Cancelar
                </button>
            </div>
        </form>
    )
}