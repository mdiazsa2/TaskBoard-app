import type { Task } from '../types'

type Props = {
  task: Task
  onClick: () => void
}

const PRIORITY_STYLES = {
  low:    { chip: 'bg-blue-50 dark:bg-blue-900/40 text-blue-600',  dot: 'bg-blue-400' },
  normal: { chip: 'bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-300', dot: 'bg-gray-400' },
  high:   { chip: 'bg-red-50 dark:bg-red-900/40 text-red-600',    dot: 'bg-red-400' },
}

function getDueDateLabel(due_date: string | null) {
  if (!due_date) return null
  const due = new Date(due_date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  if (diffDays < 0)   return { label: '⚠ Overdue',           style: 'text-red-500 font-semibold' }
  if (diffDays === 0) return { label: '● Due today',          style: 'text-orange-500 font-semibold' }
  if (diffDays <= 3)  return { label: `⏱ ${diffDays}d left`, style: 'text-yellow-600' }
  return { label: due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), style: 'text-gray-400' }
}

const TaskCard = ({ task, onClick }: Props) => {
  const dueDateInfo = getDueDateLabel(task.due_date)
  const priority = PRIORITY_STYLES[task.priority]

  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-gray-700 rounded-xl p-3.5 shadow-sm border border-gray-100 dark:border-gray-600 cursor-pointer hover:shadow-md hover:border-gray-200 dark:hover:border-gray-500 transition-all group"
    >
      <p className="text-sm font-medium text-gray-800 dark:text-gray-100 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {task.title}
      </p>
      {task.description && (
        <p className="text-xs text-gray-400 dark:text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}
      <div className="flex items-center justify-between mt-3">
        <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${priority.chip}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${priority.dot}`} />
          {task.priority}
        </span>
        {dueDateInfo && (
          <span className={`text-xs ${dueDateInfo.style}`}>{dueDateInfo.label}</span>
        )}
      </div>
    </div>
  )
}

export default TaskCard