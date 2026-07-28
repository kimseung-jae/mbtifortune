// MBTI 16유형 특성 매핑 데이터
// 성격심리학적으로 검증된 척도는 아니며, 통용되는 MBTI 대중 콘텐츠 표현을 사용함.
// emphasis: 종합운세 문장 구성 시 어느 영역(총운/애정운/재물운/직장운)을 한 문장 더 강조할지 결정하는 태그

const MBTI = {
  ISTJ: { keyword: '신중하고 책임감 있는 관리자형', emphasis: '직장운' },
  ISFJ: { keyword: '헌신적이고 세심한 수호자형', emphasis: '애정운' },
  INFJ: { keyword: '통찰력 있는 신념가형', emphasis: '총운' },
  INTJ: { keyword: '전략적인 계획가형', emphasis: '재물운' },
  ISTP: { keyword: '냉철하고 실용적인 장인형', emphasis: '직장운' },
  ISFP: { keyword: '온화하고 예술적인 감성가형', emphasis: '애정운' },
  INFP: { keyword: '이상을 좇는 중재자형', emphasis: '총운' },
  INTP: { keyword: '논리적인 사색가형', emphasis: '재물운' },
  ESTP: { keyword: '행동파 모험가형', emphasis: '재물운' },
  ESFP: { keyword: '분위기 메이커 연예인형', emphasis: '애정운' },
  ENFP: { keyword: '열정적인 활동가형', emphasis: '총운' },
  ENTP: { keyword: '재기발랄한 발명가형', emphasis: '직장운' },
  ESTJ: { keyword: '체계적인 관리자형', emphasis: '직장운' },
  ESFJ: { keyword: '사교적인 친선도모형', emphasis: '애정운' },
  ENFJ: { keyword: '카리스마 있는 사회운동가형', emphasis: '총운' },
  ENTJ: { keyword: '결단력 있는 지휘관형', emphasis: '재물운' },
};

function getMbtiInfo(type) {
  const t = (type || '').toUpperCase();
  return MBTI[t] || null;
}

module.exports = { MBTI, getMbtiInfo };
