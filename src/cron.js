import { CronJob } from 'cron';
import https from 'https';

const url = process.env.WHITE_LIST_MAIN_URL;

const job = new CronJob('*/14 * * * *', (() => {
  console.log('');
  console.log('Restarting server...');

  https.get(url, (res) => {
    if (res.statusCode === 200) {
      console.log('Server restarted');
    } else {
      console.error('Failed to restart server, status:', res.statusCode);
    }
  }).on('error', (err) => {
    console.error('Error during restart', err.message);
  });
}));

export default job;
