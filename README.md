# fortune

MBTI · 혈액형 · 사주(생년월일시)를 결합한 종합운세 MVP. 상세 기획은 [기획서.md](../기획서.md)를 참고.

## 실행 방법

```bash
npm install
cp .env.example .env
npm start
```

`http://localhost:3000` 접속.

## 구조

- `server.js` — Express 서버 진입점
- `routes/fortune.js` — `POST /api/fortune`(텍스트 결과), `POST /api/fortune/card`(공유 카드 PNG)
- `lib/saju.js` — `lunar-javascript` 기반 정확한 사주팔자(연/월/일/시주) 계산
- `lib/mbti.js`, `lib/bloodtype.js` — MBTI 16유형, 혈액형 코멘트 데이터
- `lib/fortuneEngine.js` — 사주 오행(베이스) + MBTI(보정) + 혈액형(코멘트) + 날짜 시드(변동) 4계층 결합 로직
- `lib/dailySeed.js` — 같은 사람·같은 날에는 항상 같은 결과가 나오도록 하는 결정론적 시드 생성기
- `public/` — 입력 폼 및 결과 화면 (바닐라 JS, 프레임워크 없음)
- `templates/card.html` — Puppeteer로 렌더링하는 공유 카드 템플릿

## 현재 MVP 범위

- 회원가입/로그인 없음, 완전 무료
- AI 문구 생성 API 없이 규칙 기반 템플릿만으로 동작 (Claude API 키는 향후 확장용, 현재 미사용)
- 사주 계산은 `lunar-javascript`(정확한 절기·간지 계산 라이브러리)로 처리 — 기획서 9-1번 항목 해소

## 남은 과제 (기획서.md 9번 항목 참고)

- 음력 윤달 등 예외 케이스 추가 검증
- 공유 카드 디자인 고도화, 9:16 스토리용 버전 추가
- 배포 환경(Render/Railway 등) 확정
