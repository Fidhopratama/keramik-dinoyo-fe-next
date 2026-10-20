const css = `
.st { display: flex; flex-direction: column; gap: 16px; width: 100%; max-width: 780px; color: #25211e; }
.st-head h2 { margin: 0; font-size: 26px; line-height: 1.2; font-weight: 700; letter-spacing: -0.02em; }
.st-head p { margin: 6px 0 0; color: #8b827b; font-size: 14px; }
.st-head a { color: #c9562e; text-decoration: none; }
.st-head a:hover { text-decoration: underline; }
.st-toast { display: flex; align-items: center; gap: 8px; padding: 10px 14px; border-radius: 10px; font-size: 13px; }
.st-toast.success { background: #e8f5ec; color: #237a45; }
.st-toast.error { background: #fdecec; color: #b42318; }
.st-card { padding: 0 24px 22px; border: 1px solid #ece6df; border-radius: 16px; background: #fff; }
.st-card-head { display: flex; align-items: center; gap: 14px; padding: 18px 0 14px; border-bottom: 1px solid #efe9e3; }
.st-icon { display: flex; flex-shrink: 0; align-items: center; justify-content: center; width: 40px; height: 40px; border-radius: 12px; background: #fbeee4; color: #c9562e; }
.st-card-head h3 { margin: 0; font-size: 17px; font-weight: 700; }
.st-card-head p { margin: 2px 0 0; color: #8b827b; font-size: 13px; }
.st-body { display: flex; flex-direction: column; gap: 16px; padding-top: 18px; }
.st-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; }
.st-row.line { padding-bottom: 16px; border-bottom: 1px solid #efe9e3; }
.st-row.sub { padding-left: 14px; }
.st-row strong { display: block; font-size: 15px; font-weight: 600; }
.st-row.sub strong { font-size: 14px; font-weight: 500; }
.st-row p { margin: 3px 0 0; color: #8b827b; font-size: 13px; }
.st-select { width: 190px; height: 42px; flex-shrink: 0; padding: 0 14px; border: 1px solid #e7e0d9; border-radius: 12px; background: #fff; color: #25211e; font-size: 14px; outline: none; cursor: pointer; }
.st-select:focus { border-color: #c9562e; box-shadow: 0 0 0 3px rgba(201, 86, 46, 0.12); }
.st-toggle { position: relative; flex-shrink: 0; width: 44px; height: 24px; padding: 0; border: 0; border-radius: 999px; background: #d9d2cb; cursor: pointer; transition: background 0.2s ease; }
.st-toggle span { position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; border-radius: 50%; background: #fff; transition: transform 0.2s ease; }
.st-toggle.on { background: #c9562e; }
.st-toggle.on span { transform: translateX(20px); }
.st-toggle:disabled { opacity: 0.45; cursor: not-allowed; }
.st-status { display: inline-flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; }
.st-dot { width: 10px; height: 10px; border-radius: 50%; background: #d9d2cb; }
.st-dot.ok { background: #2f9e5b; }
.st-dot.fail { background: #d92d20; }
.st-dot.checking { background: #e0a43a; }
.st-info { display: grid; grid-template-columns: 130px 1fr; gap: 8px 16px; margin: 0; padding-top: 16px; border-top: 1px solid #efe9e3; font-size: 13px; }
.st-info dt { color: #8b827b; }
.st-info dd { margin: 0; font-weight: 500; }
.st-actions { display: flex; justify-content: flex-end; }
.st-btn { display: inline-flex; align-items: center; justify-content: center; height: 40px; padding: 0 20px; border-radius: 10px; font-size: 14px; font-weight: 500; white-space: nowrap; cursor: pointer; }
.st-btn.primary { border: 0; background: #c9562e; color: #fff; }
.st-btn.primary:hover { background: #b24a27; }
.st-btn.outline { flex-shrink: 0; border: 1px solid #c9562e; background: #fff; color: #c9562e; }
.st-btn.outline:hover { background: #fbeee4; }
@media (max-width: 700px) {
  .st-card { padding: 0 16px 18px; }
  .st-row { flex-direction: column; align-items: flex-start; }
  .st-select { width: 100%; }
  .st-info { grid-template-columns: 1fr; gap: 2px; }
}
`

export default function SettingsStyles() {
  return <style dangerouslySetInnerHTML={{ __html: css }} />
}