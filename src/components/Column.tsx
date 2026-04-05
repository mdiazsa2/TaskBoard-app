import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Task, Column as ColumnType } from '../types'
import TaskCard from './TaskCard'

function SortableCard({ task, onClick }: { task: Task; onClick: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }}
      {...attributes}
      {...listeners}
    >
      <TaskCard task={task} onClick={onClick} />
    </div>
  )
}

type Props = {
  column: ColumnType
  tasks: Task[]
  onCardClick: (task: Task) => void
}

const COLUMN_CONFIG: Record<string, { border: string; badge: string; dot: string }> = {
  todo:        { border: 'border-t-gray-300',   badge: 'bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-300',     dot: 'bg-gray-400' },
  in_progress: { border: 'border-t-blue-400',   badge: 'bg-blue-50 dark:bg-blue-900/40 text-blue-600',                      dot: 'bg-blue-400' },
  in_review:   { border: 'border-t-yellow-400', badge: 'bg-yellow-50 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400', dot: 'bg-yellow-400' },
  done:        { border: 'border-t-green-400',  badge: 'bg-green-50 dark:bg-green-900/40 text-green-600',                   dot: 'bg-green-400' },
}

const Column = ({ column, tasks, onCardClick }: Props) => {
  const { setNodeRef, isOver } = useDroppable({ id: column.id })
  const config = COLUMN_CONFIG[column.id]

  return (
    <div className={`flex flex-col rounded-xl border-t-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 ${config.border} min-w-[260px] w-full shadow-sm`}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${config.dot}`} />
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">{column.label}</h2>
        </div>
        <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${config.badge}`}>
          {tasks.length}
        </span>
      </div>

      <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={`flex-1 p-2 space-y-2 min-h-[300px] rounded-b-xl transition-colors ${isOver ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
        >
          {tasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-24 gap-1">
              <p className="text-xs text-gray-300 dark:text-gray-600">No tasks here</p>
              <p className="text-xs text-gray-200 dark:text-gray-700">Drop one here</p>
            </div>
          ) : (
            tasks.map(task => (
              <SortableCard key={task.id} task={task} onClick={() => onCardClick(task)} />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  )
}

export default Column