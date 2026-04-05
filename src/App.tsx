import { useState, useMemo } from 'react'
import { useAuth } from './hooks/use-auth'
import { useTasks } from './hooks/use-tasks'
import { useTheme } from './hooks/use-theme'
import Board from './components/Board'
import TaskModal from './components/TaskModal'
import Stats from './components/Stats'
import FilterBar from './components/FilterBar'
import type { Filters } from './components/FilterBar'
import type { Task } from './types'

function App() {
  const { user, loading: authLoading } = useAuth()
  const { tasks, loading: tasksLoading, createTask, updateTaskStatus, updateTask, deleteTask } = useTasks(user?.id ?? '')
  const { isDark, toggle } = useTheme()

  const [isCreating, setIsCreating] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [filters, setFilters] = useState<Filters>({ search: '', priority: 'all' })

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.description?.toLowerCase().includes(filters.search.toLowerCase())
      const matchesPriority = filters.priority === 'all' || task.priority === filters.priority
      return matchesSearch && matchesPriority
    })
  }, [tasks, filters])

  if (authLoading || tasksLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="space-y-2 text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-400">Loading your board...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">K</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-none">My Board</h1>
            <p className="text-xs text-gray-400 mt-0.5">Track your work across stages</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={toggle}
            className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400"
            aria-label="Toggle dark mode"
          >
            {isDark ? '☀️' : '🌙'}
          </button>
          <button
            onClick={() => setIsCreating(true)}
            className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 active:scale-95 transition-all font-medium flex items-center gap-1.5 shadow-sm"
          >
            <span className="text-lg leading-none">+</span> New Task
          </button>
        </div>
      </header>

      <Stats tasks={tasks} />
      <FilterBar filters={filters} onChange={setFilters} />

      <main className="p-6">
        <Board
          tasks={filteredTasks}
          onStatusChange={updateTaskStatus}
          onCardClick={setSelectedTask}
        />
      </main>

      {isCreating && (
        <TaskModal
          mode={{ type: 'create' }}
          onClose={() => setIsCreating(false)}
          onCreate={createTask}
        />
      )}

      {selectedTask && (
        <TaskModal
          mode={{ type: 'edit', task: selectedTask }}
          onClose={() => setSelectedTask(null)}
          onUpdate={updateTask}
          onDelete={deleteTask}
        />
      )}
    </div>
  )
}

export default App