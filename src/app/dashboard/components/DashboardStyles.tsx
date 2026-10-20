const css = `
.d { display: flex; flex-direction: column; gap: 24px; width: 100%; color: #25211e; }
.d-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; }
.d-title { margin: 0; font-size: 30px; line-height: 1.2; font-weight: 700; letter-spacing: -0.02em; }
.d-sub { margin: 6px 0 0; color: #8b827b; font-size: 15px; }
.d-date { display: inline-flex; align-items: center; gap: 10px; padding: 11px 16px; border: 1px solid #ece6df; border-radius: 12px; background: #fff; color: #4a423d; font-size: 15px; white-space: nowrap; }
.d-stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 20px; }
.d-stat { display: flex; flex-direction: column; padding: 22px 24px; border: 1px solid #ece6df; border-radius: 20px; background: #fff; color: inherit; text-decoration: none; transition: border-color 0.15s ease, box-shadow 0.15s ease; }
.d-stat:hover { border-color: #e3c3ab; box-shadow: 0 6px 18px rgba(46, 39, 34, 0.06); }
.d-stat-top { display: flex; align-items: center; justify-content: space-between; }
.d-stat-icon { display: flex; align-items: center; justify-content: center; width: 46px; height: 46px; border-radius: 14px; background: #fbeee4; color: #d27a45; }
.d-trend { padding: 4px 12px; border-radius: 999px; background: #e8f5ec; color: #237a45; font-size: 13px; font-weight: 600; }
.d-stat-value { margin-top: 26px; font-size: 36px; line-height: 1; font-weight: 700; }
.d-stat-title { margin-top: 12px; font-size: 17px; font-weight: 600; }
.d-stat-note { margin-top: 4px; color: #a59c95; font-size: 14px; }
.d-grid { display: grid; grid-template-columns: minmax(0, 1.45fr) minmax(0, 1fr); gap: 24px; align-items: stretch; }
.d-card { display: flex; flex-direction: column; padding: 28px; border: 1px solid #ece6df; border-radius: 20px; background: #fff; }
.d-card-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
.d-card-head h3 { margin: 0; font-size: 20px; font-weight: 700; }
.d-card-head p { margin: 6px 0 0; color: #8b827b; font-size: 15px; }
.d-card-head p.d-sample { color: #b45309; font-size: 13px; }
.d-link { display: inline-flex; align-items: center; gap: 6px; color: #d27a45; font-size: 15px; font-weight: 500; text-decoration: none; }
.d-link:hover { text-decoration: underline; }
.d-period { position: relative; }
.d-period-btn { display: inline-flex; align-items: center; justify-content: space-between; gap: 10px; min-width: 120px; padding: 9px 14px; border: 1px solid #ece6df; border-radius: 10px; background: #fff; color: #4a423d; font-size: 14px; cursor: pointer; }
.d-period-btn:hover { background: #faf8f6; }
.d-period-menu { position: absolute; z-index: 20; right: 0; top: calc(100% + 6px); min-width: 140px; padding: 6px; border: 1px solid #ece6df; border-radius: 12px; background: #fff; box-shadow: 0 10px 24px rgba(46, 39, 34, 0.1); }
.d-period-menu button { display: block; width: 100%; padding: 9px 12px; border: 0; border-radius: 8px; background: transparent; color: #4a423d; text-align: left; font-size: 14px; cursor: pointer; }
.d-period-menu button:hover, .d-period-menu button.active { background: #fbeee4; color: #c4693a; }
.d-chart { display: flex; gap: 14px; height: 270px; margin-top: 28px; }
.d-chart-y { display: flex; flex-direction: column; justify-content: space-between; padding-bottom: 28px; min-width: 24px; color: #a59c95; font-size: 13px; text-align: right; }
.d-chart-area { position: relative; flex: 1; min-width: 0; }
.d-chart-grid { position: absolute; inset: 8px 0 28px; display: flex; flex-direction: column; justify-content: space-between; }
.d-chart-grid span { display: block; width: 100%; border-top: 1px dashed #ece6df; }
.d-bars { position: absolute; inset: 0; display: grid; align-items: end; gap: 12px; }
.d-bar-item { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: flex-end; gap: 10px; }
.d-bar-wrap { width: 100%; height: calc(100% - 38px); display: flex; align-items: flex-end; justify-content: center; }
.d-bar { width: min(38px, 60%); min-height: 4px; border-radius: 5px 5px 0 0; background: #dc9468; transition: height 0.3s ease, background 0.2s ease; }
.d-bar:hover { background: #c97b4a; }
.d-bar-item > span { color: #a59c95; font-size: 13px; }
.d-ai-item { display: flex; align-items: center; gap: 16px; margin-top: 26px; }
.d-ai-icon { display: flex; flex-shrink: 0; align-items: center; justify-content: center; width: 50px; height: 50px; border-radius: 14px; background: #fbeee4; color: #d27a45; }
.d-ai-text { flex: 1; min-width: 0; }
.d-ai-text strong { display: block; overflow: hidden; font-size: 18px; font-weight: 500; text-overflow: ellipsis; white-space: nowrap; }
.d-ai-text span { display: block; margin-top: 3px; overflow: hidden; color: #8b827b; font-size: 15px; text-overflow: ellipsis; white-space: nowrap; }
.d-badge { flex-shrink: 0; padding: 6px 14px; border: 1px solid #f3dcb8; border-radius: 8px; background: #fff4e3; color: #b9722b; font-size: 14px; }
.d-badge.good { border-color: #cfe8d7; background: #e8f5ec; color: #237a45; }
.d-badge.bad { border-color: #f3cfcb; background: #fdecec; color: #b42318; }
.d-shops { display: flex; flex-direction: column; gap: 14px; margin-top: 24px; }
.d-shop { display: flex; align-items: center; gap: 18px; padding: 16px 20px; border: 1px solid #ece6df; border-radius: 16px; background: #fff; color: inherit; text-decoration: none; transition: border-color 0.15s ease, background 0.15s ease; }
.d-shop:hover { border-color: #e3c3ab; background: #fdfbf9; }
.d-shop-go { flex-shrink: 0; color: #c9b8aa; transition: color 0.15s ease, transform 0.15s ease; }
.d-shop:hover .d-shop-go { color: #c9562e; transform: translateX(2px); }
.d-thumb { display: flex; flex: 0 0 64px; align-items: center; justify-content: center; width: 64px; height: 64px; overflow: hidden; border-radius: 8px; background: #f3efeb; color: #a59c95; }
.d-thumb img { width: 100%; height: 100%; object-fit: cover; }
.d-shop-info { flex: 1; min-width: 0; }
.d-shop-info h4 { margin: 0; overflow: hidden; font-size: 19px; font-weight: 600; text-overflow: ellipsis; white-space: nowrap; }
.d-shop-info p { margin: 4px 0 0; overflow: hidden; color: #6f665f; font-size: 15px; text-overflow: ellipsis; white-space: nowrap; }
.d-shop-info small { display: block; margin-top: 3px; color: #a59c95; font-size: 14px; }
.d-pill { flex-shrink: 0; padding: 6px 14px; border-radius: 8px; font-size: 14px; font-weight: 500; }
.d-pill.on { border: 1px solid #cfe8d7; background: #e8f5ec; color: #237a45; }
.d-pill.off { border: 1px solid #e5dfd9; background: #f3efeb; color: #7d746d; }
.d-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; min-height: 120px; color: #a59c95; }
.d-empty p { margin: 0; font-size: 14px; }
@media (max-width: 1150px) { .d-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); } .d-grid { grid-template-columns: 1fr; } }
@media (max-width: 700px) { .d-head { flex-direction: column; } .d-stats { grid-template-columns: 1fr; } .d-card-head { flex-direction: column; } }
`

export default function DashboardStyles() {
  return <style dangerouslySetInnerHTML={{ __html: css }} />
}