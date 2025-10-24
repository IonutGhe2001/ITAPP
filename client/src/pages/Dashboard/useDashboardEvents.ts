import { useState } from 'react';
import {
  useEvenimente,
  useCreateEveniment,
  useDeleteEveniment,
  useUpdateEveniment,
  type Eveniment,
  type EvenimentData,
} from '@/features/events';
import { occursOn } from './utils';

export function useDashboardEvents() {
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());
  const { data: evenimente = [] } = useEvenimente();
  const createMutation = useCreateEveniment();
  const updateMutation = useUpdateEveniment();
  const deleteMutation = useDeleteEveniment();
  const [editing, setEditing] = useState<Eveniment | null>(null);
  const [formDate, setFormDate] = useState<Date | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);

  const handleCreate = async (data: EvenimentData) => {
    await createMutation.mutateAsync(data);
    setShowFormModal(false);
  };

  const handleUpdate = async (id: number | null, data: EvenimentData) => {
    if (id === null) return;
    await updateMutation.mutateAsync({ id, data });
    setEditing(null);
    setShowFormModal(false);
  };

  const handleDelete = async (id: number) => {
    await deleteMutation.mutateAsync(id);
  };

  const openCreateEvent = (date: Date = new Date()) => {
    setFormDate(date);
    setEditing(null);
    setShowFormModal(true);
  };

  const handleDayDoubleClick = (date: Date) => {
    openCreateEvent(date);
  };

  const handleEditEvent = (event: Eveniment) => {
    setFormDate(new Date(event.data));
    setEditing(event);
    setShowFormModal(true);
  };

  const eventsInDay = evenimente.filter((e) => selectedDay && occursOn(e, selectedDay));

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
    openCreateEvent,
  };
}
