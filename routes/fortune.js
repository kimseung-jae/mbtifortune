const express = require('express');
const path = require('path');
const fs = require('fs');
const { generateFortune } = require('../lib/fortuneEngine');
const { MBTI } = require('../lib/mbti');
const { BLOOD_TYPE } = require('../lib/bloodtype');

const router = express.Router();

let browserPromise = null;
function getBrowser() {
  if (!browserPromise) {
    const puppeteer = require('puppeteer');
    browserPromise = puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  }
  return browserPromise;
}

function validateInput(body) {
  const { year, month, day, calendar, hour, mbti, bloodType } = body;
  const errors = [];

  const y = Number(year), m = Number(month), d = Number(day);
  if (!Number.isInteger(y) || y < 1900 || y > 2100) errors.push('생년(year)이 올바르지 않습니다.');
  if (!Number.isInteger(m) || m < 1 || m > 12) errors.push('생월(month)이 올바르지 않습니다.');
  if (!Number.isInteger(d) || d < 1 || d > 31) errors.push('생일(day)이 올바르지 않습니다.');

  const cal = calendar === 'lunar' ? 'lunar' : 'solar';

  let h = null;
  if (hour !== undefined && hour !== null && hour !== '' && hour !== 'unknown') {
    h = Number(hour);
    if (!Number.isInteger(h) || h < 0 || h > 23) errors.push('태어난 시(hour)는 0~23 사이여야 합니다.');
  }

  const mbtiType = (mbti || '').toUpperCase();
  if (!MBTI[mbtiType]) errors.push(`MBTI 값이 올바르지 않습니다. (${Object.keys(MBTI).join(', ')} 중 하나)`);

  const bloodTypeVal = (bloodType || '').toUpperCase();
  if (!BLOOD_TYPE[bloodTypeVal]) errors.push(`혈액형 값이 올바르지 않습니다. (${Object.keys(BLOOD_TYPE).join(', ')} 중 하나)`);

  return { errors, parsed: { year: y, month: m, day: d, calendar: cal, hour: h, mbti: mbtiType, bloodType: bloodTypeVal } };
}

router.post('/fortune', (req, res) => {
  const { errors, parsed } = validateInput(req.body);
  if (errors.length) return res.status(400).json({ ok: false, errors });

  try {
    const result = generateFortune(parsed);
    res.json({ ok: true, result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, errors: ['운세 계산 중 오류가 발생했습니다.'] });
  }
});

router.post('/fortune/card', async (req, res) => {
  const { errors, parsed } = validateInput(req.body);
  if (errors.length) return res.status(400).json({ ok: false, errors });

  try {
    const result = generateFortune(parsed);
    const templatePath = path.join(__dirname, '..', 'templates', 'card.html');
    let html = fs.readFileSync(templatePath, 'utf-8');

    html = html
      .replace('{{DATE}}', result.date)
      .replace('{{ELEMENT}}', result.dominantElement)
      .replace('{{MBTI}}', result.mbti ? result.mbti.type : '')
      .replace('{{TOTAL}}', result.domains.총운)
      .replace('{{LOVE}}', result.domains.애정운)
      .replace('{{COLOR}}', result.luckyItem.color)
      .replace('{{NUMBER}}', String(result.luckyItem.number))
      .replace('{{DIRECTION}}', result.luckyItem.direction);

    const browser = await getBrowser();
    const page = await browser.newPage();
    await page.setViewport({ width: 600, height: 800, deviceScaleFactor: 2 });
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const buffer = await page.screenshot({ type: 'png' });
    await page.close();

    res.set('Content-Type', 'image/png');
    res.send(buffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, errors: ['카드 이미지 생성 중 오류가 발생했습니다.'] });
  }
});

module.exports = router;
