import { useState } from 'react'

export function useTasks() {
    const [tasks, setTasks] = useState([
        { id: '1', title: 'Task 1', status: 'TODO' },
        { id: '2', title: 'Task 2', status: 'IN_PROGRESS' },
    ])

    return { tasks, setTasks }
}
