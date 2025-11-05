import express from 'express'
import cookieParser from 'cookie-parser'
import { config } from 'dotenv'
import cors from 'cors'
import sequelize from './config/database.js'
import db from './config/models.js'
import router from './routes/Routes.js'
import errorMiddleware from './middleware/error-middleware.js'
import fileUpload from 'express-fileupload'
import { startCronJobs } from './utils/cronJobs.js'
config()

// startCronJobs()

const PORT = process.env.PORT
const HOST = process.env.HOST

const app = express()

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

app.use(express.json())
app.use(fileUpload({}))
app.use(cookieParser())
app.use('/api', router)
app.use(errorMiddleware)

const start = async () => {
    try {
        await sequelize.authenticate()
        console.log('database connected')
        // await sequelize.sync({ alter: true })
        // await sequelize.sync({force: true })
        app.listen(PORT, HOST, () => {
            console.log(`server started on http://${HOST}:${PORT}`
        )})
    } catch (e) {
        console.error(e)
    }
}

start()