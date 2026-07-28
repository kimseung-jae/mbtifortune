// 천간(天干)·지지(地支) 한자 → 한글 표기, 오행(五行) 배속 테이블
// 근거: 전통 명리학의 표준 천간/지지 오행 배속 (통용 표기, 별도 학설 분기 없음)

const GAN_KO = {
  '甲': '갑', '乙': '을', '丙': '병', '丁': '정', '戊': '무',
  '己': '기', '庚': '경', '辛': '신', '壬': '임', '癸': '계',
};

const ZHI_KO = {
  '子': '자', '丑': '축', '寅': '인', '卯': '묘', '辰': '진', '巳': '사',
  '午': '오', '未': '미', '申': '신', '酉': '유', '戌': '술', '亥': '해',
};

const GAN_WUXING = {
  '甲': '목', '乙': '목',
  '丙': '화', '丁': '화',
  '戊': '토', '己': '토',
  '庚': '금', '辛': '금',
  '壬': '수', '癸': '수',
};

const ZHI_WUXING = {
  '寅': '목', '卯': '목',
  '巳': '화', '午': '화',
  '辰': '토', '戌': '토', '丑': '토', '未': '토',
  '申': '금', '酉': '금',
  '亥': '수', '子': '수',
};

function ganToKo(hanja) {
  return GAN_KO[hanja] || hanja;
}

function zhiToKo(hanja) {
  return ZHI_KO[hanja] || hanja;
}

function pillarToKo(ganHanja, zhiHanja) {
  return `${ganToKo(ganHanja)}${zhiToKo(zhiHanja)}`;
}

function ganWuXing(hanja) {
  return GAN_WUXING[hanja] || null;
}

function zhiWuXing(hanja) {
  return ZHI_WUXING[hanja] || null;
}

module.exports = {
  GAN_KO, ZHI_KO, GAN_WUXING, ZHI_WUXING,
  ganToKo, zhiToKo, pillarToKo, ganWuXing, zhiWuXing,
};
