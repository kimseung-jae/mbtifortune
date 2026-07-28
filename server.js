const path = require('path');
try { require('dotenv').config(); } catch (e) { /* dotenv 미설치 시 무시 — .env 없이도 정상 동작 */ }

const express = require('express');
const fortuneRouter = require('./routes/fortune');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', fortuneRouter);

app.get('/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`fortune 서버 실행 중: http://localhost:${PORT}`);
});
