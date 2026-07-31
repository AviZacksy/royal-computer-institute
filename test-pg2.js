const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://postgres:%40vir%40zput0624@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres?pool_mode=session'
});
client.connect()
  .then(() => { console.log('Connected to aws-0 with just postgres!'); client.end(); })
  .catch(e => { console.error('aws-0 Error:', e.message); client.end(); });
