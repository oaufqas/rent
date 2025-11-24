import { useState, useEffect, useCallback } from 'react'

export const useInfiniteScroll = (loadMore, hasMore, threshold = 100) => {
  const [isFetching, setIsFetching] = useState(false)

  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement.scrollTop < 
        document.documentElement.offsetHeight - threshold || 
        isFetching || !hasMore) {
      return
    }
    
    setIsFetching(true)
  }, [isFetching, hasMore, threshold])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  useEffect(() => {
    if (!isFetching) return
    
    const fetchData = async () => {
      try {
        await loadMore()
      } finally {
        setIsFetching(false)
      }
    }

    fetchData()
  }, [isFetching, loadMore])

  return { isFetching }
}