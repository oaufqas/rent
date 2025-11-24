import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Upload, X, File } from 'lucide-react'
import styles from './FileUpload.module.css'

const FileUpload = ({ 
  label, 
  accept = "image/*,.pdf,.doc,.docx", 
  onFileChange, 
  required = false,
  maxSize = 5 * 1024 * 1024, // 5MB
  multiple = false 
}) => {
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const handleFileSelect = (selectedFile) => {
    setError('')

    // Проверка размера файла
    if (selectedFile.size > maxSize) {
      setError(`Файл слишком большой. Максимальный размер: ${maxSize / 1024 / 1024}MB`)
      return
    }

    // Проверка типа файла
    const fileExtension = selectedFile.name.split('.').pop().toLowerCase()
    const acceptedTypes = accept.split(',').map(type => type.trim())
    
    if (!acceptedTypes.some(type => {
      if (type.includes('/*')) {
        const category = type.split('/')[0]
        return selectedFile.type.startsWith(category)
      }
      return selectedFile.type === type || `.${fileExtension}` === type
    })) {
      setError('Неподдерживаемый формат файла')
      return
    }

    setFile(selectedFile)
    onFileChange?.(selectedFile)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFileSelect(droppedFile)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleInputChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      handleFileSelect(selectedFile)
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    setError('')
    onFileChange?.(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleAreaClick = () => {
    fileInputRef.current?.click()
  }

  const getFileIcon = () => {
    if (!file) return <Upload size={24} />
    
    if (file.type.startsWith('image/')) {
      return (
        <div className={styles.preview}>
          <img 
            src={URL.createObjectURL(file)} 
            alt="Preview" 
            className={styles.imagePreview}
          />
        </div>
      )
    }
    
    return <File size={24} />
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={styles.fileUpload}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className={styles.hiddenInput}
        multiple={multiple}
      />

      {!file ? (
        <motion.div
          className={styles.uploadArea}
          onClick={handleAreaClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className={styles.uploadContent}>
            <Upload size={32} className={styles.uploadIcon} />
            <div className={styles.uploadText}>
              <p className={styles.uploadTitle}>Нажмите для загрузки файла</p>
              <p className={styles.uploadSubtitle}>
                или перетащите его сюда
              </p>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={styles.fileInfo}
        >
          <div className={styles.fileContent}>
            {getFileIcon()}
            <div className={styles.fileDetails}>
              <p className={styles.fileName}>{file.name}</p>
              <p className={styles.fileSize}>{formatFileSize(file.size)}</p>
            </div>
            <button
              type="button"
              onClick={handleRemoveFile}
              className={styles.removeButton}
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.error}
        >
          {error}
        </motion.p>
      )}

      <p className={styles.hint}>
        Поддерживаемые форматы: {accept.replace(/\*/g, '')}
        <br />
        Максимальный размер: {maxSize / 1024 / 1024}MB
      </p>
    </div>
  )
}

export default FileUpload