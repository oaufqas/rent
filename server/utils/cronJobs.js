import cron from 'node-cron'
import autoStatusService from '../services/autoStatus-service.js';

// Запуск каждые 5 минут
// cron.schedule('*/5 * * * *', async () => {
//     await autoStatusService.runAllChecks();
// });

// Запуск каждую минуту 
// cron.schedule('* * * * *', async () => {
//     await autoStatusService.runAllChecks();
// });

export const startCronJobs = () => {
    console.log('Automatic status checking has been launched...');
};