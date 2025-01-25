import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useEffect, useState } from 'react';
import { Column } from './Column';
import { useBoardStore } from '../store/useBoardStore';
import { SettingsModal } from './SettingsModal';
import { DEFAULT_BACKGROUND } from '../constants/defaults';
import { Header } from './Header';
import { AddColumnButton } from './board/AddColumnButton';
import { LoadingState } from './shared/LoadingState';
import { ErrorState } from './shared/ErrorState';

interface BoardProps {
  userId: string;
}

export function Board({ userId }: BoardProps) {
  const [showSettings, setShowSettings] = useState(false);
  const { board, loading, error, initialize, reorderColumns, reorderTasks } = useBoardStore();

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 100, tolerance: 5 },
    })
  );

  useEffect(() => {
    initialize(userId);
  }, [userId, initialize]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || !board) return;

    if (active.data.current?.type === 'Column') {
      const oldIndex = board.columnOrder.indexOf(active.id as string);
      const newIndex = board.columnOrder.indexOf(over.id as string);

      if (oldIndex !== newIndex) {
        const newOrder = arrayMove(board.columnOrder, oldIndex, newIndex);
        reorderColumns(newOrder);
      }
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || !board) return;

    if (active.data.current?.type === 'Task') {
      const activeColumn = board.columns.find((col) =>
        col.tasks.some(task => task.id === active.id)
      );
      const overColumn = board.columns.find((col) =>
        col.tasks.some(task => task.id === over.id)
      );

      if (!activeColumn || !overColumn) return;

      if (activeColumn.id !== overColumn.id) {
        const oldTaskIds = activeColumn.tasks.map(t => t.id);
        const newTaskIds = overColumn.tasks.map(t => t.id);

        const oldIndex = oldTaskIds.indexOf(active.id as string);
        const newIndex = newTaskIds.indexOf(over.id as string);

        oldTaskIds.splice(oldIndex, 1);
        newTaskIds.splice(newIndex, 0, active.id as string);

        reorderTasks(activeColumn.id, oldTaskIds);
        reorderTasks(overColumn.id, newTaskIds);
      } else {
        const taskIds = activeColumn.tasks.map(t => t.id);
        const oldIndex = taskIds.indexOf(active.id as string);
        const newIndex = taskIds.indexOf(over.id as string);

        if (oldIndex !== newIndex) {
          const newTaskIds = arrayMove(taskIds, oldIndex, newIndex);
          reorderTasks(activeColumn.id, newTaskIds);
        }
      }
    }
  };

  if (loading) {
    return <LoadingState message="Loading your board..." />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (!board) {
    return null;
  }

  return (
    <div
      className="min-h-screen p-8 bg-cover bg-center"
      style={{ backgroundImage: `url(${board.background || DEFAULT_BACKGROUND})` }}
    >
      <Header onSettingsClick={() => setShowSettings(true)} />

      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          onBackgroundChange={useBoardStore.getState().setBackground}
        />
      )}

      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <div className="flex space-x-4 overflow-x-auto pb-4">
          <SortableContext
            items={board.columnOrder}
            strategy={horizontalListSortingStrategy}
          >
            {board.columnOrder.map((columnId) => (
              <Column
                key={columnId}
                column={board.columns.find((col) => col.id === columnId)!}
              />
            ))}
          </SortableContext>

          <AddColumnButton />
        </div>
      </DndContext>
    </div>
  );
}