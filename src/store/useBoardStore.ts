import { create } from 'zustand';
import type { Board, Column, Task } from '../types/board';
import { supabase } from '../lib/supabase';
import * as columnService from '../services/columnService';
import * as taskService from '../services/taskService';

interface BoardState {
  board: Board | null;
  loading: boolean;
  error: string | null;
  initialize: (userId: string) => Promise<void>;
  addColumn: (title: string) => Promise<void>;
  updateColumn: (id: string, title: string) => Promise<void>;
  deleteColumn: (id: string) => Promise<void>;
  addTask: (columnId: string, title: string) => Promise<void>;
  updateTask: (id: string, task: Partial<Task>) => Promise<void>;
  deleteTask: (columnId: string, taskId: string) => Promise<void>;
  reorderColumns: (newOrder: string[]) => Promise<void>;
  reorderTasks: (columnId: string, taskIds: string[]) => Promise<void>;
  setBackground: (url: string) => Promise<void>;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: null,
  loading: false,
  error: null,

  initialize: async (userId: string) => {
    set({ loading: true, error: null });
    try {
      // Get or create the user's board
      const { data: boards, error: fetchError } = await supabase
        .from('boards')
        .select(`
          id,
          background,
          columns (
            id,
            title,
            position,
            tasks (
              id,
              title,
              description,
              position,
              due_date,
              priority,
              archived
            )
          )
        `)
        .eq('user_id', userId)
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          // No board found, create one
          const { data: newBoard, error: createError } = await supabase
            .from('boards')
            .insert({ user_id: userId })
            .select()
            .single();

          if (createError) throw createError;
          set({ board: { ...newBoard, columns: [], columnOrder: [] }, loading: false });
          return;
        }
        throw fetchError;
      }

      const board = {
        ...boards,
        columns: (boards.columns || [])
          .sort((a, b) => a.position - b.position)
          .map(col => ({
            ...col,
            tasks: (col.tasks || []).sort((a, b) => a.position - b.position)
          })),
        columnOrder: (boards.columns || [])
          .sort((a, b) => a.position - b.position)
          .map(c => c.id)
      };

      set({ board, loading: false });
    } catch (error) {
      console.error('Error initializing board:', error);
      set({ error: (error as Error).message, loading: false });
    }
  },

  addColumn: async (title: string) => {
    const { board } = get();
    if (!board) return;

    try {
      const position = board.columns.length;
      const newColumn = await columnService.createColumn(board.id, title, position);
      
      set(state => ({
        board: state.board ? {
          ...state.board,
          columns: [...state.board.columns, newColumn],
          columnOrder: [...state.board.columnOrder, newColumn.id]
        } : null
      }));
    } catch (error) {
      console.error('Error adding column:', error);
      set({ error: (error as Error).message });
    }
  },

  updateColumn: async (columnId: string, title: string) => {
    try {
      await columnService.updateColumn(columnId, title);
      
      set(state => ({
        board: state.board ? {
          ...state.board,
          columns: state.board.columns.map(col =>
            col.id === columnId ? { ...col, title } : col
          )
        } : null,
        error: null
      }));
    } catch (error) {
      console.error('Error updating column:', error);
      set({ error: (error as Error).message });
      throw error;
    }
  },

  deleteColumn: async (columnId: string) => {
    try {
      await columnService.deleteColumn(columnId);
      
      set(state => ({
        board: state.board ? {
          ...state.board,
          columns: state.board.columns.filter(col => col.id !== columnId),
          columnOrder: state.board.columnOrder.filter(id => id !== columnId)
        } : null
      }));
    } catch (error) {
      console.error('Error deleting column:', error);
      set({ error: (error as Error).message });
    }
  },

  addTask: async (columnId: string, title: string) => {
    const { board } = get();
    if (!board) return;

    try {
      const column = board.columns.find(col => col.id === columnId);
      if (!column) throw new Error('Column not found');

      const position = column.tasks.length;
      const newTask = await taskService.createTask(columnId, title, position);

      set(state => ({
        board: state.board ? {
          ...state.board,
          columns: state.board.columns.map(col =>
            col.id === columnId
              ? { ...col, tasks: [...col.tasks, newTask] }
              : col
          )
        } : null
      }));
    } catch (error) {
      console.error('Error adding task:', error);
      set({ error: (error as Error).message });
    }
  },

  updateTask: async (taskId: string, updates: Partial<Task>) => {
    try {
      await taskService.updateTask(taskId, updates);
      
      set(state => ({
        board: state.board ? {
          ...state.board,
          columns: state.board.columns.map(col => ({
            ...col,
            tasks: col.tasks.map(task =>
              task.id === taskId ? { ...task, ...updates } : task
            )
          }))
        } : null
      }));
    } catch (error) {
      console.error('Error updating task:', error);
      set({ error: (error as Error).message });
      throw error;
    }
  },

  deleteTask: async (columnId: string, taskId: string) => {
    try {
      await taskService.deleteTask(taskId);
      
      set(state => ({
        board: state.board ? {
          ...state.board,
          columns: state.board.columns.map(col =>
            col.id === columnId
              ? { ...col, tasks: col.tasks.filter(task => task.id !== taskId) }
              : col
          )
        } : null
      }));
    } catch (error) {
      console.error('Error deleting task:', error);
      set({ error: (error as Error).message });
    }
  },

  reorderColumns: async (newOrder: string[]) => {
    set(state => ({
      board: state.board ? {
        ...state.board,
        columnOrder: newOrder,
        columns: newOrder.map(id => 
          state.board!.columns.find(col => col.id === id)!
        )
      } : null
    }));
  },

  reorderTasks: async (columnId: string, taskIds: string[]) => {
    set(state => ({
      board: state.board ? {
        ...state.board,
        columns: state.board.columns.map(col =>
          col.id === columnId
            ? {
                ...col,
                tasks: taskIds.map(id =>
                  col.tasks.find(task => task.id === id)!
                )
              }
            : col
        )
      } : null
    }));
  },

  setBackground: async (url: string) => {
    const { board } = get();
    if (!board) return;

    try {
      const { error } = await supabase
        .from('boards')
        .update({ background: url })
        .eq('id', board.id);

      if (error) throw error;

      set(state => ({
        board: state.board ? { ...state.board, background: url } : null
      }));
    } catch (error) {
      console.error('Error updating background:', error);
      set({ error: (error as Error).message });
    }
  }
}));