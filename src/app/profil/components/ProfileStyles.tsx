const css = `
.pf { display: flex; flex-direction: column; gap: 16px; width: 100%; max-width: 780px; color: #25211e; }
.pf-head h2 { margin: 0; font-size: 26px; line-height: 1.2; font-weight: 700; letter-spacing: -0.02em; }
.pf-head p { margin: 6px 0 0; color: #8b827b; font-size: 14px; }
.pf-toast { display: flex; align-items: center; gap: 8px; padding: 10px 14px; border-radius: 10px; font-size: 13px; }
.pf-toast.success { background: #e8f5ec; color: #237a45; }
.pf-toast.error { background: #fdecec; color: #b42318; }
.pf-summary { display: flex; align-items: center; gap: 16px; padding: 20px 24px; border: 1px solid #ece6df; border-radius: 16px; background: #fff; }
.pf-avatar { display: flex; flex-shrink: 0; align-items: center; justify-content: center; width: 64px; height: 64px; border-radius: 50%; background: #ecd2bf; color: #8a4d28; font-size: 26px; font-weight: 700; }
.pf-summary h3 { margin: 0; font-size: 20px; font-weight: 700; }
.pf-summary p { margin: 4px 0 0; color: #8b827b; font-size: 14px; }
.pf-tag { display: inline-block; margin-top: 8px; padding: 3px 10px; border-radius: 999px; background: #fbeee4; color: #c9562e; font-size: 12px; font-weight: 600; }
.pf-card { padding: 0 24px 22px; border: 1px solid #ece6df; border-radius: 16px; background: #fff; }
.pf-card-head { display: flex; align-items: center; gap: 14px; padding: 18px 0 14px; border-bottom: 1px solid #efe9e3; }
.pf-icon { display: flex; flex-shrink: 0; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 12px; background: #fbeee4; color: #c9562e; }
.pf-card-head h3 { margin: 0; font-size: 17px; font-weight: 700; }
.pf-card-head p { margin: 2px 0 0; color: #8b827b; font-size: 13px; }
.pf-body { display: flex; flex-direction: column; gap: 16px; padding-top: 18px; }
.pf-two { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
.pf-field { display: flex; flex-direction: column; gap: 6px; }
.pf-field span { font-size: 13px; font-weight: 600; }
.pf-field input { width: 100%; height: 42px; padding: 0 14px; border: 1px solid #e7e0d9; border-radius: 12px; background: #fff; color: #25211e; font-size: 14px; outline: none; }
.pf-field input::placeholder { color: #b3aba4; }
.pf-field input:focus { border-color: #c9562e; box-shadow: 0 0 0 3px rgba(201, 86, 46, 0.12); }
.pf-field input:disabled { background: #faf8f6; color: #8b827b; cursor: not-allowed; }
.pf-err { margin: 0; color: #b42318; font-size: 13px; }
.pf-actions { display: flex; justify-content: flex-end; gap: 10px; }
.pf-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.pf-row.line { padding-bottom: 16px; border-bottom: 1px solid #efe9e3; }
.pf-row strong { display: block; font-size: 15px; font-weight: 600; }
.pf-row p { margin: 3px 0 0; color: #8b827b; font-size: 13px; }
.pf-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; height: 40px; padding: 0 20px; border-radius: 10px; font-size: 14px; font-weight: 500; text-decoration: none; white-space: nowrap; cursor: pointer; }
.pf-btn.primary { border: 0; background: #c9562e; color: #fff; }
.pf-btn.primary:hover:not(:disabled) { background: #b24a27; }
.pf-btn.primary:disabled { opacity: 0.6; cursor: not-allowed; }
.pf-btn.outline { flex-shrink: 0; border: 1px solid #c9562e; background: #fff; color: #c9562e; }
.pf-btn.outline:hover { background: #fbeee4; }
.pf-btn.ghost { border: 1px solid #e7e0d9; background: #fff; color: #4a423d; }
.pf-btn.ghost:hover { background: #faf8f6; }
.pf-btn.danger { flex-shrink: 0; border: 1px solid #e6b3ad; background: #fff; color: #b42318; }
.pf-btn.danger:hover { background: #fdecec; }
@media (max-width: 700px) {
  .pf-two { grid-template-columns: 1fr; }
  .pf-card { padding: 0 16px 18px; }
  .pf-row { flex-direction: column; align-items: flex-start; }
}
`

export default function ProfileStyles() {
  return <style dangerouslySetInnerHTML={{ __html: css }} />
}