import { useEffect, useState, useCallback } from "react";
import { supabase } from "../utils/supabase";
import BottomNav from "../components/BottomNav";
import TransactionList from "../components/TransactionList";
import TransactionForm from "../components/TransactionForm";
import Account from "../components/Account";
import Config from "../components/Config";
import ExportExcelButton from "../components/ExportStatus";
import ExportTransactionsButton from "../components/ExportMovements";
import "../styles/dashboard.css";
import "../styles/transactions.css";
import "../styles/homeKpis.css";
import "../styles/charts.css";
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
    Cell,
} from "recharts";

export default function Dashboard({ user }) {
    const [tab, setTab] = useState("home");
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [mode, setMode] = useState("list");
    const [editing, setEditing] = useState(null);
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("darkMode") === "true";
    });

    const fetchTransactions = useCallback(async () => {
        if (!user) return;
        const { data, error } = await supabase
            .from("transactions")
            .select("*")
            .eq("user_id", user.id)
            .order("date", { ascending: false });
        if (error) {
            console.error(error);
            return;
        }
        setTransactions(data || []);
    }, [user]);

    const fetchCategories = useCallback(async () => {
        if (!user) return;
        const { data, error } = await supabase
            .from("categories")
            .select("*")
            .or(`user_id.is.null,user_id.eq.${user.id}`);
        if (error) {
            console.error(error);
            return;
        }
        setCategories(data || []);
    }, [user]);

    useEffect(() => {
        fetchTransactions();
        fetchCategories();
        if (darkMode) {
            document.body.classList.add("dark");
        } else {
            document.body.classList.remove("dark");
        }
        localStorage.setItem("darkMode", darkMode ? "true" : "false");
    }, [fetchTransactions, fetchCategories, darkMode]);

    const handleCreate = async (data) => {
        await supabase.from("transactions").insert({
            ...data,
            user_id: user.id,
        });
        fetchTransactions();
        setMode("list");
    };

    const handleUpdate = async (data) => {
        await supabase.from("transactions").update(data).eq("id", data.id);
        fetchTransactions();
        setMode("list");
        setEditing(null);
    };

    const handleDelete = async (id) => {
        await supabase.from("transactions").delete().eq("id", id);
        fetchTransactions();
    };

    const income = transactions
        .filter((t) => t.type === "income")
        .reduce((acc, t) => acc + Number(t.amount), 0);

    const expenses = transactions
        .filter((t) => t.type === "expense")
        .reduce((acc, t) => acc + Number(t.amount), 0);

    const balance = income - expenses;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const currentMonthTransactions = transactions.filter((t) => {
        const d = new Date(t.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });

    const monthlyIncome = currentMonthTransactions
        .filter((t) => t.type === "income")
        .reduce((acc, t) => acc + Number(t.amount), 0);

    const monthlyExpenses = currentMonthTransactions
        .filter((t) => t.type === "expense")
        .reduce((acc, t) => acc + Number(t.amount), 0);

    const lastTransaction = transactions[0];

    const getMonthKey = (date) => {
        const d = new Date(date);
        return `${d.getFullYear()}-${d.getMonth()}`;
    };

    const expensesByMonth = transactions.reduce((acc, t) => {
        if (t.type !== "expense") return acc;
        const key = getMonthKey(t.date);
        acc[key] = (acc[key] || 0) + Number(t.amount);
        return acc;
    }, {});

    const months = Object.keys(expensesByMonth).sort();

    const currentMonthKey = months[months.length - 1];
    const previousMonthKey = months[months.length - 2];

    const currentMonthExpenses = expensesByMonth[currentMonthKey] || 0;
    const previousMonthExpenses = expensesByMonth[previousMonthKey] || 0;

    let expenseChangePercent = 0;

    if (previousMonthExpenses > 0) {
        expenseChangePercent =
            ((currentMonthExpenses - previousMonthExpenses) / previousMonthExpenses) *
            100;
    }

    const incomeData = transactions
        .filter((t) => t.type === "income")
        .reduce((acc, t) => {
            const date = t.date;
            const existing = acc.find((i) => i.date === date);
            if (existing) {
                existing.total += Number(t.amount);
            } else {
                acc.push({ date, total: Number(t.amount) });
            }
            return acc;
        }, []);

    const expenseData = transactions
        .filter((t) => t.type === "expense")
        .reduce((acc, t) => {
            const date = t.date;
            const existing = acc.find((i) => i.date === date);
            if (existing) {
                existing.total += Number(t.amount);
            } else {
                acc.push({ date, total: Number(t.amount) });
            }
            return acc;
        }, []);

    const groupByCategory = (type) => {
        const map = {};
        transactions
            .filter((t) => t.type === type)
            .forEach((t) => {
                const key = t.category_id || "otros";
                map[key] = (map[key] || 0) + Number(t.amount);
            });
        return Object.entries(map).map(([category_id, total]) => {
            const category = categories.find((c) => c.id == category_id);
            return {
                name: category?.name || "Otros",
                value: total,
            };
        });
    };

    const expenseByCategory = groupByCategory("expense");
    const incomeByCategory = groupByCategory("income");

    const sortedTransactions = [...transactions].sort(
        (a, b) => new Date(a.date) - new Date(b.date),
    );

    const COLORS = [
        "#b71c1c",
        "#d32f2f",
        "#f44336",
        "#ff7043",
        "#ff9800",
        "#ffb74d",
        "#f06292",
        "#ab47bc",
        "#6a1b9a",
        "#4e342e",
    ];
    const INCOME_COLORS = [
        "#1b5e20",
        "#2e7d32",
        "#388e3c",
        "#43a047",
        "#4caf50",
        "#66bb6a",
        "#81c784",
        "#26a69a",
        "#009688",
        "#00bcd4",
    ];

    const getHealthColor = (value) => {
    if (value >= 75) return "#08ad0d";
    if (value >= 65) return "#7ed957";
    if (value >= 35) return "#ffc107";
    if (value >= 25) return "#ff9800";
    return "#ff4d4f";
};

    const topCategory = expenseByCategory.sort((a, b) => b.total - a.total)[0];

    const score = Math.max(0, Math.min(100,
        100 - (monthlyExpenses / (monthlyIncome || 1)) * 100
    ))

    const getCategoryName = (categoryId) => {
        const cat = categories.find(c => c.id === categoryId)
        return cat ? cat.name : "Sin categoría"
    }

    const healthPercent = monthlyIncome > 0
        ? Math.max(0, Math.min(100, ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100))
        : 0;

    return (
        <div className="dashboard">
            <div className="content">
                {tab === "home" && (
                    <div className="home">
                        <div className="chart-card big">
                            <h3>Evolución ingresos vs gastos</h3>
                            <ResponsiveContainer width="100%" height={200}>
                                <AreaChart data={sortedTransactions}>
                                    <XAxis dataKey="date" hide />
                                    <YAxis />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="amount" stroke="#4caf50" fill="#4caf50" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="card">
                            <h3>Últimos movimientos</h3>
                            {transactions.slice(0, 5).map(t => (
                                <div key={t.id} className="mini-transaction">
                                    <span>{getCategoryName(t.category_id)}</span>
                                    <span className={t.type}>
                                        {t.type === 'income' ? '+' : '-'}{t.amount.toFixed(2)}€
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="card">
                            <h3>Top gastos</h3>
                            {expenseByCategory
                                .sort((a, b) => b.value - a.value)
                                .slice(0, 5)
                                .map((c, i) => (
                                    <div key={i} className="rank-item">
                                        <span>#{i + 1} {c.name}</span>
                                        <span>{c.value.toFixed(2)} €</span>
                                    </div>
                                ))}
                        </div>
                        <div className="kpi-card-score">
                            <span className="kpi-label">Salud financiera</span>

                            <div className="health-bar">
                                <div
                                    className="health-fill"
                                    style={{
                                        width: `${healthPercent}%`,
                                        background: getHealthColor(healthPercent)
                                    }}
                                />
                            </div>

                            <span className="kpi-value">
                                {healthPercent.toFixed(0)}%
                            </span>
                        </div>
                        <div className="quick-actions">
                            <button onClick={() => setTab("transactions")}>Añadir movimiento</button>
                            <button onClick={() => setTab("chart")}>Ver análisis</button>
                        </div>
                    </div>
                )}
                {tab === "transactions" && (
                    <div className="transactions">
                        {mode === "list" && (
                            <button className="fab" onClick={() => setMode("create")}>
                                +
                            </button>
                        )}
                        {mode === "list" && (
                            <TransactionList
                                transactions={transactions}
                                categories={categories}
                                onEdit={(t) => {
                                    setEditing(t);
                                    setMode("edit");
                                }}
                                onDelete={handleDelete}
                            />
                        )}
                        {mode === "create" && (
                            <TransactionForm
                                categories={categories}
                                onSave={handleCreate}
                                onCancel={() => setMode("list")}
                            />
                        )}
                        {mode === "edit" && (
                            <TransactionForm
                                categories={categories}
                                initial={editing}
                                onSave={handleUpdate}
                                onCancel={() => {
                                    setMode("list");
                                    setEditing(null);
                                }}
                            />
                        )}
                    </div>
                )}
                {tab === "chart" && (
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
                                                style={{
                                                    background:
                                                        INCOME_COLORS[index % INCOME_COLORS.length],
                                                }}
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
                        <ExportExcelButton
                            transactions={transactions}
                            categories={categories}
                        />
                        <ExportTransactionsButton
                            transactions={transactions}
                            categories={categories}
                        />
                    </div>
                )}
                {tab === "account" && (
                    <Account
                        setTab={setTab}
                        darkMode={darkMode}
                        setDarkMode={setDarkMode}
                        setTab={setTab}
                    />
                )}
            </div>
            <BottomNav tab={tab} setTab={setTab} />
        </div>
    );
}
