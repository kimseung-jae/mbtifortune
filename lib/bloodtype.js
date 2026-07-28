// 혈액형 성격론 코멘트 매핑
// 주의: 혈액형과 성격의 상관관계는 의학적·심리학적으로 근거가 확인되지 않은 통속 이론임.
// 이 모듈은 재미 요소로만 사용하며, 사주/오행 계산 로직(핵심 판단)에는 관여하지 않음.
// (기획서.md 5번, 9-3번 항목 참고)

const BLOOD_TYPE = {
  A: '꼼꼼하고 신중하게 하루를 준비하는 타입',
  B: '자기 페이스대로 자유롭게 움직이는 타입',
  O: '사교적이고 추진력 있게 밀어붙이는 타입',
  AB: '이성과 감성 사이에서 균형을 잘 잡는 타입',
};

function getBloodTypeComment(type) {
  const t = (type || '').toUpperCase();
  return BLOOD_TYPE[t] || null;
}

module.exports = { BLOOD_TYPE, getBloodTypeComment };
