import pencilOutlineItem from '../img/pencil-outline.svg'
import pencilItem from '../img/pencil.svg'
import trashOutlineItem from '../img/trash-can-outline.svg'
import trashItem from '../img/trash-can.svg'

export default function TransactionList({ transactions, onEdit, onDelete }) {
    return (
        <div className="tx-list">

            {transactions.length === 0 && (
                <p className="empty">No hay transacciones aún</p>
            )}

            {transactions.map((t) => (
                <div key={t.id} className="tx-item">

                    {/* IMPORTE */}
                    <div className={`tx-amount-big ${t.type}`}>
                        {t.type === 'income' ? '+' : '-'}
                        {Number(t.amount).toFixed(2)} €
                    </div>

                    {/* INFO + ACTIONS */}
                    <div className="tx-bottom">

                        {/* LEFT */}
                        <div className="tx-info">
                            <p className="tx-title">
                                {t.description || 'Sin descripción'}
                            </p>
                            <p className="tx-date">
                                {new Date(t.date).toLocaleDateString()}
                            </p>
                        </div>

                        {/* RIGHT (ICONS PRO) */}
                        <div className="tx-actions">

                            {/* EDIT */}
                            <button className="icon-btn" onClick={() => onEdit(t)}>
                                <img className="icon outline" src={pencilOutlineItem} />
                                <img className="icon filled" src={pencilItem} />
                            </button>

                            {/* DELETE */}
                            <button className="icon-btn" onClick={() => onDelete(t.id)}>
                                <img className="icon outline" src={trashOutlineItem} />
                                <img className="icon filled" src={trashItem} />
                            </button>

                        </div>

                    </div>

                </div>
            ))}

        </div>
    )
}