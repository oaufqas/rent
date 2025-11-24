import { motion, AnimatePresence } from 'framer-motion'
import { observer } from 'mobx-react-lite'
import { Filter, X } from 'lucide-react'
import { accountStore } from '../../../stores/accountStore'
import styles from './AccountFilters.module.css'

const AccountFilters = observer(() => {
  const { filters, setFilters, clearFilters } = accountStore
  
  const filterOptions = [
    {
      id: 'bape',
      label: 'Bape',
      description: 'Сеты BAPE',
    },
    {
      id: 'crewUniform', 
      label: 'Crew Uniform',
      description: 'Бригадная униформа',
    },
    {
      id: 'more300mif',
      label: '300+ Mif',
      description: 'Более трехсот мифических предметов',
    }
  ]

  const handleFilterToggle = (filterId) => {
    setFilters({
      [filterId]: !filters[filterId]
    })
  }

  const activeFiltersCount = Object.values(filters).filter(Boolean).length

  return (
    <div className={styles.filtersSection}>
      <div className={styles.header}>
        <div className={styles.title}>
          <Filter className={styles.filterIcon} />
          <span>Фильтры</span>
          {activeFiltersCount > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={styles.counter}
            >
              {activeFiltersCount}
            </motion.span>
          )}
        </div>
        
        {activeFiltersCount > 0 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={clearFilters}
            className={styles.clearBtn}
          >
            <X size={16} />
            Очистить
          </motion.button>
        )}
      </div>

      <div className={styles.filtersGrid}>
        {filterOptions.map((filter) => (
          <FilterButton
            key={filter.id}
            filter={filter}
            isActive={filters[filter.id]}
            onClick={() => handleFilterToggle(filter.id)}
          />
        ))}
      </div>

      <AnimatePresence>
        {activeFiltersCount > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={styles.activeFilters}
          >
            <div className={styles.chips}>
              {filterOptions
                .filter(filter => filters[filter.id])
                .map(filter => (
                  <motion.div
                    key={filter.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className={styles.chip}
                    onClick={() => handleFilterToggle(filter.id)}
                  >
                    <span>{filter.icon} {filter.label}</span>
                    <X size={14} />
                  </motion.div>
                ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
})

const FilterButton = ({ filter, isActive, onClick }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`${styles.filterButton} ${isActive ? styles.active : ''}`}
    >
      <div className={styles.filterContent}>
        <span className={styles.filterIcon}>{filter.icon}</span>
        <div className={styles.filterText}>
          <span className={styles.filterLabel}>{filter.label}</span>
          <span className={styles.filterDescription}>{filter.description}</span>
        </div>
        
        <div className={styles.filterIndicator}>
          {isActive && (
            <motion.div
              layoutId="filterIndicator"
              className={styles.indicatorDot}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
        </div>
      </div>
    </motion.button>
  )
}

export default AccountFilters