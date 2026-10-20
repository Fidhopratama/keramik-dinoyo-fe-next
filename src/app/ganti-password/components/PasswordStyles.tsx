const css = `
.p { display: flex; flex-direction: column; gap: 16px; width: 100%; max-width: 560px; color: #25211e; }
.p-back { display: inline-flex; align-items: center; gap: 6px; width: fit-content; color: #8b827b; font-size: 13px; text-decoration: none; }
.p-back:hover { color: #c9562e; }
.p-head h2 { margin: 0; font-size: 26px; line-height: 1.2; font-weight: 700; letter-spacing: -0.02em; }
.p-head p { margin: 6px 0 0; color: #8b827b; font-size: 14px; }
.p-card { padding: 0 24px 24px; border: 1px solid #ece6df; border-radius: 16px; background: #fff; }
.p-card-head { display: flex; align-items: center; gap: 14px; padding: 18px 0 14px; border-bottom: 1px solid #efe9e3; }
.p-icon { display: flex; flex-shrink: 0; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 12px; background: #fbeee4; color: #c9562e; }
.p-card-head h3 { margin: 0; font-size: 17px; font-weight: 700; }
.p-card-head p { margin: 2px 0 0; color: #8b827b; font-size: 13px; }
.p-form { display: flex; flex-direction: column; gap: 16px; padding-top: 18px; }
.p-field { display: flex; flex-direction: column; gap: 6px; }
.p-field label { font-size: 13px; font-weight: 600; }
.p-input { position: relative; }
.p-input input { width: 100%; height: 42px; padding: 0 44px 0 14px; border: 1px solid #e7e0d9; border-radius: 12px; background: #fff; color: #25211e; font-size: 14px; outline: none; }
.p-input input:focus { border-color: #c9562e; box-shadow: 0 0 0 3px rgba(201, 86, 46, 0.12); }
.p-input input.bad { border-color: #d92d20; }
.p-eye { position: absolute; top: 0; right: 0; display: flex; align-items: center; justify-content: center; width: 42px; height: 42px; border: 0; background: transparent; color: #8b827b; cursor: pointer; }
.p-eye:hover { color: #c9562e; }
.p-err { margin: 0; color: #b42318; font-size: 12px; }
.p-meter { display: flex; align-items: center; gap: 10px; }
.p-meter-bar { flex: 1; height: 6px; overflow: hidden; border-radius: 999px; background: #f1ece7; }
.p-meter-bar i { display: block; height: 100%; border-radius: 999px; transition: width 0.2s ease, background 0.2s ease; }
.p-meter span { width: 56px; font-size: 12px; font-weight: 600; text-align: right; }
.p-rules { display: flex; flex-direction: column; gap: 4px; margin: 0; padding: 0; list-style: none; font-size: 12px; color: #a59c95; }
.p-rules li { display: flex; align-items: center; gap: 6px; }
.p-rules li.ok { color: #237a45; }
.p-toast { display: flex; align-items: center; gap: 8px; padding: 10px 14px; border-radius: 10px; font-size: 13px; }
.p-toast.success { background: #e8f5ec; color: #237a45; }
.p-toast.error { background: #fdecec; color: #b42318; }
.p-actions { display: flex; justify-content: flex-end; gap: 10px; padding-top: 4px; }
.p-btn { display: inline-flex; align-items: center; justify-content: center; height: 40px; padding: 0 20px; border-radius: 10px; font-size: 14px; font-weight: 500; text-decoration: none; cursor: pointer; }
.p-btn.primary { border: 0; background: #c9562e; color: #fff; }
.p-btn.primary:hover:not(:disabled) { background: #b24a27; }
.p-btn.primary:disabled { opacity: 0.6; cursor: not-allowed; }
.p-btn.ghost { border: 1px solid #e7e0d9; background: #fff; color: #4a423d; }
.p-btn.ghost:hover { background: #faf8f6; }
@media (max-width: 700px) { .p-card { padding: 0 16px 18px; } }
`

export default function PasswordStyles() {
  return <style dangerouslySetInnerHTML={{ __html: css }} />
}
