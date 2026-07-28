// 종합운세 생성 엔진 — 기획서.md 5번 항목의 4개 레이어 구조를 그대로 구현
// 1) 베이스: 사주 오행(dominantElement)   2) 보정: MBTI emphasis   3) 캐릭터: 혈액형(코멘트만)   4) 변동: 오늘 날짜 시드
// 규칙 기반 템플릿만으로 완결되도록 설계 — AI API(ANTHROPIC_API_KEY) 없이도 정상 작동함(폴백 원칙)

const { calcSaju } = require('./saju');
const { getMbtiInfo } = require('./mbti');
const { getBloodTypeComment } = require('./bloodtype');
const { createDailyRandom, pick, todayKST } = require('./dailySeed');

// 오행별 도메인 기본 문장 (베이스 레이어)
const BASE_SENTENCES = {
  목: {
    총운: '새롭게 뻗어나가려는 기운이 강한 시기예요. 시작하는 일마다 뿌리를 잘 내릴 준비가 되어 있어요.',
    애정운: '관계에서 성장하고 배우려는 마음이 커요. 상대에게 먼저 다가가면 좋은 흐름이 생겨요.',
    재물운: '투자보다는 씨앗을 심는 마음으로 장기적인 계획을 세우기 좋은 때예요.',
    직장운: '아이디어가 자라나는 시기예요. 새로운 프로젝트를 제안해보기 좋아요.',
    건강운: '활동량을 늘리기 좋은 기운이지만, 무리한 확장은 피로로 이어질 수 있어요.',
  },
  화: {
    총운: '열정과 에너지가 넘치는 시기예요. 다만 속도 조절이 이번 운의 핵심이에요.',
    애정운: '표현력이 좋아지는 때라 마음을 솔직하게 전하면 좋은 반응이 와요.',
    재물운: '기회가 빠르게 왔다 빠르게 지나가는 흐름이라 타이밍 포착이 중요해요.',
    직장운: '주목받을 일이 생기기 쉬운 시기예요. 발표나 제안이 있다면 지금이 적기예요.',
    건강운: '컨디션 기복이 있을 수 있어요. 과열되지 않게 휴식을 챙기세요.',
  },
  토: {
    총운: '안정감 있게 중심을 잡는 시기예요. 급하게 바꾸기보다 다지는 게 유리해요.',
    애정운: '신뢰를 쌓는 시간이 필요한 관계예요. 꾸준함이 매력으로 비쳐요.',
    재물운: '큰 변동보다는 저축·정리에 유리한 흐름이에요.',
    직장운: '맡은 역할에 충실하면 신뢰를 얻는 시기예요. 책임감이 좋은 평가로 이어져요.',
    건강운: '루틴을 지키는 게 컨디션 관리의 핵심이에요.',
  },
  금: {
    총운: '결단력이 필요한 시기예요. 맺고 끊는 게 명확할수록 흐름이 좋아져요.',
    애정운: '분명한 의사표현이 관계를 정리하거나 깊어지게 만들어요.',
    재물운: '군더더기를 정리하면 실속이 생기는 흐름이에요. 불필요한 지출을 줄여보세요.',
    직장운: '원칙과 기준을 세우면 인정받는 시기예요.',
    건강운: '호흡기·긴장 관련 컨디션에 신경 쓰면 좋아요.',
  },
  수: {
    총운: '유연하게 흐르는 기운이에요. 변화를 받아들일수록 운이 트여요.',
    애정운: '깊이 있는 대화가 관계를 풀어주는 열쇠가 되는 시기예요.',
    재물운: '흐름을 타는 재테크(정보 수집, 네트워킹)에 유리한 때예요.',
    직장운: '협업과 소통에서 좋은 성과가 나오는 시기예요.',
    건강운: '수면과 순환 관리에 신경 쓰면 컨디션이 안정돼요.',
  },
};

// MBTI emphasis 강조 문장 (보정 레이어)
const EMPHASIS_SENTENCES = {
  총운: (keyword) => `${keyword} 특유의 감각이 오늘 유독 잘 발휘돼요.`,
  애정운: (keyword) => `${keyword}답게 마음을 표현할수록 관계가 편안해져요.`,
  재물운: (keyword) => `${keyword}의 판단력이 재물 관리에서 빛을 발하는 시기예요.`,
  직장운: (keyword) => `${keyword}의 강점이 특히 잘 통하는 시기라 적극적으로 나서봐도 좋아요.`,
};

const LUCKY_COLORS = ['빨강', '주황', '노랑', '초록', '파랑', '남색', '보라', '하양', '검정', '베이지'];
const LUCKY_DIRECTIONS = ['동쪽', '서쪽', '남쪽', '북쪽', '동남쪽', '동북쪽', '서남쪽', '서북쪽'];
const DAILY_MOOD = [
  '작은 행운이 예상치 못한 순간에 찾아와요.',
  '평소보다 직감이 잘 맞아떨어지는 하루예요.',
  '주변 사람의 말 한마디가 힌트가 될 수 있어요.',
  '서두르지 않을수록 일이 잘 풀리는 흐름이에요.',
  '평소 미뤄둔 일을 처리하기 좋은 타이밍이에요.',
];

function buildSignature({ year, month, day, calendar, hour, mbti, bloodType }) {
  return [year, month, day, calendar, hour ?? 'unknown', mbti, bloodType].join('-');
}

function generateFortune({ year, month, day, calendar, hour, mbti, bloodType, dateKey }) {
  const saju = calcSaju({ year, month, day, calendar, hour });
  const mbtiInfo = getMbtiInfo(mbti);
  const bloodComment = getBloodTypeComment(bloodType);

  const element = saju.dominantElement || '토'; // 오행이 고르게 분포해 우세 원소가 없으면 '토'(중용)를 기본값으로 사용
  const base = BASE_SENTENCES[element];

  const today = dateKey || todayKST();
  const signature = buildSignature({ year, month, day, calendar, hour, mbti, bloodType });
  const rand = createDailyRandom(signature, today);

  const domains = {};
  for (const key of ['총운', '애정운', '재물운', '직장운', '건강운']) {
    domains[key] = base[key];
  }

  // MBTI 강조 레이어 — 해당 도메인에 한 문장 추가
  if (mbtiInfo && EMPHASIS_SENTENCES[mbtiInfo.emphasis]) {
    domains[mbtiInfo.emphasis] += ` ${EMPHASIS_SENTENCES[mbtiInfo.emphasis](mbtiInfo.keyword)}`;
  }

  const luckyItem = {
    color: pick(rand, LUCKY_COLORS),
    number: 1 + Math.floor(rand() * 9),
    direction: pick(rand, LUCKY_DIRECTIONS),
  };
  const dailyMood = pick(rand, DAILY_MOOD);

  return {
    date: today,
    input: { year, month, day, calendar, hour, mbti, bloodType },
    saju: {
      solarDate: saju.solarDate,
      pillars: saju.pillars,
      isTimeKnown: saju.isTimeKnown,
      wuxingCount: saju.wuxingCount,
      dominantElement: saju.dominantElement,
    },
    dominantElement: element,
    mbti: mbtiInfo ? { type: mbti.toUpperCase(), keyword: mbtiInfo.keyword, emphasis: mbtiInfo.emphasis } : null,
    bloodType: bloodComment ? { type: bloodType.toUpperCase(), comment: bloodComment } : null,
    domains,
    luckyItem,
    dailyMood,
    disclaimer: '이 결과는 전통 명리학·MBTI·혈액형 콘텐츠를 재미로 구성한 것으로, 과학적으로 검증된 예측이 아닙니다.',
  };
}

module.exports = { generateFortune, buildSignature };
