import { useState } from 'react'

export function usePagination(initialPage = 1, pageSize = 9) {
  const [page, setPage] = useState(initialPage)

  const nextPage = () => setPage((p) => p + 1)
  const prevPage = () => setPage((p) => Math.max(1, p - 1))
  const goToPage = (p) => setPage(Math.max(1, p))

  return { page, pageSize, nextPage, prevPage, goToPage, setPage }
}

