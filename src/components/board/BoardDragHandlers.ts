import { DragEndEvent, DragOverEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useBoardStore } from '../../store/useBoardStore';

export const BoardDragHandlers = {
  handleDragEnd: (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const board = useBoardStore.getState().currentBoard;
    if (!board) return;

    if (active.data.current?.type === 'Column') {
      const oldIndex = board.columnOrder.indexOf(active.id as string);
      const newIndex = board.columnOrder.indexOf(over.id as string);

      if (oldIndex !== newIndex) {
        const newOrder = arrayMove(board.columnOrder, oldIndex, newIndex);
        useBoardStore.getState().reorderColumns(newOrder);
      }
    }
  },

  handleDragOver: (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const board = useBoardStore.getState().currentBoard;
    if (!board) return;

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

        useBoardStore.getState().reorderTasks(activeColumn.id, oldTaskIds);
        useBoardStore.getState().reorderTasks(overColumn.id, newTaskIds);
      } else {
        const taskIds = activeColumn.tasks.map(t => t.id);
        const oldIndex = taskIds.indexOf(active.id as string);
        const newIndex = taskIds.indexOf(over.id as string);

        if (oldIndex !== newIndex) {
          const newTaskIds = arrayMove(taskIds, oldIndex, newIndex);
          useBoardStore.getState().reorderTasks(activeColumn.id, newTaskIds);
        }
      }
    }
  }
};