import ApiError from '../apiErrors/api-error.js'
import db from '../config/models.js'
import uploadService from './upload-service.js'
import { literal, Op, } from 'sequelize';

class AccountService {

    async getSortOrAllAcc(bape, crewUniform, more300mif) {
        try {

            const whereConditions = [];

            const filters = {
                bape: bape === 'true',
                crewUniform: crewUniform === 'true', 
                more300mif: more300mif === 'true'
            };

            if (filters.bape) {
                whereConditions.push(
                    literal(`characters LIKE '%"bape":true%'`)
                );
            }
            if (filters.crewUniform) {
                whereConditions.push(
                    literal(`characters LIKE '%"crewUniform":true%'`)
                );
            }
            if (filters.more300mif) {
                whereConditions.push(
                    literal(`characters LIKE '%"more300mif":true%'`)
                );
            }

            const accsData = await db.Account.findAndCountAll({
                where: whereConditions.length > 0 ? { [Op.and]: whereConditions } : {}
            });


            return accsData;

        } catch (e) {
            throw ApiError.ElseError(e)
        }
    }



    
    async getOneAccount(id) {
        try {
            const accData = await db.Account.findByPk(id)

            if (!accData) return res.json({"message": 'Account not found'})

            return accData

        } catch (e) {
            throw ApiError.ElseError(e)
        }
    }


    async createAccount(account_number, title, description, characters, price, img, video, status) {
        const pathToImg = await uploadService.uploadImg(img)
        const pathToVideo = await uploadService.uploadVideo(video)
        
        try {
            const accData = await db.Account.create({account_number, title, description, characters, price, status, img: pathToImg, video: pathToVideo})
            return accData

        } catch (e) {
            if (pathToImg) await uploadService.deleteFile(pathToImg, 'img');
            if (pathToVideo) await uploadService.deleteFile(pathToVideo, 'video');
            throw ApiError.ElseError(e)
        }
    }


    async changeAccount (id, account_number, title, description, characters, price, img, video, status) {
        try {
            
            const findAcc = await db.Account.findByPk(id) 
    
            if (!findAcc) return res.json({"message": 'Account not found'})
    
            const updateData = {}
    
            if (img) {
                if (findAcc.img) {
                    await uploadService.deleteFile(findAcc.img, 'img');
                }
                updateData.img = await uploadService.uploadImg(img);
            }
    
            if (video) {
                if (findAcc.video) {
                    await uploadService.deleteFile(findAcc.video, 'video');
                }
                updateData.video = await uploadService.uploadVideo(video);
            }
    
            if (account_number !== undefined) updateData.account_number = account_number;
            if (title !== undefined) updateData.title = title;
            if (description !== undefined) updateData.description = description;
            if (characters !== undefined) updateData.characters = characters;
            if (price !== undefined) updateData.price = price;
            if (status !== undefined) updateData.status = status;

            if (Object.keys(updateData).length > 0) {

                await findAcc.update(updateData)
                const updatedAcc = await db.Account.findByPk(id)
                
                return updatedAcc
                
            } else {
                return findAcc
            }

        } catch (e) {
            throw ApiError.ElseError(e)
        }
    }
    
    
    async deleteAccount(id) {  
        try {
            const deleted = await db.Account.destroy({
                where: {id}
            })

            if (deleted === 0) return res.json({"message": 'Account not found'})
    
            return deleted
        } catch (e) {
            throw ApiError.ElseError(e)
        }
    }
    
    
    async changeStatusAccount(id, status, rentHours) {
        let checkH = parseInt(rentHours)
        try {
            
            const findAcc = await db.Account.findByPk(id) 
            if (!findAcc) {
                throw ApiError.BadRequest('Account not found')
            }
    
            const updateData = {}
    
            if (status !== undefined) {

                if (status == 'rented' && !rentHours) {
                    throw ApiError.BadRequest('Bad request')
                }

                if (status == 'free' || status == 'unavailable') {
                    checkH = null
                }
                updateData.status = status;
            } 

            if (checkH !== undefined && checkH !== null) {
                let rentExpiresAt = findAcc.rentExpiresAt || null

                if (status == undefined) {
                    rentExpiresAt = new Date(rentExpiresAt.getTime() + (checkH * 60 * 60 * 1000))

                } else {
                    rentExpiresAt = new Date(Date.now() + checkH * 60 * 60 * 1000)
                }

                updateData.rentExpiresAt = rentExpiresAt;
            } else {
                updateData.rentExpiresAt = null;
            }
    
            if (Object.keys(updateData).length > 0) {
    
                await findAcc.update(updateData)
                const updatedAcc = await db.Account.findByPk(id)
                
                return updatedAcc
                
            } else {
                return findAcc
            }
    
        } catch (e) {
            throw ApiError.ElseError(e)
        }
    }
}

export default new AccountService()