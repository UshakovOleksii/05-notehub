import { useState } from 'react'
import { useDebounce } from 'use-debounce'
import { useQuery } from '@tanstack/react-query'

import type { FetchNotesResponse } from '../../services/noteService'
import { fetchNotes } from '../../services/noteService'

import SearchBox from '../SearchBox/SearchBox'
import Pagination from '../Pagination/Pagination'
import NoteList from '../NoteList/NoteList'
import Modal from '../Modal/Modal'
import NoteForm from '../NoteForm/NoteForm'

import css from './App.module.css'

export default function App() {
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch] = useDebounce(searchTerm, 500)
  const [isModalOpen, setIsModalOpen] = useState(false)

const { data, isLoading, isError } = useQuery<FetchNotesResponse, Error>({
  queryKey: ['notes', page, debouncedSearch],
  queryFn: () =>
    fetchNotes({
      page,
      perPage: 12,
      search: debouncedSearch,
    }),
})

  if (isLoading) {
    return <p className={css.message}>Loading notes…</p>
  }
  if (isError) {
    return <p className={css.message}>Error loading notes</p>
  }

  const notes = data?.notes ?? []
  const totalPages = data?.totalPages ?? 0

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        <SearchBox onSearch={setSearchTerm} />

        {totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}

        <button className={css.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      {notes.length > 0 ? (
        <NoteList notes={notes} />
      ) : (
        <p className={css.message}>No notes found</p>
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  )
}
