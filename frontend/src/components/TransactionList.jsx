import { useState, useMemo, useEffect } from "react";

import pencilOutlineItem from '../img/pencil-outline.svg'
import darkPencilOutlineItem from '../img/pencil-outline-custom.png'
import pencilItem from '../img/pencil.svg'
import darkPencilItem from '../img/pencil-custom.png'

import trashOutlineItem from '../img/trash-can-outline.svg'
import darkTrashOutlineItem from '../img/trash-can-outline-custom.png'
import trashItem from '../img/trash-can.svg'
import darkTrashItem from '../img/trash-can-custom.png'

export default function TransactionList({ transactions, categories, onEdit, onDelete }) {

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

    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("all");
    const [filterCategory, setFilterCategory] = useState("all");

    const getCategoryName = (id) => {
        const cat = categories?.find(c => c.id === id)
        return cat ? cat.name : 'Sin categoría'
    }

    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => {
            const categoryName = getCategoryName(t.category_id).toLowerCase();
            const description = (t.description || "").toLowerCase();
            const searchText = search.toLowerCase();

            const matchesSearch =
                categoryName.includes(searchText) ||
                description.includes(searchText);

            const matchesType =
                filterType === "all" || t.type === filterType;

            const matchesCategory =
                filterCategory === "all" || String(t.category_id) === filterCategory;

            return matchesSearch && matchesType && matchesCategory;
        });
    }, [transactions, search, filterType, filterCategory]);

    return (
        <div className="tx-container">
            <input
                type="text"
                placeholder="Buscar transacción..."
                className="tx-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <div className="tx-filters">
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                    <option value="all">Todos los movimientos</option>
                    <option value="income">Ingresos</option>
                    <option value="expense">Gastos</option>
                </select>
                <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                    <option value="all">Todas las categorías</option>
                    {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
            </div>
            <div className="tx-list">
                {filteredTransactions.length === 0 && (
                    <p className="empty">No hay resultados</p>
                )}
                {filteredTransactions.map((t) => (
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
                                    <img
                                        className="icon outline"
                                        src={isDark ? darkPencilOutlineItem : pencilOutlineItem}
                                        alt="edit"
                                    />
                                    <img
                                        className="icon filled"
                                        src={isDark ? darkPencilItem : pencilItem}
                                        alt="edit"
                                    />
                                </button>

                                {/* DELETE */}
                                <button className="icon-btn" onClick={() => onDelete(t.id)}>
                                    <img
                                        className="icon outline"
                                        src={isDark ? darkTrashOutlineItem : trashOutlineItem}
                                        alt="delete"
                                    />
                                    <img
                                        className="icon filled"
                                        src={isDark ? darkTrashItem : trashItem}
                                        alt="delete"
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}