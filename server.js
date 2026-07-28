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

// Vercel 등 서버리스 환경에서는 app.listen()을 호출하지 않고
// module.exports = app 을 통해 요청 핸들러만 넘긴다.
// 로컬(node server.js)로 직접 실행할 때만 listen한다.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`fortune 서버 실행 중: http://localhost:${PORT}`);
  });
}

module.exports = app;
