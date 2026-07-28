const $ = (id) => document.getElementById(id);

let lastPayload = null;

function collectPayload() {
  return {
    calendar: $('calendar').value,
    year: $('year').value,
    month: $('month').value,
    day: $('day').value,
    hour: $('hour').value === '' ? null : $('hour').value,
    mbti: $('mbti').value,
    bloodType: $('bloodType').value,
  };
}

function renderResult(result) {
  $('result-date').textContent = result.date;
  $('result-element').textContent = `${result.dominantElement} 기운이 강한 사주예요`;
  $('result-mbti').textContent = result.mbti
    ? `${result.mbti.type} · ${result.mbti.keyword}${result.bloodType ? ' · ' + result.bloodType.comment : ''}`
    : '';

  const order = ['총운', '애정운', '재물운', '직장운', '건강운'];
  $('domain-list').innerHTML = order.map((k) => `
    <div class="domain-item">
      <div class="d-label">${k}</div>
      <div class="d-text">${result.domains[k]}</div>
    </div>
  `).join('');

  $('lucky-box').innerHTML = `
    <div class="lucky-cell">행운의 색<b>${result.luckyItem.color}</b></div>
    <div class="lucky-cell">행운의 숫자<b>${result.luckyItem.number}</b></div>
    <div class="lucky-cell">행운의 방향<b>${result.luckyItem.direction}</b></div>
  `;

  $('disclaimer').textContent = result.disclaimer;

  $('card-preview').classList.add('hidden');
  $('card-preview').removeAttribute('src');

  $('form-view').classList.add('hidden');
  $('result-view').classList.remove('hidden');
}

async function submitForm() {
  $('error-msg').textContent = '';
  const payload = collectPayload();

  if (!payload.year || !payload.month || !payload.day) {
    $('error-msg').textContent = '생년월일을 모두 입력해주세요.';
    return;
  }
  if (!payload.mbti) {
    $('error-msg').textContent = 'MBTI를 선택해주세요.';
    return;
  }
  if (!payload.bloodType) {
    $('error-msg').textContent = '혈액형을 선택해주세요.';
    return;
  }

  $('submit-btn').disabled = true;
  $('submit-btn').textContent = '분석 중...';

  try {
    const res = await fetch('/api/fortune', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!data.ok) {
      $('error-msg').textContent = data.errors.join(' / ');
      return;
    }
    lastPayload = payload;
    renderResult(data.result);
  } catch (err) {
    $('error-msg').textContent = '서버와 통신 중 오류가 발생했습니다.';
  } finally {
    $('submit-btn').disabled = false;
    $('submit-btn').textContent = '종합운세 보기';
  }
}

async function makeShareCard() {
  if (!lastPayload) return;
  $('share-btn').disabled = true;
  $('share-btn').textContent = '카드 생성 중...';
  try {
    const res = await fetch('/api/fortune/card', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lastPayload),
    });
    if (!res.ok) throw new Error('card generation failed');
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const img = $('card-preview');
    img.src = url;
    img.classList.remove('hidden');

    if (navigator.canShare && navigator.canShare({ files: [new File([blob], 'fortune.png', { type: 'image/png' })] })) {
      const file = new File([blob], 'fortune.png', { type: 'image/png' });
      await navigator.share({ files: [file], title: '오늘의 운세', text: '오늘의 종합운세 결과예요!' });
    }
  } catch (err) {
    // 공유 API 미지원 브라우저에서는 이미지 미리보기만 제공
  } finally {
    $('share-btn').disabled = false;
    $('share-btn').textContent = '공유 카드 만들기';
  }
}

$('submit-btn').addEventListener('click', submitForm);
$('share-btn').addEventListener('click', makeShareCard);
$('back-btn').addEventListener('click', () => {
  $('result-view').classList.add('hidden');
  $('form-view').classList.remove('hidden');
});
