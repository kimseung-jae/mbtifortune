* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: 'Pretendard', -apple-system, 'Malgun Gothic', sans-serif;
  background: #f5f6fa;
  color: #1a1a2e;
}
.wrap { max-width: 480px; margin: 0 auto; padding: 32px 20px 60px; }
.header h1 { font-size: 24px; margin: 0 0 6px; }
.header .sub { font-size: 14px; color: #6b6b7b; margin: 0 0 24px; }

.card {
  background: #fff;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}
.card.hidden { display: none; }

.field { margin-bottom: 18px; }
.field label { display: block; font-size: 13px; color: #6b6b7b; margin-bottom: 6px; }
.row { display: flex; gap: 8px; }

input, select {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #e3e5ec;
  border-radius: 12px;
  font-size: 15px;
  background: #fafafe;
}
.row input { flex: 1; min-width: 0; }
.row select { flex: 0 0 90px; }

.primary-btn {
  width: 100%;
  padding: 15px;
  background: #3182F6;
  color: #fff;
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 8px;
}
.primary-btn:active { opacity: 0.85; }

.ghost-btn {
  width: 100%;
  padding: 15px;
  background: transparent;
  color: #6b6b7b;
  border: 1px solid #e3e5ec;
  border-radius: 14px;
  font-size: 15px;
  margin-top: 10px;
  cursor: pointer;
}

.error { color: #e0245e; font-size: 13px; margin-top: 10px; min-height: 16px; }

.result-header { text-align: center; margin-bottom: 20px; }
.badge { display: inline-block; font-size: 12px; background: #eef2ff; color: #3182F6; padding: 4px 10px; border-radius: 999px; }
#result-element { font-size: 26px; margin: 10px 0 4px; }

.domain-list { display: flex; flex-direction: column; gap: 14px; margin: 20px 0; }
.domain-item { background: #fafafe; border-radius: 14px; padding: 14px 16px; }
.domain-item .d-label { font-size: 13px; color: #3182F6; font-weight: 700; margin-bottom: 4px; }
.domain-item .d-text { font-size: 14.5px; line-height: 1.6; }

.lucky-box { display: flex; gap: 10px; margin-bottom: 18px; }
.lucky-cell { flex: 1; background: #f0f1fb; border-radius: 12px; text-align: center; padding: 12px 6px; font-size: 12.5px; color: #6b6b7b; }
.lucky-cell b { display: block; font-size: 16px; color: #1a1a2e; margin-top: 4px; }

.disclaimer { font-size: 11.5px; color: #a0a0ad; text-align: center; margin-bottom: 8px; }

.card-preview { width: 100%; border-radius: 16px; margin-top: 16px; }
.card-preview.hidden { display: none; }

.history-card { margin-top: 20px; }
.history-title { font-size: 15px; margin: 0 0 12px; color: #1a1a2e; }
.history-empty { font-size: 13px; color: #a0a0ad; margin: 0; }
.history-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.history-table.hidden { display: none; }
.history-table th, .history-table td { text-align: left; padding: 10px 8px; border-bottom: 1px solid #e3e5ec; }
.history-table th { color: #6b6b7b; font-weight: 700; font-size: 12px; }
.history-table td:first-child { white-space: nowrap; color: #6b6b7b; }
.history-table tbody tr:last-child td { border-bottom: none; }
