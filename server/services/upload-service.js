import { randomUUID } from 'crypto'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import ApiError from '../apiErrors/api-error.js';

class UploadService {
    constructor() {
        this.__dirname = path.dirname(fileURLToPath(import.meta.url));
        this.uploadDirImg = path.resolve(this.__dirname, '..', '..', 'uploads', 'img');
        this.uploadDirCheck = path.resolve(this.__dirname, '..', '..', 'uploads', 'checks');
        this.uploadDirVideo = path.resolve(this.__dirname, '..', '..', 'uploads', 'video');
        this.init()
    }

    async init() {
        try{
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

    validateFileType(file, allowedTypes) {
        const fileExtension = '.' + (file.mimetype.split('/')[1]);
        return allowedTypes.includes(fileExtension);
    }

    async uploadImg(img) {
        try {

            if (!this.validateFileType(img, ['.jpg', '.jpeg', '.png', '.webp'])) {
                throw ApiError.BadRequest('Upload img error')
            }
            const imgFileName = randomUUID() + '.' + (img.mimetype.split('/')[1]);
            const uploadPath = path.resolve(this.uploadDirImg, imgFileName);
            
            await img.mv(path.resolve(uploadPath))
            return imgFileName
            
        } catch(e) {
            throw ApiError.ElseError(e)
        }
    }
    
    async uploadVideo(video) {
        try {
            if (!this.validateFileType(video, ['.mp4', '.webm', '.mov'])) {
                throw ApiError.BadRequest('Upload video error')
            }
            const videoFileName = randomUUID() + '.' + (video.mimetype.split('/')[1]);
            const uploadPath = path.resolve(this.uploadDirVideo, videoFileName);
            
            await video.mv(uploadPath)
            return videoFileName
            
        } catch (e) {
            throw ApiError.ElseError(e)
        }
    }
    
    async deleteFile(fileName, type) {
        try {
            let filePath
            if (type == 'img') {
                filePath = path.resolve(this.uploadDirImg, fileName);
            } else if (type == 'video') {
                filePath = path.resolve(this.uploadDirVideo, fileName);
            } else {
                throw ApiError.BadRequest('Unknown type of file')
            }
            
            await fs.unlink(filePath);
            
            return true;
            
        } catch (e) {
            throw ApiError.ElseError(e)
        }
    }


    async uploadCheck(img, userId) {
        try {
            const imgFileName = userId + '_' + Date.now() + '.' + (img.mimetype.split('/')[1]);
            const uploadPath = path.resolve(this.uploadDirCheck, imgFileName);
            
            await img.mv(path.resolve(uploadPath))
            return imgFileName
            
        } catch(e) {
            throw ApiError.ElseError(e)
        }
    }
}

export default new UploadService()