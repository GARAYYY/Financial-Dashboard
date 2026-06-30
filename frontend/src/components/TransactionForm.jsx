import { useState } from 'react'

export default function TransactionForm({ onSave, onCancel, initial }) {

    const [type, setType] = useState(initial?.type || 'expense')
    const [amount, setAmount] = useState(initial?.amount || '')
    const [description, setDescription] = useState(initial?.description || '')
    const [date, setDate] = useState(
        initial?.date || new Date().toISOString().split('T')[0]
    )

    const handleSubmit = (e) => {
        e.preventDefault()

        onSave({
            id: initial?.id,
            type,
            amount,
            description,
            date
        })
    }

    return (
        <form className="tx-form" onSubmit={handleSubmit}>

            <h3>{initial ? 'Editar' : 'Nueva'} transacción</h3>

            {/* TYPE */}
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

            {/* AMOUNT */}
            <input
                type="number"
                placeholder="Cantidad"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
            />

            {/* DESCRIPTION */}
            <input
                type="text"
                placeholder="Descripción"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            {/* DATE */}
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />

            {/* ACTIONS */}
            <div className="tx-form-actions">

                <button type="submit" className="primary">
                    Guardar
                </button>

                <button type="button" onClick={onCancel}>
                    Cancelar
                </button>

            </div>

        </form>
    )
}