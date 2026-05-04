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
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

config()

startCronJobs()

const PORT = process.env.PORT
const HOST = process.env.HOST

const app = express()

// app.use((req, res, next) => {
//     console.log('REQUEST INCOMING:', new Date().toISOString())
//     console.log('Method:', req.method)
//     console.log('URL:', req.url)
//     console.log('User-Agent:', req.headers['user-agent'])
//     console.log('---')
//     next()
// })

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ extended: true, limit: '200mb' }));
app.use(fileUpload({  limits: { 
    fileSize: 200 * 1024 * 1024,
    files: 10
  },
  abortOnLimit: true,
  useTempFiles: true,
  tempFileDir: '/tmp/',
  safeFileNames: true,
  preserveExtension: true
}))
app.use(cookieParser())

app.use('/api/img', express.static(path.join(__dirname, '..', 'uploads', 'img')))
app.use('/api/video', express.static(path.join(__dirname, '..', 'uploads', 'video')))

app.use('/api', router)

app.use('/assets', express.static(path.join(__dirname, '..', 'client', 'dist', 'assets')))
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')))

app.use(errorMiddleware)

app.use((req, res, next) => {
    if (req.path.startsWith('/api/')) {
        return next()
    }
    res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'))
})

app.use((req, res, next) => {
    if (!isDbConnected && req.path !== '/status') {
        return res.status(503).send('Сервер еще загружается, подождите...');
    }
    next();
});

let isDbConnected = false;

const start = async () => {
    app.listen(PORT, HOST, () => {
        console.log(`Server process started on http://${HOST}:${PORT}`);
    });

    const connectWithRetry = async () => {
        try {
            await sequelize.authenticate();
            await sequelize.sync(); 
            isDbConnected = true; 
            console.log('Database connected and synced');
        } catch (e) {
            console.error('Database connection failed, retrying...', e.message);
            setTimeout(connectWithRetry, 5000);
        }
    }
    connectWithRetry();
}

start()