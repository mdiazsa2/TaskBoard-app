import { DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { COLUMNS } from '../types'
import type { Task, Status } from '../types'
import Column from './Column'

type Props = {
    tasks: Task[]
    onStatusChange: (taskId: string, status: Status) => void
    onCardClick: (task: Task) => void
}

const Board = ({ tasks, onStatusChange, onCardClick }: Props) => {
    const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        if (!over) {
            return
        }

        const taskId = active.id as string
        const newStatus = over.id as Status

        const task = tasks.find(t => t.id === taskId)
        if (task && task.status !== newStatus) {
            onStatusChange(taskId, newStatus)
        }
    }

    return (
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
            <div className="flex gap-4 overflow-x-auto pb-4">
                {COLUMNS.map(column => (
                    <Column
                        key={column.id}
                        column={column}
                        tasks={tasks.filter(t => t.status === column.id)}
                        onCardClick={onCardClick}
                        />
                ))}
            </div>
        </DndContext>
    )
}

export default Board