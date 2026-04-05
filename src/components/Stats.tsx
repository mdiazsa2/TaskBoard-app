import type { Task } from '../types'

type Props = { tasks: Task[] }

const Stats = ({ tasks }: Props) => {
  const total = tasks.length
  const done = tasks.filter(t => t.status === 'done').length
  const inProgress = tasks.filter(t => t.status === 'in_progress').length
  const completionRate = total === 0 ? 0 : Math.round((done / total) * 100)
  const overdue = tasks.filter(t => {
    if (!t.due_date || t.status === 'done') return false
    return new Date(t.due_date) < new Date(new Date().setHours(0, 0, 0, 0))
  }).length

  const stats = [
    { label: 'Total Tasks',  value: total,                    color: 'text-gray-800 dark:text-gray-100',   bg: 'bg-gray-50 dark:bg-gray-700',   border: 'border-gray-200 dark:border-gray-600' },
    { label: 'In Progress',  value: inProgress,               color: 'text-blue-600',                       bg: 'bg-blue-50 dark:bg-blue-900/30', border: 'border-blue-100 dark:border-blue-800' },
    { label: 'Completed',    value: `${done} · ${completionRate}%`, color: 'text-green-600',              bg: 'bg-green-50 dark:bg-green-900/30', border: 'border-green-100 dark:border-green-800' },
    { label: 'Overdue',      value: overdue,                  color: overdue > 0 ? 'text-red-500' : 'text-gray-300 dark:text-gray-600', bg: overdue > 0 ? 'bg-red-50 dark:bg-red-900/30' : 'bg-gray-50 dark:bg-gray-700', border: overdue > 0 ? 'border-red-100 dark:border-red-800' : 'border-gray-200 dark:border-gray-600' },
  ]

  return (
    <div className="grid grid-cols-4 gap-3 px-6 py-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
      {stats.map(stat => (
        <div key={stat.label} className={`${stat.bg} border ${stat.border} rounded-xl px-4 py-3`}>
          <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          <p className="text-xs text-gray-400 mt-0.5 font-medium">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}

export default Stats