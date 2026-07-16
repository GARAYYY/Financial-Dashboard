import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'

export default function ExportTransactionsButton({ transactions, categories }) {

    const getCategoryName = (id) => {
        const cat = categories.find(c => c.id === id)
        return cat ? cat.name : 'Otros'
    }
    
    const handleExport = async () => {
    const map = {}
    transactions.forEach(t => {
        const date = new Date(t.date)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        const monthLabel = date.toLocaleString('es-ES', { month: 'long', year: 'numeric' })
        if (!map[monthKey]) {
            map[monthKey] = {
                label: monthLabel.toUpperCase(),
                income: [],
                expense: []
            }
        }
        const item = {
            fecha: date,
            categoria: getCategoryName(t.category_id),
            importe: Number(t.amount)
        }
        if (t.type === 'income') {
            map[monthKey].income.push(item)
        } else {
            map[monthKey].expense.push(item)
        }
    })
    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet('Movimientos')
    let currentRow = 1
    Object.values(map).forEach(month => {
        const titleRow = sheet.getRow(currentRow)
        titleRow.getCell(1).value = `📅 ${month.label}`
        titleRow.font = { bold: true, size: 14 }
        currentRow += 2
        const headerRow = sheet.getRow(currentRow)
        headerRow.getCell(1).value = 'Fecha'
        headerRow.getCell(2).value = 'Categoría'
        headerRow.getCell(3).value = 'Ingresos (€)'
        headerRow.getCell(5).value = 'Fecha'
        headerRow.getCell(6).value = 'Categoría'
        headerRow.getCell(7).value = 'Gastos (€)'
        ;[1,2,3].forEach(col => {
            headerRow.getCell(col).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFE8F5E9' }
            }
        })
        ;[5,6,7].forEach(col => {
            headerRow.getCell(col).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFDECEA' }
            }
        })
        headerRow.eachCell(cell => {
            cell.font = { bold: true }
            cell.alignment = { horizontal: 'center' }
        })
        currentRow++
        month.income.sort((a, b) => b.fecha - a.fecha)
        month.expense.sort((a, b) => b.fecha - a.fecha)
        const maxRows = Math.max(month.income.length, month.expense.length)
        for (let i = 0; i < maxRows; i++) {
            const row = sheet.getRow(currentRow)
            if (month.income[i]) {
                row.getCell(1).value = month.income[i].fecha.toLocaleDateString()
                row.getCell(2).value = month.income[i].categoria
                row.getCell(3).value = month.income[i].importe
                row.getCell(3).numFmt = '€#,##0.00'
            }
            if (month.expense[i]) {
                row.getCell(5).value = month.expense[i].fecha.toLocaleDateString()
                row.getCell(6).value = month.expense[i].categoria
                row.getCell(7).value = month.expense[i].importe
                row.getCell(7).numFmt = '€#,##0.00'
            }
            if (i % 2 === 0) {
                row.eachCell(cell => {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFF9F9F9' }
                    }
                })
            }
            currentRow++
        }
        currentRow += 3
    })
    sheet.columns = [
        { width: 15 },
        { width: 25 },
        { width: 15 },
        { width: 3 },
        { width: 15 },
        { width: 25 },
        { width: 15 }
    ]
    const buffer = await workbook.xlsx.writeBuffer()
    saveAs(new Blob([buffer]), 'Movimientos_Mensuales.xlsx')
}

    return (
        <button className="export-btn secondary" onClick={handleExport}>
            Exportar Movimientos
        </button>
    )
}