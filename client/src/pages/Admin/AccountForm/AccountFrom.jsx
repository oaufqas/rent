import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Save, ArrowLeft, Plus, Trash2, Video, Image } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { adminStore } from '../../../stores/adminStore'
import { accountStore } from '../../../stores/accountStore'
import Button from '../../../components/ui/Button/Button'
import { ROUTES } from '../../../utils/constants'
import styles from './AccountForm.module.css'

const AccountForm = observer(() => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  
  const { 
    loading, 
    createAccount, 
    updateAccount 
  } = adminStore

  const {account, fetchAccount} = accountStore

  const [formData, setFormData] = useState({
    title: '',
    account_number: '',
    price: '',
    characters: {},
    status: 'free',
    description: ''
  })

  const availableFeatures = [
    { key: 'bape', label: 'Bape' },
    { key: 'crewUniform', label: 'Crew Uniform' },
    { key: 'more300mif', label: 'More 300 MIF' }
  ]

  const [selectedFeatures, setSelectedFeatures] = useState([])
  const [imageFile, setImageFile] = useState(null)
  const [videoFile, setVideoFile] = useState(null)
  const [existingImage, setExistingImage] = useState('')
  const [existingVideo, setExistingVideo] = useState('')

  useEffect(() => {
    if (isEdit && id) {
      fetchAccount(id)
    }
  }, [isEdit, id, fetchAccount])

  useEffect(() => {
    if (isEdit && account) {
      let charactersObj = {};
      if (account.characters) {
        if (typeof account.characters === 'string') {
          try {
            charactersObj = JSON.parse(account.characters);
          } catch (e) {
            console.error('Error parsing characters:', e);
            charactersObj = {};
          }
        } else {
          charactersObj = account.characters;
        }
      }

      setFormData({
        title: account.title || '',
        account_number: account.account_number || '',
        price: account.price || '',
        characters: charactersObj,
        status: account.status || 'free',
        description: account.description || ''
      })

      if (account.img) {
        setExistingImage(account.img)
      }
      if (account.video) {
        setExistingVideo(account.video)
      }

      if (account.characters) {
        const charactersObj = typeof account.characters === 'string' 
          ? JSON.parse(account.characters) 
          : account.characters;

        const selected = Object.keys(charactersObj).filter(key => charactersObj[key] === true);
        setSelectedFeatures(selected);
      }
    }
  }, [account, isEdit])

  const validateImageFile = (file) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    
    if (file.size > maxSize) {
      alert(`Размер изображения не должен превышать 10MB. Ваш файл: ${(file.size / (1024 * 1024)).toFixed(1)}MB`);
      return false;
    }
    
    if (!allowedTypes.includes(file.type)) {
      alert('Разрешены только изображения: JPG, PNG, WEBP');
      return false;
    }
    
    return true;
  }

  const validateVideoFile = (file) => {
    const maxSize = 200 * 1024 * 1024; // 200MB
    const allowedTypes = [
      'video/mp4', 
      'video/avi', 
      'video/mov', 
      'video/wmv',
      'video/webm',
      'video/quicktime'
    ];
    
    if (file.size > maxSize) {
      alert(`Размер видео не должен превышать 200MB. Ваш файл: ${(file.size / (1024 * 1024)).toFixed(1)}MB`);
      return false;
    }
    
    if (!allowedTypes.includes(file.type)) {
      alert('Разрешены только видео файлы: MP4, AVI, MOV, WMV, WEBM');
      return false;
    }
    
    return true;
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!validateImageFile(file)) {
      e.target.value = '';
      return;
    }
    
    setImageFile(file);
    setExistingImage('');
  }

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!validateVideoFile(file)) {
      e.target.value = '';
      return;
    }
    
    setVideoFile(file);
    setExistingVideo('');
  }

  const removeImage = () => {
    setImageFile(null);
    setExistingImage('');
  }

  const removeVideo = () => {
    setVideoFile(null);
    setExistingVideo('');
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFeatureToggle = (featureKey) => {
    const newSelectedFeatures = selectedFeatures.includes(featureKey)
      ? selectedFeatures.filter(f => f !== featureKey)
      : [...selectedFeatures, featureKey]

    setSelectedFeatures(newSelectedFeatures)

    const characters = {}
    newSelectedFeatures.forEach(feature => {
      characters[feature] = true
    })

    setFormData(prev => ({
      ...prev,
      characters
    }))
  }

  const handleFeatureSelect = (e) => {
    const featureKey = e.target.value
    if (featureKey && !selectedFeatures.includes(featureKey)) {
      handleFeatureToggle(featureKey)
    }
    e.target.value = ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      alert('Введите название аккаунта')
      return
    }
    
    if (!formData.account_number) {
      alert('Введите номер аккаунта')
      return
    }
    
    if (formData.price <= 0) {
      alert('Введите корректную цену')
      return
    }

    try {
      const accountData = new FormData()
      
      accountData.append('title', formData.title)
      accountData.append('account_number', formData.account_number)
      accountData.append('description', formData.description || '')
      accountData.append('characters', JSON.stringify(formData.characters))
      accountData.append('price', formData.price)
      accountData.append('status', formData.status)

      if (isEdit) {
        if (imageFile) {
          accountData.append('img', imageFile)
        } else if (!existingImage && !imageFile) {
          accountData.append('removeImg', 'true')
        } else if (existingImage && !imageFile) {
          accountData.append('existingImg', existingImage)
        }

        if (videoFile) {
          accountData.append('video', videoFile)
        } else if (!existingVideo && !videoFile) {
          accountData.append('removeVideo', 'true')
        } else if (existingVideo && !videoFile) {
          accountData.append('existingVideo', existingVideo)
        }
      } else {
        if (imageFile) {
          console.log('img')
          accountData.append('img', imageFile)
        }
        if (videoFile) {
          console.log('video')
          accountData.append('video', videoFile)
        }
      }

      if (isEdit) {
        await updateAccount(id, accountData)
      } else {
        console.log(accountData)
        await createAccount(accountData)
      }
      navigate(ROUTES.ADMIN_ACCOUNTS)
    } catch (error) {
      alert(`Ошибка при ${isEdit ? 'обновлении' : 'создании'} аккаунта`)
      console.error('Error:', error)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={styles.accountForm}
    >
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <button 
            className={styles.backButton}
            onClick={() => navigate(ROUTES.ADMIN_ACCOUNTS)}
          >
            <ArrowLeft size={20} />
            Назад к списку
          </button>
          <h1 className={styles.title}>
            {isEdit ? 'Редактирование аккаунта' : 'Добавление аккаунта'}
          </h1>
          <p className={styles.subtitle}>
            {isEdit ? 'Внесите изменения в данные аккаунта' : 'Заполните информацию о новом аккаунте'}
          </p>
        </div>
        
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={loading}
          className={styles.saveButton}
        >
          <Save size={16} />
          {loading ? 'Сохранение...' : (isEdit ? 'Обновить' : 'Создать')}
        </Button>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          <div className={styles.column}>
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Основная информация</h3>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Название аккаунта *</label>
                <input
                  type="text"
                  className={styles.input}
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Краткое описание аккаунта..."
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Номер аккаунта *</label>
                <input
                  type="text"
                  className={styles.input}
                  value={formData.account_number}
                  onChange={(e) => handleInputChange('account_number', e.target.value)}
                  placeholder="Номер, который будут видеть пользователи..."
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Цена за час (руб) *</label>
                <input
                  type="number"
                  className={styles.input}
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="0"
                  min="0"
                  step="1"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Статус</label>
                <select
                  className={styles.select}
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                >
                  <option value="free">Свободен</option>
                  <option value="rented">Арендован</option>
                  <option value="unavailable">Недоступен</option>
                </select>
              </div>
            </div>

            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Описание</h3>
              <div className={styles.formGroup}>
                <label className={styles.label}>Описание аккаунта</label>
                <textarea
                  className={styles.textarea}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Подробное описание аккаунта, его особенности и преимущества..."
                  rows="4"
                />
              </div>
            </div>
          </div>

          <div className={styles.column}>
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>Медиафайлы</h3>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Изображение аккаунта 
                  <span className={styles.fileHint}> (макс. 10MB, JPG, PNG, WEBP)</span>
                </label>
                <div className={styles.fileUploadSection}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={styles.hiddenInput}
                    id="image-upload"
                  />
                  
                  {!(existingImage || imageFile) ? (
                    <label htmlFor="image-upload" className={styles.uploadButton}>
                      <Image size={20} />
                      <span>Загрузить изображение</span>
                    </label>
                  ) : (
                    <div className={styles.mediaPreview}>
                      {imageFile ? (
                        <>
                          <img 
                            src={URL.createObjectURL(imageFile)} 
                            alt="Preview" 
                            className={styles.previewMedia}
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className={styles.removeMedia}
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      ) : existingImage ? (
                        <>
                          <img 
                            src={`${import.meta.env.VITE_API_URL}/img/${existingImage}`}
                            alt="Current" 
                            className={styles.previewMedia}
                          />
                          <button
                            type="button"
                            onClick={removeImage}
                            className={styles.removeMedia}
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Видео обзор 
                  <span className={styles.fileHint}> (макс. 200MB, MP4, AVI, MOV, WMV)</span>
                </label>
                <div className={styles.fileUploadSection}>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className={styles.hiddenInput}
                    id="video-upload"
                  />
                  
                  {!(existingVideo || videoFile) ? (
                    <label htmlFor="video-upload" className={styles.uploadButton}>
                      <Video size={20} />
                      <span>Загрузить видео</span>
                    </label>
                  ) : (
                    <div className={styles.mediaPreview}>
                      {videoFile ? (
                        <>
                          <video 
                            controls 
                            className={styles.previewMedia}
                          >
                            <source src={URL.createObjectURL(videoFile)} type="video/mp4" />
                          </video>
                          <button
                            type="button"
                            onClick={removeVideo}
                            className={styles.removeMedia}
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      ) : existingVideo ? (
                        <>
                          <video 
                            controls 
                            className={styles.previewMedia}
                          >
                            <source src={`${import.meta.env.VITE_API_URL}/video/${existingVideo}`} type="video/mp4" />
                          </video>
                          <button
                            type="button"
                            onClick={removeVideo}
                            className={styles.removeMedia}
                          >
                            <Trash2 size={16} />
                          </button>
                        </>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Характеристики</h3>
              </div>
              
              <div className={styles.featuresSection}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Добавить характеристику</label>
                  <select
                    className={styles.select}
                    onChange={handleFeatureSelect}
                    value=""
                  >
                    <option value="">Выберите характеристику...</option>
                    {availableFeatures.map(feature => (
                      <option 
                        key={feature.key} 
                        value={feature.key}
                        disabled={selectedFeatures.includes(feature.key)}
                      >
                        {feature.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.selectedFeatures}>
                  {selectedFeatures.map(featureKey => {
                    const feature = availableFeatures.find(f => f.key === featureKey)
                    return (
                      <div key={featureKey} className={styles.featureChip}>
                        <span className={styles.featureLabel}>{feature?.label}</span>
                        <button
                          type="button"
                          className={styles.removeFeature}
                          onClick={() => handleFeatureToggle(featureKey)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )
                  })}
                  
                  {selectedFeatures.length === 0 && (
                    <div className={styles.noFeatures}>
                      Характеристики не выбраны
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  )
})

export default AccountForm