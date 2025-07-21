// src/services/noteService.ts

import axios from 'axios'
import type { Note } from '../types/note'

const TOKEN = import.meta.env.VITE_NOTEHUB_TOKEN

const instance = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
  },
})

export interface FetchNotesParams {
  page: number
  perPage: number
  search?: string
}

export interface FetchNotesResponse {
  notes: Note[]
  page: number
  totalPages: number
}

export async function fetchNotes(
  params: FetchNotesParams
): Promise<FetchNotesResponse> {
  const qp = new URLSearchParams({
    page: String(params.page),
    perPage: String(params.perPage),
    ...(params.search ? { search: params.search } : {}),
  }).toString()

  const { data } = await instance.get<FetchNotesResponse>(`/notes?${qp}`)
  return data
}

export async function createNote(
  payload: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Note> {
  const { data } = await instance.post<Note>('/notes', payload)
  return data
}

export async function deleteNote(
  id: string
): Promise<{ id: string }> {
  const { data } = await instance.delete<{ id: string }>(`/notes/${id}`)
  return data
}
