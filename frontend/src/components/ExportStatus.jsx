import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'

export default function ExportStatus({ transactions, categories }) {

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

            const category = getCategoryName(t.category_id)

            if (!map[monthKey]) {
                map[monthKey] = {
                    label: monthLabel.toUpperCase(),
                    income: {},
                    expense: {}
                }
            }

            const target = t.type === 'income' ? map[monthKey].income : map[monthKey].expense

            if (!target[category]) {
                target[category] = 0
            }

            target[category] += Number(t.amount)
        })

        const workbook = new ExcelJS.Workbook()
        const sheet = workbook.addWorksheet('Resumen')

        let currentRow = 1

        Object.values(map).forEach(month => {

            const titleRow = sheet.getRow(currentRow)
            titleRow.getCell(1).value = `📅 ${month.label}`
            titleRow.font = { bold: true, size: 14 }
            currentRow += 2

            const headerRow = sheet.getRow(currentRow)

            headerRow.getCell(1).value = 'Categoría'
            headerRow.getCell(2).value = 'Ingresos (€)'

            headerRow.getCell(4).value = 'Categoría'
            headerRow.getCell(5).value = 'Gastos (€)'

            headerRow.getCell(1).fill = headerRow.getCell(2).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFE8F5E9' }
            }

            headerRow.getCell(4).fill = headerRow.getCell(5).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFDECEA' }
            }

            headerRow.eachCell(cell => {
                cell.font = { bold: true }
                cell.alignment = { horizontal: 'center' }
            })

            currentRow++

            const incomeEntries = Object.entries(month.income)
            const expenseEntries = Object.entries(month.expense)

            const maxRows = Math.max(incomeEntries.length, expenseEntries.length)

            for (let i = 0; i < maxRows; i++) {
                const row = sheet.getRow(currentRow)

                if (incomeEntries[i]) {
                    row.getCell(1).value = incomeEntries[i][0]
                    row.getCell(2).value = incomeEntries[i][1]
                    row.getCell(2).numFmt = '€#,##0.00'
                }

                if (expenseEntries[i]) {
                    row.getCell(4).value = expenseEntries[i][0]
                    row.getCell(5).value = expenseEntries[i][1]
                    row.getCell(5).numFmt = '€#,##0.00'
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
            { width: 22 },
            { width: 15 },
            { width: 5 },
            { width: 22 },
            { width: 15 }
        ]

        const buffer = await workbook.xlsx.writeBuffer()
        saveAs(new Blob([buffer]), 'Estado_Mensual.xlsx')
    }

    return (
        <button className="export-btn" onClick={handleExport}>
            Exportar Estado
        </button>
    )
}