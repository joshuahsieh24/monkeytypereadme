const modes = process.argv[2] || '10w 15s 60s';

require('./src/fetchStats').fetchStats(modes).then((stats) => {
  console.log('Modes:', modes);
  console.log('Result:', JSON.stringify(stats, null, 2));
}).catch((err) => {
  console.error('Error:', err.message);
});
