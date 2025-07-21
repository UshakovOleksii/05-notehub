export type NoteTag = 'todo' | 'work' | 'personal' | 'meeting' | 'shopping'

export interface Note {
  id: number
  title: string
  content: string
  tag: NoteTag
  createdAt: string
  updatedAt: string
}
