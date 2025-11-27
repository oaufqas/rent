import { randomUUID } from 'crypto'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import fsSync from 'fs'
import ApiError from '../apiErrors/api-error.js'

class UploadService {
    constructor() {
        this.__dirname = path.dirname(fileURLToPath(import.meta.url));
        this.uploadDirImg = path.resolve(this.__dirname, '..', '..', 'uploads', 'img');
        this.uploadDirCheck = path.resolve(this.__dirname, '..', '..', 'uploads', 'checks');
        this.uploadDirVideo = path.resolve(this.__dirname, '..', '..', 'uploads', 'video');
        
        // Лимиты файлов
        this.MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
        this.MAX_VIDEO_SIZE = 200 * 1024 * 1024; // 200MB
        this.MAX_CHECK_SIZE = 5 * 1024 * 1024; // 5MB
        
        // Разрешенные MIME types
        this.ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        this.ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
        this.ALLOWED_CHECK_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
        
        this.init()
    }

    async init() {
        try {
            await fs.access(this.uploadDirImg);
        } catch {
            await fs.mkdir(this.uploadDirImg, { recursive: true });
        }
        try {
            await fs.access(this.uploadDirVideo);
        } catch {
            await fs.mkdir(this.uploadDirVideo, { recursive: true });
        }
        try {
            await fs.access(this.uploadDirCheck);
        } catch {
            await fs.mkdir(this.uploadDirCheck, { recursive: true });
        }
    }

    // Безопасная валидация файла
    validateFile(file, allowedTypes, maxSize) {
        // Проверка размера
        if (file.size > maxSize) {
            throw ApiError.BadRequest(`Размер файла превышает ${maxSize / (1024 * 1024)}MB`);
        }

        // Проверка MIME type
        if (!allowedTypes.includes(file.mimetype)) {
            throw ApiError.BadRequest('Недопустимый тип файла');
        }

        // Дополнительная проверка расширения (опционально)
        const fileExtension = path.extname(file.name).toLowerCase();
        const validExtensions = {
            'image/jpeg': '.jpg',
            'image/jpg': '.jpg', 
            'image/png': '.png',
            'image/webp': '.webp',
            'video/mp4': '.mp4',
            'video/webm': '.webm',
            'video/quicktime': '.mov',
            'application/pdf': '.pdf'
        };

        if (validExtensions[file.mimetype] !== fileExtension) {
            throw ApiError.BadRequest('Несоответствие MIME type и расширения файла');
        }

        return true;
    }

    // Безопасное создание имени файла
    createSafeFileName(originalName, prefix = '') {
        const fileExtension = path.extname(originalName).toLowerCase();
        const baseName = randomUUID();
        
        // Очистка префикса от опасных символов
        const safePrefix = prefix.replace(/[^a-zA-Z0-9_-]/g, '');
        
        return safePrefix ? `${safePrefix}_${baseName}${fileExtension}` : `${baseName}${fileExtension}`;
    }

    async uploadImg(img) {
        try {
            // Валидация
            this.validateFile(img, this.ALLOWED_IMAGE_TYPES, this.MAX_IMAGE_SIZE);
            
            // Безопасное имя файла
            const imgFileName = this.createSafeFileName(img.name);
            const uploadPath = path.resolve(this.uploadDirImg, imgFileName);
            
            await img.mv(uploadPath);
            return imgFileName;
            
        } catch(e) {
            if (e instanceof ApiError) throw e;
            throw ApiError.ElseError('Ошибка загрузки изображения');
        }
    }
    
    async uploadVideo(video) {
        try {
            // Валидация
            this.validateFile(video, this.ALLOWED_VIDEO_TYPES, this.MAX_VIDEO_SIZE);
            
            const videoFileName = this.createSafeFileName(video.name);
            const uploadPath = path.resolve(this.uploadDirVideo, videoFileName);
            
            await video.mv(uploadPath);
            return videoFileName;
            
        } catch (e) {
            if (e instanceof ApiError) throw e;
            throw ApiError.ElseError('Ошибка загрузки видео');
        }
    }
    
    async deleteFile(fileName, type) {
        try {
            // Валидация имени файла
            if (!fileName || fileName.includes('..') || fileName.includes('/')) {
                throw ApiError.BadRequest('Некорректное имя файла');
            }
            
            let filePath;
            if (type === 'img') {
                filePath = path.resolve(this.uploadDirImg, fileName);
            } else if (type === 'video') {
                filePath = path.resolve(this.uploadDirVideo, fileName);
            } else {
                throw ApiError.BadRequest('Неизвестный тип файла');
            }
            
            // Проверка что файл существует и принадлежит нужной директории
            const realPath = await fs.realpath(filePath);
            const expectedDir = type === 'img' ? this.uploadDirImg : this.uploadDirVideo;
            
            if (!realPath.startsWith(expectedDir)) {
                throw ApiError.BadRequest('Некорректный путь к файлу');
            }
            
            await fs.unlink(filePath);
            return true;
            
        } catch (e) {
            if (e.code === 'ENOENT') {
                return true; // Файл уже удален
            }
            if (e instanceof ApiError) throw e;
            throw ApiError.ElseError('Ошибка удаления файла');
        }
    }

    async uploadCheck(checkFile, userId) {
        try {
            // Валидация
            this.validateFile(checkFile, this.ALLOWED_CHECK_TYPES, this.MAX_CHECK_SIZE);
            
            // Безопасное имя с userId
            const safeUserId = userId.toString().replace(/[^a-zA-Z0-9_-]/g, '');
            const checkFileName = this.createSafeFileName(checkFile.name, `check_${safeUserId}`);
            const uploadPath = path.resolve(this.uploadDirCheck, checkFileName);
            
            await checkFile.mv(uploadPath);
            return checkFileName;
            
        } catch(e) {
            if (e instanceof ApiError) throw e;
            throw ApiError.ElseError('Ошибка загрузки чека');
        }
    }

    async getCheck(filename) {
        try {
            if (!filename || filename.includes('..') || filename.includes('/')) {
                throw ApiError.BadRequest('Некорректное имя файла');
            }
            
            const filePath = path.resolve(this.uploadDirCheck, filename);
            
            const realPath = await fs.realpath(filePath);
            if (!realPath.startsWith(this.uploadDirCheck)) {
                throw ApiError.BadRequest('Некорректный путь к файлу');
            }
            
            if (fsSync.existsSync(filePath)) {
                return { filePath, filename };
            } else {
                throw ApiError.NotFound('Файл не найден');
            }
        } catch (e) {
            if (e instanceof ApiError) throw e;
            throw ApiError.ElseError('Ошибка получения файла');
        }
    }
}

export default new UploadService();