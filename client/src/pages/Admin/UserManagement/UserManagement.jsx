import { motion } from 'framer-motion'
import { Search, Filter, Mail, Edit, Shield, Ban, RefreshCw } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { adminStore } from '../../../stores/adminStore'
import { formatCurrency } from '../../../utils/formatters'
import { formatToMoscowTime } from '../../../utils/dateUtils'
import styles from './UserManagement.module.css'

const UserManagement = observer(() => {
  const { 
    users, 
    loading, 
    fetchUsers, 
    updateUserRole, 
    updateUserStatus 
  } = adminStore

  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.id?.toString().includes(searchTerm)
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const handleRoleChange = async (userId, newRole) => {
    if (window.confirm(`Вы уверены, что хотите изменить роль пользователя на "${getRoleText(newRole)}"?`)) {
      try {
        await updateUserRole(userId, newRole)
      } catch (error) {
        alert('Пока недоступно')
      }
    }
  }

  const handleStatusChange = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'unblocked' ? 'blocked' : 'unblocked'
    const action = newStatus === 'blocked' ? 'заблокировать' : 'разблокировать'
    
    if (window.confirm(`Вы уверены, что хотите ${action} пользователя?`)) {
      try {
        await updateUserStatus(userId, newStatus)
        window.location.reload()
      } catch (error) {
        alert(`Ошибка при ${action} пользователя`)
      }
    }
  }

  const getRoleColor = (role) => {
    const colors = {
      admin: 'error',
      user: 'secondary'
    }
    return colors[role] || 'secondary'
  }

  const getRoleText = (role) => {
    const texts = {
      admin: 'Администратор',
      user: 'Пользователь'
    }
    return texts[role] || role
  }

  const getStatusColor = (status) => {
    return status === 'unblocked' ? 'success' : 'error'
  }

  const getStatusText = (status) => {
    return status === 'unblocked' ? 'Разблокирован' : 'Заблокирован'
  }

  const userStats = {
    total: users.length,
    blocked: users.filter(u => u.status === 'blocked').length,
    admins: users.filter(u => u.role === 'admin').length
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={styles.userManagement}
    >
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Управление пользователями</h1>
          <p className={styles.subtitle}>Просмотр и управление пользователями системы</p>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{userStats.total}</div>
          <div className={styles.statLabel}>Всего пользователей</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{userStats.blocked}</div>
          <div className={styles.statLabel}>Заблокированных</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{userStats.admins}</div>
          <div className={styles.statLabel}>Администраторов</div>
        </div>
      </div>

      <div className={styles.controls}>
        <div className={styles.search}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Поиск по email, имени или ID..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className={styles.filters}>
          <select 
            className={styles.filterSelect}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">Все роли</option>
            <option value="user">Пользователь</option>
            <option value="admin">Администратор</option>
          </select>
          
          <select 
            className={styles.filterSelect}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Все статусы</option>
            <option value="unblocked">Разблокированные</option>
            <option value="blocked">Заблокированные</option>
          </select>
        </div>
      </div>

      <div className={styles.tableContainer}>
        {loading ? (
          <div className={styles.loading}>Загрузка пользователей...</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Пользователь</th>
                <th>Контакты</th>
                <th>Роль</th>
                <th>Статус</th>
                <th>Баланс</th>
                <th>Заказы</th>
                <th>Дата регистрации</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={styles.tableRow}
                >
                  <td>
                    <div className={styles.userInfo}>
                      <div className={styles.avatar}>
                        {user.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <div className={styles.username}>{user.userName || 'Без имени'}</div>
                        <div className={styles.userId}>ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={styles.contacts}>
                      <div className={styles.contact}>
                        <Mail size={14} />
                        <span>{user.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <select
                      className={`${styles.roleSelect} ${styles[getRoleColor(user.role)]}`}
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    >
                      <option value="user">Пользователь</option>
                      <option value="admin">Администратор</option>
                    </select>
                  </td>
                  <td>
                    <span className={`${styles.status} ${styles[getStatusColor(user.status)]}`}>
                      {getStatusText(user.status)}
                    </span>
                  </td>
                  <td className={styles.balance}>{formatCurrency(user.balance || 0)}</td>
                  <td className={styles.orders}>{user.ordersCount || 0}</td>
                  <td className={styles.date}>{formatToMoscowTime(user.createdAt)}</td>
                  <td>
                    <div className={styles.actions}>
                      <button 
                        className={`${styles.actionBtn} ${user.status === 'blocked' ? styles.unban : styles.ban}`}
                        title={user.status === 'unblocked' ? 'Заблокировать' : 'Разблокировать'}
                        onClick={() => handleStatusChange(user.id, user.status)}
                      >
                        <Ban size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>


      <div className={styles.mobileUsers}>
        {filteredUsers.map((user, index) => (
          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={styles.mobileUserCard}
          >
            <div className={styles.mobileUserHeader}>
              <div className={styles.mobileUserInfo}>
                <div className={styles.mobileAvatar}>
                  {user.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className={styles.mobileUserDetails}>
                  <h3 className={styles.mobileUsername}>{user.userName || 'Без имени'}</h3>
                  <p className={styles.mobileUserId}>ID: {user.id}</p>
                </div>
              </div>
              <span className={`${styles.mobileStatus} ${styles[getStatusColor(user.status)]}`}>
                {getStatusText(user.status)}
              </span>
            </div>

            <div className={styles.mobileContacts}>
              <div className={styles.mobileContact}>
                <Mail size={14} />
                <span>{user.email}</span>
              </div>
            </div>

            <div className={styles.mobileUserContent}>
              <div className={styles.mobileInfoRow}>
                <span className={styles.mobileInfoLabel}>Роль:</span>
                <select
                  className={`${styles.mobileRoleSelect} ${styles[getRoleColor(user.role)]}`}
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                >
                  <option value="user">Пользователь</option>
                  <option value="admin">Администратор</option>
                </select>
              </div>
              <div className={styles.mobileInfoRow}>
                <span className={styles.mobileInfoLabel}>Баланс:</span>
                <span className={styles.mobileInfoValue}>{formatCurrency(user.balance || 0)}</span>
              </div>
              <div className={styles.mobileInfoRow}>
                <span className={styles.mobileInfoLabel}>Заказы:</span>
                <span className={styles.mobileInfoValue}>{user.ordersCount || 0}</span>
              </div>
              <div className={styles.mobileInfoRow}>
                <span className={styles.mobileInfoLabel}>Регистрация:</span>
                <span className={styles.mobileInfoValue}>{formatToMoscowTime(user.createdAt)}</span>
              </div>
            </div>

            <div className={styles.mobileActions}>
              <button 
                className={`${styles.actionBtn} ${user.status === 'blocked' ? styles.unban : styles.ban}`}
                title={user.status === 'unblocked' ? 'Заблокировать' : 'Разблокировать'}
                onClick={() => handleStatusChange(user.id, user.status)}
              >
                <Ban size={16} />
                {user.status === 'unblocked' ? 'Заблокировать' : 'Разблокировать'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredUsers.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.emptyState}
        >
          <div className={styles.emptyContent}>
            <h3 className={styles.emptyTitle}>
              {searchTerm || roleFilter !== 'all' || statusFilter !== 'all' 
                ? 'Пользователи не найдены' 
                : 'Пользователей пока нет'
              }
            </h3>
            <p className={styles.emptyText}>
              {searchTerm || roleFilter !== 'all' || statusFilter !== 'all'
                ? 'Попробуйте изменить параметры поиска' 
                : 'Зарегистрированные пользователи появятся здесь'
              }
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
})

export default UserManagement