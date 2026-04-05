export type Status = 'todo' | 'in_progress' | 'in_review' | 'done'
export type Priority = 'low' | 'normal' | 'high'

export type Task = {
  id: string
  title: string
  description: string | null
  status: Status
  priority: Priority
  due_date: string | null
  user_id: string
  position: number
  created_at: string
}

export type Column = {
  id: Status
  label: string
}

export const COLUMNS: Column[] = [
  { id: 'todo',        label: 'To Do' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'in_review',   label: 'In Review' },
  { id: 'done',        label: 'Done' },
]