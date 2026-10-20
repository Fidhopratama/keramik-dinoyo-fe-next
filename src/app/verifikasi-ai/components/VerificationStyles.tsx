const css = `
.v { display: flex; flex-direction: column; gap: 24px; width: 100%; color: #25211e; }
.v-head h2 { margin: 0; font-size: 30px; line-height: 1.2; font-weight: 700; letter-spacing: -0.02em; }
.v-head p { margin: 6px 0 0; color: #8b827b; font-size: 15px; }
.v-note { display: flex; align-items: flex-start; gap: 12px; padding: 14px 18px; border: 1px solid #f3dcb8; border-radius: 14px; background: #fff8ec; color: #8a5a1f; font-size: 14px; line-height: 1.5; }
.v-note svg { flex-shrink: 0; margin-top: 2px; }
.v-stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 20px; }
.v-stat { display: flex; align-items: center; gap: 16px; padding: 20px 22px; border: 1px solid #ece6df; border-radius: 20px; background: #fff; }
.v-stat-icon { display: flex; flex-shrink: 0; align-items: center; justify-content: center; width: 46px; height: 46px; border-radius: 14px; background: #fbeee4; color: #d27a45; }
.v-stat-icon.good { background: #e8f5ec; color: #237a45; }
.v-stat-icon.bad { background: #fdecec; color: #b42318; }
.v-stat-icon.wait { background: #fff4e3; color: #b9722b; }
.v-stat strong { display: block; font-size: 30px; line-height: 1; font-weight: 700; }
.v-stat span { display: block; margin-top: 6px; color: #8b827b; font-size: 14px; }
.v-card { padding: 28px; border: 1px solid #ece6df; border-radius: 20px; background: #fff; }
.v-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap; }
.v-toolbar h3 { margin: 0; font-size: 20px; font-weight: 700; }
.v-toolbar p { margin: 6px 0 0; color: #8b827b; font-size: 15px; }
.v-controls { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.v-search { display: flex; align-items: center; gap: 10px; width: 260px; height: 44px; padding: 0 14px; border: 1px solid #ece6df; border-radius: 12px; background: #fff; color: #a59c95; }
.v-search input { flex: 1; min-width: 0; border: 0; outline: none; background: transparent; color: #25211e; font-size: 14px; }
.v-search:focus-within { border-color: #c9562e; box-shadow: 0 0 0 3px rgba(201, 86, 46, 0.12); }
.v-tabs { display: flex; gap: 6px; padding: 4px; border: 1px solid #ece6df; border-radius: 12px; background: #faf8f6; }
.v-tabs button { padding: 8px 14px; border: 0; border-radius: 8px; background: transparent; color: #6f665f; font-size: 14px; cursor: pointer; }
.v-tabs button:hover { color: #25211e; }
.v-tabs button.active { background: #fff; color: #c4693a; font-weight: 600; box-shadow: 0 1px 3px rgba(46, 39, 34, 0.1); }
.v-error { margin-top: 20px; padding: 14px 18px; border-radius: 12px; background: #fdecec; color: #b42318; font-size: 14px; }
.v-table-wrap { margin-top: 24px; overflow-x: auto; border: 1px solid #ece6df; border-radius: 14px; }
.v-table { width: 100%; border-collapse: collapse; }
.v-table thead { background: #faf8f6; }
.v-table th { padding: 12px 16px; color: #8b827b; font-size: 12px; font-weight: 700; letter-spacing: 0.04em; text-align: left; text-transform: uppercase; white-space: nowrap; }
.v-table td { padding: 16px; border-top: 1px solid #f1ece7; color: #4a423d; font-size: 14px; vertical-align: middle; }
.v-tr { cursor: pointer; }
.v-tr:hover td { background: #fdfbf9; }
.v-name { display: flex; align-items: center; gap: 12px; min-width: 180px; }
.v-ico { display: flex; flex-shrink: 0; align-items: center; justify-content: center; width: 38px; height: 38px; border-radius: 10px; background: #fbeee4; color: #d27a45; }
.v-name strong { font-size: 15px; font-weight: 600; color: #25211e; }
.v-sum { max-width: 320px; overflow: hidden; color: #6f665f; text-overflow: ellipsis; white-space: nowrap; }
.v-score { width: 130px; }
.v-score small { display: block; margin-bottom: 6px; color: #8b827b; font-size: 12px; }
.v-bar { height: 8px; overflow: hidden; border-radius: 999px; background: #f1ece7; }
.v-bar i { display: block; height: 100%; border-radius: 999px; background: #dc9468; }
.v-date { color: #8b827b; white-space: nowrap; }
.v-badge { display: inline-block; min-width: 92px; padding: 5px 12px; border-radius: 8px; font-size: 13px; font-weight: 500; text-align: center; }
.v-badge.good { border: 1px solid #cfe8d7; background: #e8f5ec; color: #237a45; }
.v-badge.bad { border: 1px solid #f3cfcb; background: #fdecec; color: #b42318; }
.v-badge.wait { border: 1px solid #f3dcb8; background: #fff4e3; color: #b9722b; }
.v-detail td { background: #fdfbf9; padding: 16px 16px 20px 66px; font-size: 14px; line-height: 1.6; }
.v-detail p { margin: 0 0 8px; }
.v-detail small { color: #a59c95; font-size: 13px; }
.v-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; min-height: 220px; color: #a59c95; text-align: center; }
.v-empty strong { color: #4a423d; font-size: 18px; font-weight: 600; }
.v-empty p { margin: 0; max-width: 360px; font-size: 14px; line-height: 1.5; }
@media (max-width: 1150px) { .v-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 700px) { .v-stats { grid-template-columns: 1fr; } .v-search { width: 100%; } .v-detail td { padding-left: 16px; } }
`

export default function VerificationStyles() {
  return <style dangerouslySetInnerHTML={{ __html: css }} />
}