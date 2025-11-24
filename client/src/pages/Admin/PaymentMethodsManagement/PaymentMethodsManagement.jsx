import { motion } from 'framer-motion'
import { Plus, Search, Edit, Trash2, Eye, ToggleLeft, ToggleRight, CreditCard } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { adminStore } from '../../../stores/adminStore'
import Button from '../../../components/ui/Button/Button'
import Modal from '../../../components/ui/Modal/Modal'
import Input from '../../../components/ui/Input/Input'
import styles from './PaymentMethodsManagement.module.css'

const PaymentMethodsManagement = observer(() => {
  const { 
    paymentMethods, 
    loading, 
    getAllPaymentMethods, 
    createPaymentMethod, 
    changePaymentMethods, 
    deletePaymentMethods 
  } = adminStore

  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    details: '',
    type: ''
  })
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    getAllPaymentMethods()
  }, [getAllPaymentMethods])

  const filteredMethods = paymentMethods.filter(method =>
    method.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    method.details?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      alert('Введите название метода оплаты')
      return
    }

    setFormLoading(true)
    try {
      await createPaymentMethod(formData.name, formData.details, formData.type)
      setShowCreateModal(false)
      setFormData({ name: '', details: '', type: 'bank_transfer'})
      getAllPaymentMethods()
    } catch (error) {
      alert('Ошибка при создании метода оплаты')
    } finally {
      setFormLoading(false)
    }
  }

  const handleEdit = (method) => {
    setSelectedMethod(method)
    setFormData({
      name: method.name,
      details: method.details,
      type: method.type
    })
    setShowEditModal(true)
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      alert('Введите название метода оплаты')
      return
    }

    setFormLoading(true)
    try {
      await changePaymentMethods(
        selectedMethod.id,
        formData.name,
        formData.details,
        formData.type,
        selectedMethod.isActive
      )
      setShowEditModal(false)
      setSelectedMethod(null)
      setFormData({ name: '', details: '', type: 'bank_transfer'})
      getAllPaymentMethods()
    } catch (error) {
      alert('Ошибка при обновлении метода оплаты')
    } finally {
      setFormLoading(false)
    }
  }

  const handleDelete = async (methodId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот метод оплаты?')) {
      try {
        await deletePaymentMethods(methodId)
        getAllPaymentMethods()
      } catch (error) {
        alert('Ошибка при удалении метода оплаты')
      }
    }
  }

  const handleToggleActive = async (method) => {
    try {
      await changePaymentMethods(
        method.id,
        method.name,
        method.details,
        method.type,
        !method.isActive
      )
      getAllPaymentMethods()
    } catch (error) {
      console.error(error)
      alert('Ошибка при изменении статуса метода оплаты')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={styles.paymentMethodsManagement}
    >
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Управление методами оплаты</h1>
          <p className={styles.subtitle}>Добавление и редактирование способов оплаты</p>
        </div>
        <Button variant="primary" onClick={() => {setShowCreateModal(true) 
          setFormData({ name: '', details: '', type: 'bank_transfer'})}}>
          <Plus size={16} />
          Добавить метод
        </Button>
      </div>

      <div className={styles.controls}>
        <div className={styles.search}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Поиск методов оплаты..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.tableContainer}>
        {loading ? (
          <div className={styles.loading}>Загрузка методов оплаты...</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Название</th>
                <th>Детали</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredMethods.map((method, index) => (
                <motion.tr
                  key={method.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={styles.tableRow}
                >
                  <td>
                    <div className={styles.methodInfo}>
                      <div className={styles.methodIcon}>
                        <CreditCard size={20} />
                      </div>
                      <span className={styles.methodName}>{method.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className={styles.methodDetails}>
                      {method.details || '—'}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleToggleActive(method)}
                      className={`${styles.statusToggle} ${
                        method.isActive ? styles.active : styles.inactive
                      }`}
                      title={method.isActive ? 'Деактивировать' : 'Активировать'}
                    >
                      {method.isActive ? (
                        <ToggleRight size={20} />
                      ) : (
                        <ToggleLeft size={20} />
                      )}
                      <span>{method.isActive ? 'Активен' : 'Неактивен'}</span>
                    </button>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        onClick={() => handleEdit(method)}
                        className={styles.actionBtn}
                        title="Редактировать"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(method.id)}
                        className={`${styles.actionBtn} ${styles.delete}`}
                        title="Удалить"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className={styles.mobileMethods}>
        {filteredMethods.map((method, index) => (
          <motion.div
            key={method.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={styles.mobileMethodCard}
          >
            <div className={styles.mobileMethodHeader}>
              <div className={styles.mobileMethodInfo}>
                <div className={styles.mobileMethodIcon}>
                  <CreditCard size={20} />
                </div>
                <div className={styles.mobileMethodDetails}>
                  <h3 className={styles.mobileMethodName}>{method.name}</h3>
                  <p className={styles.mobileMethodType}>{method.type}</p>
                </div>
              </div>
              <button
                onClick={() => handleToggleActive(method)}
                className={`${styles.statusToggle} ${
                  method.isActive ? styles.active : styles.inactive
                }`}
                title={method.isActive ? 'Деактивировать' : 'Активировать'}
              >
                {method.isActive ? (
                  <ToggleRight size={20} />
                ) : (
                  <ToggleLeft size={20} />
                )}
                <span>{method.isActive ? 'Активен' : 'Неактивен'}</span>
              </button>
            </div>

            {method.details && (
              <div className={styles.mobileMethodDescription}>
                {method.details}
              </div>
            )}

            <div className={styles.mobileActions}>
              <button
                onClick={() => handleEdit(method)}
                className={styles.actionBtn}
                title="Редактировать"
              >
                <Edit size={16} />
                Редактировать
              </button>
              <button
                onClick={() => handleDelete(method.id)}
                className={`${styles.actionBtn} ${styles.delete}`}
                title="Удалить"
              >
                <Trash2 size={16} />
                Удалить
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Добавление метода оплаты"
        size="medium"
      >
        <form onSubmit={handleCreate} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Название метода *</label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Например: Банковская карта, Криптовалюта..."
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Детали и инструкции</label>
            <Input
            as="textarea"
            value={formData.details}
            onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
            placeholder="Реквизиты, инструкции по оплате, комиссии..."
            rows={4}
            />
          </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Тип</label>
              <select
                className={styles.select}
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              >
                <option value="bank_transfer">Банк</option>
                <option value="crypto">Криптовалюта</option>
              </select>
            </div>

          <div className={styles.modalActions}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowCreateModal(false)}
              disabled={formLoading}
            >
              Отмена
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={formLoading}
              disabled={formLoading}
            >
              <Plus size={16} />
              Создать метод
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={`Редактирование: ${selectedMethod?.name}`}
        size="medium"
      >
        {selectedMethod && (
          <form onSubmit={handleUpdate} className={styles.modalForm}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Название метода *</label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Например: Банковская карта, Криптовалюта..."
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Детали и инструкции</label>
                <Input
                as="textarea"
                value={formData.details}
                onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
                placeholder="Реквизиты, инструкции по оплате, комиссии..."
                rows={4}
                />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Тип</label>
              <select
                className={styles.select}
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              >
                <option value="bank_transfer">Банк</option>
                <option value="crypto">Криптовалюта</option>
              </select>
            </div>

            <div className={styles.modalActions}>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setShowEditModal(false)}
                disabled={formLoading}
              >
                Отмена
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={formLoading}
                disabled={formLoading}
              >
                <Edit size={16} />
                Обновить метод
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {filteredMethods.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.emptyState}
        >
          <div className={styles.emptyContent}>
            <h3 className={styles.emptyTitle}>
              {searchTerm ? 'Методы оплаты не найдены' : 'Методов оплаты пока нет'}
            </h3>
            <p className={styles.emptyText}>
              {searchTerm 
                ? 'Попробуйте изменить параметры поиска' 
                : 'Добавьте первый метод оплаты для использования в системе'
              }
            </p>
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
              <Plus size={16} />
              Добавить метод оплаты
            </Button>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
})

export default PaymentMethodsManagement