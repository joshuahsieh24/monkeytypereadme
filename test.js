require('./src/fetchStats').fetchStats().then((stats) => {
  console.log('Result:', JSON.stringify(stats, null, 2));
}).catch((err) => {
  console.error('Error:', err.message);
});
