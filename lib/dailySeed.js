// 날짜 + 사용자 입력값을 시드로 하는 결정론적 난수 생성기
// 같은 사람이 같은 날 다시 조회하면 항상 같은 결과가 나오도록 함 (기획서.md 5번, 변동 레이어)

function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return h >>> 0;
}

// mulberry32 — 시드 기반 결정론적 PRNG
function mulberry32(seed) {
  let a = seed;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * @param {string} signature - 입력값을 조합한 고유 문자열 (예: 생년월일+MBTI+혈액형)
 * @param {string} dateKey - 기준 날짜 (YYYY-MM-DD, KST)
 */
function createDailyRandom(signature, dateKey) {
  const seed = hashString(`${signature}::${dateKey}`);
  return mulberry32(seed);
}

function pick(rand, arr) {
  return arr[Math.floor(rand() * arr.length)];
}

function todayKST() {
  const now = new Date(Date.now() + 9 * 60 * 60 * 1000); // UTC+9
  return now.toISOString().slice(0, 10);
}

module.exports = { createDailyRandom, pick, todayKST, hashString };
