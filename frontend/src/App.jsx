import { useState, useEffect } from 'react'
import { supabase } from './utils/supabase'

export default function App() {
  const [transactions, settransactions] = useState([])

  useEffect(() => {
    async function gettransactions() {
      const { data: transactions } = await supabase.from('transactions').select()

      if (transactions) {
        settransactions(transactions)
      }
    }

    gettransactions()
  }, [])

  return (
    <ul>
      {transactions.map((todo) => (
        <li key={todo.id}>{todo.name}</li>
      ))}
    </ul>
  )
}