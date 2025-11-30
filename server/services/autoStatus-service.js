import db from '../config/models.js'
import { Op } from 'sequelize'
import emailService from './email-service.js';

class AutoStatusService {
    

    async checkRentalsForMail() {
        try {
            const now = new Date(Date.now())
            const fiveMinutsLater = new Date(now.getTime()  + 5 * 60 * 1000)

            const expiredOrders = await db.Order.findAll({
                where: {
                    status: 'active',
                    canSendMail: true,
                    expiresAt: {
                        [Op.between]: [now, fiveMinutsLater]
                    }
                }, 
                include: [
                    { model: db.User, attributes: ['email', 'id'] }]
            });

            
            for (const order of expiredOrders) {
                try {
                    try {
                        emailService.sendWarningMail(order.user.email, order, 5)
                    } catch (e) {
                        throw e
                    }
                    await order.update({ 
                        canSendMail: false,
                    });
                    console.log(`Уведомление о окночании аренды пользователю с id ${order.userId} отправлено`);
                } catch (e) {
                    console.error("Ошибка отправки уведомления пользователю", e)
                }
            }

            return expiredOrders.length;
        } catch (error) {
            console.error('Ошибка проверки ордеров для отправки уведомлений:', error);
        }
    }



    async checkExpiredRentals() {
        try {
            const now = new Date(Date.now())
            

            const expiredAccounts = await db.Account.findAll({
                where: {
                    rentExpiresAt: {
                        [Op.lt]: now 
                    }
                }
            });


            for (const account of expiredAccounts) {
                await account.update({ 
                    status: 'free',
                    rentExpiresAt: null
                });
                console.log(`Аккаунт ${account.id} освобожден`);
            }

            return expiredAccounts.length;
        } catch (error) {
            console.error('Ошибка проверки аренд:', error);
        }
    }



    async checkExpiredCodes() {
        try {
            const now = new Date(Date.now())
            

            const expiredUserCodes = await db.User.findAll({
                where: {
                    twoFactorExpires: {
                        [Op.lt]: now 
                    }
                }
            });


            for (const user of expiredUserCodes) {
                await user.update({ 
                    twoFactorCode: null,
                    twoFactorExpires: null
                });
                console.log(`Просроченный код активации юзера с id ${user.id} обнулен`);
            }

            return expiredUserCodes.length;
        } catch (error) {
            console.error('Ошибка проверки кодов:', error);
        }
    }



    async checkExpiredOrders() {
        try {
            const now = new Date(Date.now())
            
            const expiredOrders = await db.Order.findAll({
                where: {
                    status: 'active',
                    expiresAt: {
                        [Op.lt]: now
                    }
                },
                include: [{ model: db.Account }]
            });

            for (const order of expiredOrders) {

                await order.update({ 
                    status: 'completed',
                    expiresAt: null,
                    canReview: true 
                });


                if (order.account && order.account.status === 'rented') {
                    await order.Account.update({
                        status: 'free',
                        rentExpiresAt: null
                    });
                }

                console.log(`Заказ ${order.id} завершен`);
            }

            return expiredOrders.length;
        } catch (error) {
            console.error('Ошибка проверки заказов:', error);
        }
    }


    async runAllChecks() {  
        const accountsFreed = await this.checkExpiredRentals();
        const ordersCompleted = await this.checkExpiredOrders();
        const codesIsNull = await this.checkExpiredCodes();
        const sendMail = await this.checkRentalsForMail()
        
        return { accountsFreed, ordersCompleted, codesIsNull, sendMail };
    }
}

export default new AutoStatusService();