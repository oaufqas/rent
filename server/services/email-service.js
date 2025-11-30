import * as nodemailer from 'nodemailer'

class EmailService {

    constructor() {
        try {
        // this.transporter = nodemailer.createTransport({
        //     service: 'gmail',
        //     auth: {
        //         user: process.env.GMAIL_USER,
        //         pass: process.env.GMAIL_PASS
        //     }
        // })
            this.transporter = nodemailer.createTransport({
                host: 'smtp.timeweb.ru',
                port: 465,
                secure: true,
                auth: {
                    user: process.env.GMAIL_USER,
                    pass: process.env.GMAIL_PASS
                },

                tls: {
                    rejectUnauthorized: false
                },
                connectionTimeout: 10000,
                greetingTimeout: 10000,
                socketTimeout: 30000
            })

            this.verifyConnection()
        } catch (e) {
                console.error(e)
        }
    }

    async verifyConnection() {
        try {
            await this.transporter.verify();
            console.log('SMTP connection verified successfully');
        } catch (error) {
            console.error('SMTP connection failed:', error);
        }
    }

    async sendMultipleEmails(emails) {
        try {
            const promises = emails.map(emailConfig => {
                this.transporter.sendMail(emailConfig)
            })
            const results = await Promise.allSettled(promises)

            return results
        } catch (e) {
            console.error(e)
            throw e
        }
    }


    async sendActivationMail(to, link) {
        await this.transporter.sendMail({
            from: {
                name: 'kycaka rent',           // Имя отправителя
                address: process.env.GMAIL_USER     // Email отправителя
            },
            to,
            subject: 'Ссылка для активации аккаунта',
            html: 
                `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #333;">Ссылка для активации аккаунта</h2>
                        <p>Для завершения регистрации перейдите по ссылке:</p>
                        <div style="text-align: center; margin: 30px 0;">
                            <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #dc2626; background: #f8fafc; padding: 20px; border-radius: 8px;">
                                <a href="${link}">Нажмите для перехода по ссылке</a>
                            </div>
                        </div>
                        <p style="color: #666; font-size: 14px;">
                            Если вы не запрашивали ссылку, проигнорируйте это письмо.
                        </p>
                    </div>
                         
                `      
        })
    }


    async sendActivationCode(to, code) {
        await this.transporter.sendMail({
            from: {
                name: 'kycaka rent',           // Имя отправителя
                address: process.env.GMAIL_USER    // Email отправителя
            },
            to,
            subject: 'Код подтверждения входа',
            html: 
                `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Код подтверждения входа</h2>
                    <p>Для завершения входа введите следующий код:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #dc2626; background: #f8fafc; padding: 20px; border-radius: 8px;">
                            ${code}
                        </div>
                    </div>
                    <p style="color: #666; font-size: 14px;">
                        Код действителен в течение 20 минут.<br>
                        Если вы не запрашивали вход, проигнорируйте это письмо.
                    </p>
                </div>
                `      
        })
    }


    async sendCodeToChangePassword(to, code) {
        await this.transporter.sendMail({
            from: {
                name: 'kycaka rent',           // Имя отправителя
                address: process.env.GMAIL_USER     // Email отправителя
            },
            to,
            subject: 'Код для смены пароля',
            html: 
                `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">Код смены пароля</h2>
                    <p>Для смены пароля введите следующий код:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #dc2626; background: #f8fafc; padding: 20px; border-radius: 8px;">
                            ${code}
                        </div>
                    </div>
                    <p style="color: #666; font-size: 14px;">
                        Код действителен в течение 20 минут.<br>
                        Если вы не запрашивали вход, проигнорируйте это письмо.
                    </p>
                </div>
                `      
        })
    }


    async sendBalanceReplenishedMail(to, transaction) {
        await this.transporter.sendMail({
            from: {
                name: 'kycaka rent',           // Имя отправителя
                address: process.env.GMAIL_USER    // Email отправителя
            },
            to,
            subject: `Пополнение баланса на ${transaction.amount}`,
            html:
                `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #10b981;">Баланс пополнен</h2>
                <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Сумма:</strong> ${transaction.amount}₽</p>
                    <p><strong>Метод:</strong> ${transaction.method}</p>
                </div>
                <a href="${process.env.CLIENT_URL}/balance" style="display: inline-block; padding: 10px 20px; background: #10b981; color: white; text-decoration: none; border-radius: 5px;">
                    Перейти к балансу
                </a>
            </div>

                `
                   
        })
    }


    async sendRentSuccessMail(to, order) {
        await this.transporter.sendMail({
            from: {
                name: 'kycaka rent',           // Имя отправителя
                address: process.env.GMAIL_USER     // Email отправителя
            },
            to,
            subject: 'Аренда активна!',
            html: 
                `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #10b981;">Аренда активирована!</h2>
                <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Аккаунт:</strong> ${order.accountId || 'Не указан'}</p>
                    <p><strong>Период:</strong> ${order.rentPeriod} часов</p>
                    <p><strong>Сумма:</strong> ${order.amount}₽</p>
                    <p><strong>До:</strong> ${new Date(order.expiresAt).toLocaleString('ru-RU')}</p>
                </div>
                <a href="${process.env.CLIENT_URL}/orders/${order.id}" style="display: inline-block; padding: 10px 20px; background: #10b981; color: white; text-decoration: none; border-radius: 5px;">
                    Перейти к заказу
                </a>
            </div>
                `      
        })
    }


    async sendWarningMail(to, order, minutesLeft = 5) {
        await this.transporter.sendMail({
            from: {
                name: 'kycaka rent',           // Имя отправителя
                address: process.env.GMAIL_USER     // Email отправителя
            },
            to,
            subject: 'Скоро аренда закончится',
            html: 
                `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #f59e0b;">Аренда скоро закончится!</h2>
                <div style="background: #fffbeb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p>Аренда аккаунта закончится через <strong>${minutesLeft} минут</strong>.</p>
                    <p><strong>Аккаунт:</strong> ${order.accountId || 'Не указан'}</p>
                    <p><strong>Завершение:</strong> ${new Date(order.expiresAt).toLocaleString('ru-RU')}</p>
                    <p><strong>Не забудьте выйти из аккаунта</strong>.</p>
                </div>
                <p style="color: #666;">Если хотите продлить аренду, сделайте это в личном кабинете.</p>
            </div>
                `      
        })
    }



    async sendNewOrderMail(to, order) {
        await this.transporter.sendMail({
            from: {
                name: 'kycaka rent',           // Имя отправителя
                address: process.env.GMAIL_USER     // Email отправителя
            },
            to,
            subject: `Новый заказ #${order.id}`,
            html: 
                `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #dc2626;">Новый заказ #${order.id}</h2>
                <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Сумма:</strong> ${order.amount}₽</p>
                    <p><strong>Период аренды:</strong> ${order.rentPeriod} часов</p>
                    <p><strong>Метод оплаты:</strong> ${order.paymentMethod}</p>
                </div>
            </div>
                `      
        })
    }


    async sendNewReviewMail(to, review) {
        await this.transporter.sendMail({
            from: {
                name: 'kycaka rent',           // Имя отправителя
                address: process.env.GMAIL_USER     // Email отправителя
            },
            to,
            subject: `Новый отзыв на модерацию`,
            html: 
                `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #f59e0b;">Новый отзыв на модерацию</h2>
                <div style="background: #fffbeb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Рейтинг:</strong> ${'★'.repeat(review.ratingValue)}</p>
                    <p><strong>Комментарий:</strong> ${review.comment || 'Без комментария'}</p>
                </div>
            </div>
                `      
        })
    }


    async sendDepositMail(to, transaction) {
        await this.transporter.sendMail({
            from: {
                name: 'kycaka rent',
                address: process.env.GMAIL_USER
            },
            to,
            subject: `Новая заявка на пополнение #${transaction.id}`,
            html: 
                `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #10b981;">Заявка на пополнение</h2>
                <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <p><strong>Сумма:</strong> ${transaction.amount}₽</p>
                    <p><strong>Метод:</strong> ${transaction.method}</p>
                    <p><strong>Пользователь:</strong> ID ${transaction.userId}</p>
                </div>
            </div>
                `      
        })
    }
}

export default new EmailService()