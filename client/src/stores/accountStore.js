import { makeAutoObservable } from 'mobx'
import { accountService } from '../services/index.js'

class AccountStore {
    accounts = []
    account = {}
    loading = false
    filters = {
        bape: false,
        crewUniform: false,
        more300mif: false
    }

    constructor() {
        makeAutoObservable(this)
    }

    setLoading(loading) {
        this.loading = loading
    }

    setAccount(account) {
        this.account = account
    }

    setFilters = async (filters) => {
        this.filters = { ...this.filters, ...filters }
        await this.fetchAccounts(this.filters)
    }

    clearFilters = async () => {
        this.filters = {
            bape: false,
            crewUniform: false,
            more300mif: false
        }
        await this.fetchAccounts()
    }
    

    setAccounts(accounts) {
        if (Array.isArray(accounts)) {
            this.accounts = accounts
        } else if (accounts && Array.isArray(accounts.rows)) {
            this.accounts = accounts.rows
        } else if (accounts && Array.isArray(accounts.data)) {
            this.accounts = accounts.data
        } else {
            this.accounts = []
        }
    }


    fetchAccounts = async (filters = {}) => {
        this.setLoading(true)
        try {
            const params = this.prepareFiltersForServer(filters)

            const response = await accountService.getAccounts(params)
            this.setAccounts(response.data)
        } catch (error) {
            console.error('Error fetching accounts:', error)
        } finally {
            this.setLoading(false)
        }
    }


    prepareFiltersForServer(filters) {
        const serverParams = {}

        if (filters.bape) serverParams.bape = true
        if (filters.crewUniform) serverParams.crewUniform = true
        if (filters.more300mif) serverParams.more300mif = true

        return serverParams
    }

    fetchAccount = async (id) => {
        this.setLoading(true)
        try {
            const response = await accountService.getAccount(id)
            this.setAccount(response.data)
            return response.data
        } catch (error) {
            console.error('Error fetching account:', error)
            throw error
        } finally {
            this.setLoading(false)
        }
    }
}

export const accountStore = new AccountStore()