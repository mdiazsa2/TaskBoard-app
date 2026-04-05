import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Task, Status } from '../types';

export function useTasks(userId: string) {
    const [tasks, setTasks] = useState<Task[]>([])
    const [loading, setLoading] = useState(true)

    const fetchTasks = async () => {
        const { data, error } = await supabase.from('tasks').select('*').eq('user_id', userId).order('created_at', { ascending: true })

        if (!error && data) {
            setTasks(data);
        }
        setLoading(false);
    }

    useEffect(() => {
    if (!userId) {
        setLoading(false)  
        return
    }
    fetchTasks()
    }, [userId])

    const createTask = async (title: string, description: string, priority: Task['priority'], due_date: string | null) => {
        if (!userId) {
            console.error('No userId available')
            return
        }

        const { data, error } = await supabase
            .from('tasks')
            .insert({ title, description, priority, due_date, status: 'todo', user_id: userId, position: 0 })
            .select()
            .single()

        console.log('createTask result:', { data, error, userId })

        if (!error && data) {
            setTasks(prev => [...prev, data])
        }
    }

    const updateTaskStatus = async (taskId: string, status: Status) => {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t))

        const { error } = await supabase.from('tasks').update({ status }).eq('id', taskId)

        if (error) {
            fetchTasks()
        }
    }

    const updateTask = async (taskId: string, updates: Partial<Pick<Task, 'title' | 'description' | 'priority' | 'due_date'>>) => {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t))

        const { error } = await supabase.from('tasks').update(updates).eq('id', taskId)

        if (error) {
            fetchTasks()
        }
    }

    const deleteTask = async (taskId: string) => {
        setTasks(prev => prev.filter(t => t.id !== taskId))

        const { error } = await supabase.from('tasks').delete().eq('id', taskId)

        if (error) {
            fetchTasks()
        }
    }

    return { tasks, loading, createTask, updateTaskStatus, updateTask, deleteTask }
}