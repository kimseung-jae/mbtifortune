// 사주팔자(四柱八字) 계산 모듈
// lunar-javascript(정확한 절기·음양력 계산을 내장한 검증된 오픈소스 라이브러리)를 사용해
// 연주·월주·일주·시주의 간지를 계산한다.
// 참고: 기획서.md 9-1번 항목의 "만세력 정확도 확보" 과제를 lunar-javascript 도입으로 해소함.

const { Lunar, Solar } = require('lunar-javascript');
const { pillarToKo, ganWuXing, zhiWuXing } = require('./hanjaMap');

/**
 * @param {Object} input
 * @param {number} input.year
 * @param {number} input.month
 * @param {number} input.day
 * @param {'solar'|'lunar'} input.calendar - 양력/음력 구분
 * @param {number|null} input.hour - 태어난 시(0~23), 모르면 null
 * @returns {Object} 사주 계산 결과
 */
function calcSaju({ year, month, day, calendar = 'solar', hour = null }) {
  let solar;
  if (calendar === 'lunar') {
    const lunar = Lunar.fromYmd(year, month, day);
    solar = lunar.getSolar();
  } else {
    // 시간 모름 → 정오(12시)를 기준으로 일주까지만 계산, 시주는 결과에서 제외
    solar = Solar.fromYmdHms(year, month, day, hour === null ? 12 : hour, 0, 0);
  }

  const lunar = solar.getLunar();
  const bazi = lunar.getEightChar();

  const pillars = {
    year: { gan: bazi.getYearGan(), zhi: bazi.getYearZhi() },
    month: { gan: bazi.getMonthGan(), zhi: bazi.getMonthZhi() },
    day: { gan: bazi.getDayGan(), zhi: bazi.getDayZhi() },
    time: hour === null ? null : { gan: bazi.getTimeGan(), zhi: bazi.getTimeZhi() },
  };

  const readable = {
    year: pillarToKo(pillars.year.gan, pillars.year.zhi),
    month: pillarToKo(pillars.month.gan, pillars.month.zhi),
    day: pillarToKo(pillars.day.gan, pillars.day.zhi),
    time: pillars.time ? pillarToKo(pillars.time.gan, pillars.time.zhi) : null,
  };

  // 오행 분포 집계 (년/월/일 3개 기둥의 간+지 = 6개 요소, 시주 알면 8개 요소)
  const wuxingCount = { 목: 0, 화: 0, 토: 0, 금: 0, 수: 0 };
  const countPillar = (p) => {
    if (!p) return;
    const g = ganWuXing(p.gan);
    const z = zhiWuXing(p.zhi);
    if (g) wuxingCount[g] += 1;
    if (z) wuxingCount[z] += 1;
  };
  countPillar(pillars.year);
  countPillar(pillars.month);
  countPillar(pillars.day);
  if (pillars.time) countPillar(pillars.time);

  const sorted = Object.entries(wuxingCount).sort((a, b) => b[1] - a[1]);
  const dominant = sorted[0][1] > 0 ? sorted[0][0] : null;
  const weakest = sorted[sorted.length - 1][0];

  return {
    solarDate: solar.toYmd(),
    isTimeKnown: hour !== null,
    pillars: readable,
    dayMaster: pillarToKo(pillars.day.gan, pillars.day.zhi)[0], // 일간(日干) — 사주 해석의 기준점
    wuxingCount,
    dominantElement: dominant,
    weakestElement: weakest,
  };
}

module.exports = { calcSaju };
