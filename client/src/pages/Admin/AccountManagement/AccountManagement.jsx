import { motion } from 'framer-motion'
import { Plus, Search, Filter, Edit, Trash2, Eye, Clock, RefreshCw } from 'lucide-react' // Добавляем иконки
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { adminStore } from '../../../stores/adminStore'
import Button from '../../../components/ui/Button/Button'
import StatusBadge from '../../../components/ui/StatusBadge/StatusBadge'
import { formatCurrency } from '../../../utils/formatters'
import Modal from '../../../components/ui/Modal/Modal'
import styles from './AccountManagement.module.css'
import { generatePath, ROUTES } from '../../../utils/constants'

const AccountManagement = observer(() => {
  const { 
    accounts, 
    loading, 
    fetchAccounts, 
    deleteAccount,
    updateAccountStatus 
  } = adminStore

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [statusForm, setStatusForm] = useState({
    status: 'free',
    hours: 1
  })
  const [statusLoading, setStatusLoading] = useState(false)

  let filteredAccounts = []

  useEffect(() => {
    fetchAccounts()
  }, [fetchAccounts])

  if (accounts) {
      filteredAccounts = accounts.filter(account => {
        const matchesSearch = account.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           account.account_number?.toString().includes(searchTerm)
        const matchesStatus = statusFilter === 'all' || account.status === statusFilter
        return matchesSearch && matchesStatus
    })
  }

  const handleEdit = (accountId) => {
    window.location.href = generatePath.editAccount(accountId)
  }

  const handleDelete = async (accountId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот аккаунт?')) {
      try {
        await deleteAccount(accountId)
        window.location.reload()
      } catch (error) {
        alert('Ошибка при удалении аккаунта')
      }
    }
  }

  const handleView = (accountId) => {
    window.open(`/accounts/${accountId}`, '_blank')
  }

  const handleAddAccount = () => {
    window.location.href = ROUTES.ADMIN_CREATE_ACCOUNT
  }

  const handleChangeStatus = (account) => {
    setSelectedAccount(account)
    setStatusForm({
      status: account.status,
      hours: 1
    })
    setShowStatusModal(true)
  }

  const handleSaveStatus = async () => {
    if (!selectedAccount) return

    setStatusLoading(true)
    try {
      await updateAccountStatus(
        selectedAccount.id, 
        statusForm.status, 
        statusForm.status === 'rented' ? statusForm.hours : null
      )
      setShowStatusModal(false)
      fetchAccounts()

    } catch (error) {
      alert('Ошибка при обновлении статуса')
    } finally {
      setStatusLoading(false)
    }
  }

  const getFeatures = (characters) => {
    if (!characters) return []
    try {
      const chars = typeof characters === 'string' ? JSON.parse(characters) : characters
      return Object.entries(chars)
        .filter(([key, value]) => value === true)
        .map(([key]) => key)
    } catch {
      return []
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={styles.accountManagement}
    >
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Управление аккаунтами</h1>
          <p className={styles.subtitle}>Создание и редактирование игровых аккаунтов</p>
        </div>
        <Button variant="primary" onClick={handleAddAccount}>
          <Plus size={16} />
          Добавить аккаунт
        </Button>
      </div>

      <div className={styles.controls}>
        <div className={styles.search}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Поиск аккаунтов..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className={styles.filters}>
          <select 
            className={styles.filterSelect}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Все статусы</option>
            <option value="free">Свободен</option>
            <option value="rented">Арендован</option>
            <option value="unavailable">Недоступен</option>
          </select>
        </div>
      </div>

      <div className={styles.tableContainer}>
        {loading ? (
          <div className={styles.loading}>Загрузка...</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Название</th>
                <th>Номер</th>
                <th>Статус</th>
                <th>Цена/час</th>
                <th>Особенности</th>
                <th>Действия</th>
              </tr>
            </thead>

            <tbody>
              {filteredAccounts.map((account, index) => {
                const features = getFeatures(account.characters)
                const basePrice = account.price
                
                return (
                <motion.tr
                  key={account.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={styles.tableRow}
                >
                  <td className={styles.accountId}>#{account.id}</td>
                  <td>
                    <div className={styles.accountInfo}>
                      <img src={import.meta.env.VITE_API_URL + '/img/' + account.img} alt={account.title} className={styles.accountImage} />
                      <span>{account.title}</span>
                    </div>
                  </td>
                  <td>{account.account_number}</td>
                  <td>
                    <div className={styles.statusCell}>
                      <StatusBadge status={account.status} account={account} />
                      <button
                        onClick={() => handleChangeStatus(account)}
                        className={styles.statusChangeBtn}
                        title="Изменить статус"
                      >
                        <RefreshCw size={14} />
                      </button>
                    </div>
                  </td>
                  <td>{formatCurrency(basePrice)}</td>
                  <td>
                    <div className={styles.features}>
                      {features.map((feature, idx) => (
                        <span key={idx} className={styles.feature}>
                          {feature}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        onClick={() => handleView(account.id)}
                        className={styles.actionBtn}
                        title="Просмотр"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleEdit(account.id)}
                        className={styles.actionBtn}
                        title="Редактировать"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(account.id)}
                        className={`${styles.actionBtn} ${styles.delete}`}
                        title="Удалить"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              )})}
            </tbody>
          </table>
        )}
      </div>


      <div className={styles.mobileAccounts}>
        {filteredAccounts.map((account, index) => {
          const features = getFeatures(account.characters)
          const basePrice = account.price
          
          return (
            <motion.div
              key={account.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={styles.mobileAccountCard}
            >
              <div className={styles.mobileAccountHeader}>
                <div className={styles.mobileAccountId}>#{account.id}</div>
                <StatusBadge status={account.status} account={account} />
              </div>
              
              <div className={styles.mobileAccountMain}>
                <img 
                  src={import.meta.env.VITE_API_URL + '/img/' + account.img} 
                  alt={account.title}
                  className={styles.mobileAccountImage}
                />
                <div className={styles.mobileAccountDetails}>
                  <h3 className={styles.mobileAccountTitle}>{account.title}</h3>
                  <p className={styles.mobileAccountNumber}>Номер: {account.account_number}</p>
                </div>
              </div>
              
              <div className={styles.mobileAccountInfo}>
                <div className={styles.mobileInfoRow}>
                  <span className={styles.mobileInfoLabel}>Статус:</span>
                  <div className={styles.mobileStatusCell}>
                    <StatusBadge status={account.status} account={account} />
                    <button
                      onClick={() => handleChangeStatus(account)}
                      className={styles.statusChangeBtn}
                      title="Изменить статус"
                    >
                      <RefreshCw size={14} />
                    </button>
                  </div>
                </div>
                <div className={styles.mobileInfoRow}>
                  <span className={styles.mobileInfoLabel}>Цена/час:</span>
                  <span className={styles.mobileInfoValue}>{formatCurrency(basePrice)}</span>
                </div>
              </div>
              
              {features.length > 0 && (
                <div className={styles.mobileFeatures}>
                  {features.slice(0, 3).map((feature, idx) => (
                    <span key={idx} className={styles.mobileFeature}>
                      {feature}
                    </span>
                  ))}
                  {features.length > 3 && (
                    <span className={styles.mobileFeature}>
                      +{features.length - 3}
                    </span>
                  )}
                </div>
              )}
              
              <div className={styles.mobileActions}>
                <button
                  onClick={() => handleView(account.id)}
                  className={styles.actionBtn}
                  title="Просмотр"
                >
                  <Eye size={16} />
                  Просмотр
                </button>
                <button
                  onClick={() => handleEdit(account.id)}
                  className={styles.actionBtn}
                  title="Редактировать"
                >
                  <Edit size={16} />
                  Редактировать
                </button>
                <button
                  onClick={() => handleDelete(account.id)}
                  className={`${styles.actionBtn} ${styles.delete}`}
                  title="Удалить"
                >
                  <Trash2 size={16} />
                  Удалить
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>


      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title={`Смена статуса аккаунта #${selectedAccount?.id}`}
        size="medium"
      >
        {selectedAccount && (
          <div className={styles.statusModal}>
            <div className={styles.accountPreview}>
              <img 
                src={import.meta.env.VITE_API_URL + '/img/' + selectedAccount.img} 
                alt={selectedAccount.title}
                className={styles.previewImage}
              />
              <div className={styles.previewInfo}>
                <h4 className={styles.previewTitle}>{selectedAccount.title}</h4>
                <p className={styles.previewNumber}>Номер: {selectedAccount.account_number}</p>
                <p className={styles.previewNumber}>Цена: {formatCurrency(selectedAccount.price)}/час</p>
              </div>
            </div>

            <div className={styles.statusForm}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Новый статус</label>
                <select
                  className={styles.select}
                  value={statusForm.status}
                  onChange={(e) => setStatusForm(prev => ({ 
                    ...prev, 
                    status: e.target.value,
                    hours: e.target.value === 'rented' ? prev.hours : 1
                  }))}
                >
                  <option value="free">Свободен</option>
                  <option value="rented">Арендован</option>
                  <option value="unavailable">Недоступен</option>
                </select>
              </div>

              {statusForm.status === 'rented' && (
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    <Clock size={16} />
                    Период аренды (часы)
                  </label>
                  <input
                    type="number"
                    className={styles.input}
                    value={statusForm.hours}
                    onChange={(e) => setStatusForm(prev => ({ 
                      ...prev, 
                      hours: e.target.value
                    }))}
                    min="1"
                    max="720" // 30 дней
                    placeholder="Введите количество часов"
                  />
                  <div className={styles.hoursHint}>
                    Будет установлено: ~{Math.round(statusForm.hours * selectedAccount.price)} ₽
                  </div>
                </div>
              )}

              <div className={styles.statusInfo}>
                {statusForm.status === 'free' && (
                  <div className={styles.infoFree}>
                    <strong>Свободен:</strong> Аккаунт доступен для аренды пользователями
                  </div>
                )}
                {statusForm.status === 'rented' && (
                  <div className={styles.infoRented}>
                    <strong>Арендован:</strong> Аккаунт будет помечен как занятый на {statusForm.hours} часов
                  </div>
                )}
                {statusForm.status === 'unavailable' && (
                  <div className={styles.infoUnavailable}>
                    <strong>Недоступен:</strong> Аккаунт скрыт из поиска и недоступен для аренды
                  </div>
                )}
              </div>
            </div>

            <div className={styles.modalActions}>
              <Button
                variant="secondary"
                onClick={() => setShowStatusModal(false)}
                disabled={statusLoading}
              >
                Отмена
              </Button>
              <Button
                variant="primary"
                onClick={handleSaveStatus}
                loading={statusLoading}
                disabled={statusLoading}
              >
                <RefreshCw size={16} />
                Обновить статус
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {filteredAccounts.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.emptyState}
        >
          <div className={styles.emptyContent}>
            <span className={styles.emptyIcon}>🎮</span>
            <h3 className={styles.emptyTitle}>
              {searchTerm || statusFilter !== 'all' ? 'Аккаунты не найдены' : 'Аккаунтов пока нет'}
            </h3>
            <p className={styles.emptyText}>
              {searchTerm || statusFilter !== 'all' 
                ? 'Попробуйте изменить параметры поиска' 
                : 'Добавьте первый игровой аккаунт для аренды'
              }
            </p>
            <Button variant="primary" onClick={handleAddAccount}>
              <Plus size={16} />
              Добавить аккаунт
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
})

export default AccountManagement