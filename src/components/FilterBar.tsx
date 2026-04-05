import type { Priority } from '../types'

type Filters = {
  search: string
  priority: Priority | 'all'
}

type Props = {
  filters: Filters
  onChange: (filters: Filters) => void
}

const PRIORITIES: { value: Priority | 'all'; label: string }[] = [
  { value: 'all',    label: 'All priorities' },
  { value: 'low',    label: 'Low' },
  { value: 'normal', label: 'Normal' },
  { value: 'high',   label: 'High' },
]

const FilterBar = ({ filters, onChange }: Props) => {
  return (
    <div className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
      <div className="relative flex-1 max-w-sm">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
        <input
          type="text"
          value={filters.search}
          onChange={e => onChange({ ...filters, search: e.target.value })}
          placeholder="Search tasks..."
          className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-300 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100"
        />
        {filters.search && (
          <button
            onClick={() => onChange({ ...filters, search: '' })}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
          >✕</button>
        )}
      </div>

      <select
        value={filters.priority}
        onChange={e => onChange({ ...filters, priority: e.target.value as Priority | 'all' })}
        className="text-sm border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-1.5 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700"
      >
        {PRIORITIES.map(p => (
          <option key={p.value} value={p.value}>{p.label}</option>
        ))}
      </select>

      {(filters.search || filters.priority !== 'all') && (
        <button
          onClick={() => onChange({ search: '', priority: 'all' })}
          className="text-xs text-blue-600 hover:text-blue-800 transition-colors whitespace-nowrap"
        >
          Clear filters
        </button>
      )}
    </div>
  )
}

export type { Filters }
export default FilterBar