import { useState, useEffect } from 'react'
import {
  fetchEvenimente,
  createEveniment,
  deleteEveniment,
  updateEveniment,
  type Eveniment,
  type EvenimentData,
} from '@/features/events'
import { occursOn } from './utils'

export function useDashboardEvents() {
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date())
  const [evenimente, setEvenimente] = useState<Eveniment[]>([])
  const [editing, setEditing] = useState<Eveniment | null>(null)
  const [formDate, setFormDate] = useState<Date | null>(null)
  const [showFormModal, setShowFormModal] = useState(false)

  useEffect(() => {
    fetchEvenimente().then(setEvenimente).catch(console.error)
  }, [])

  const handleCreate = async (data: EvenimentData) => {
    const nou = await createEveniment(data)
    setEvenimente((prev) => [...prev, nou])
    setShowFormModal(false)
  }

  const handleUpdate = async (id: number | null, data: EvenimentData) => {
    if (id === null) return
    const updated = await updateEveniment(id, data)
    setEvenimente((prev) => prev.map((e) => (e.id === id ? updated : e)))
    setEditing(null)
    setShowFormModal(false)
  }

  const handleDelete = async (id: number) => {
    await deleteEveniment(id)
    setEvenimente((prev) => prev.filter((e) => e.id !== id))
  }

  const handleDayDoubleClick = (date: Date) => {
    setFormDate(date)
    setEditing(null)
    setShowFormModal(true)
  }

  const handleEditEvent = (event: Eveniment) => {
    setFormDate(new Date(event.data))
    setEditing(event)
    setShowFormModal(true)
  }

  const eventsInDay = evenimente.filter(
    (e) => selectedDay && occursOn(e, selectedDay)
  )

  return {
    selectedDay,
    setSelectedDay,
    evenimente,
    eventsInDay,
    editing,
    formDate,
    showFormModal,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleDayDoubleClick,
    handleEditEvent,
    setShowFormModal,
  }
}