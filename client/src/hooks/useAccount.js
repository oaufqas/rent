import { useEffect } from 'react'
import { accountStore } from '../stores/accountStore'

export const useAccounts = (filters = {}) => {
  const { accounts, filteredAccounts, loading, fetchAccounts } = accountStore

  useEffect(() => {
    fetchAccounts(filters)
  }, [fetchAccounts, JSON.stringify(filters)])

  return {
    accounts,
    filteredAccounts,
    loading,
    refetch: () => fetchAccounts(filters)
  }
}