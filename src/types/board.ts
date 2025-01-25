export interface ChecklistItem {
  id: string;
  title: string;
  checked: boolean;
  position: number;
}

export interface Checklist {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  createdAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
}

export interface BoardMember {
  userId: string;
  role: 'owner' | 'member';
}

export interface Task {
  id: string;
  title: string;
  description: string;
  position: number;
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
  archived: boolean;
  labels: Label[];
  checklists: Checklist[];
  comments: Comment[];
  attachments: Attachment[];
}

export interface Column {
  id: string;
  title: string;
  position: number;
  tasks: Task[];
}

export interface Board {
  id: string;
  background?: string;
  columns: Column[];
  columnOrder: string[];
  labels: Label[];
  members: BoardMember[];
}