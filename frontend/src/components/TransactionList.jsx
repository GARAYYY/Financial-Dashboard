import pencilOutlineItem from '../img/pencil-outline.svg'
import pencilItem from '../img/pencil.svg'
import trashOutlineItem from '../img/trash-can-outline.svg'
import trashItem from '../img/trash-can.svg'

export default function TransactionList({ transactions, categories, onEdit, onDelete }) {

    const getCategoryName = (id) => {
        const cat = categories?.find(c => c.id === id)
        return cat ? cat.name : 'Sin categoría'
    }

    return (
        <div className="tx-list">
            {transactions.length === 0 && (
                <p className="empty">No hay transacciones aún</p>
            )}
            {transactions.map((t) => (
                <div key={t.id} className="tx-item">
                    <div className={`tx-amount-big ${t.type}`}>
                        {t.type === 'income' ? '+' : '-'}
                        {Number(t.amount).toFixed(2)} €
                    </div>
                    <div className="tx-bottom">
                        <div className="tx-info">
                            <p className="tx-category">
                                {getCategoryName(t.category_id)}
                            </p>
                            <p className="tx-title">
                                {t.description || getCategoryName(t.category_id)}
                            </p>
                            <p className="tx-date">
                                {new Date(t.date).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="tx-actions">
                            <button className="icon-btn" onClick={() => onEdit(t)}>
                                <img className="icon outline" src={pencilOutlineItem} />
                                <img className="icon filled" src={pencilItem} />
                            </button>
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