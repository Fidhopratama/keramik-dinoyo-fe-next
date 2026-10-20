const css = `
.pr { display: flex; flex-direction: column; gap: 20px; width: 100%; color: #25211e; }
.pr-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; }
.pr-head h2 { margin: 0; font-size: 30px; line-height: 1.2; font-weight: 700; letter-spacing: -0.02em; }
.pr-head p { margin: 6px 0 0; color: #8b827b; font-size: 15px; }
.pr-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; height: 42px; padding: 0 18px; border-radius: 10px; font-family: inherit; font-size: 14px; font-weight: 500; white-space: nowrap; cursor: pointer; }
.pr-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.pr-btn.primary { border: 0; background: #c9562e; color: #fff; }
.pr-btn.primary:hover:not(:disabled) { background: #b24a27; }
.pr-btn.ghost { border: 1px solid #e7e0d9; background: #fff; color: #4a423d; }
.pr-btn.ghost:hover:not(:disabled) { background: #faf8f6; }
.pr-btn.danger { border: 0; background: #d92d20; color: #fff; }
.pr-btn.danger:hover:not(:disabled) { background: #b42318; }
.pr-btn.edit { border: 1px solid #e8c7aa; background: #fff7ed; color: #c4693a; }
.pr-btn.edit:hover { background: #fbeee4; }
.pr-btn.remove { border: 1px solid #f0c9c4; background: #fff5f5; color: #b42318; }
.pr-btn.remove:hover:not(:disabled) { background: #fdecec; }
.pr-toolbar { display: flex; gap: 10px; width: 100%; max-width: 560px; }
.pr-search { display: flex; flex: 1; align-items: center; gap: 10px; height: 44px; padding: 0 14px; border: 1px solid #ece6df; border-radius: 12px; background: #fff; color: #a59c95; }
.pr-search input { flex: 1; min-width: 0; border: 0; outline: none; background: transparent; color: #25211e; font-family: inherit; font-size: 14px; }
.pr-search:focus-within { border-color: #c9562e; box-shadow: 0 0 0 3px rgba(201, 86, 46, 0.12); }
.pr-toolbar .pr-btn { height: 44px; }
.pr-error { padding: 12px 16px; border-radius: 12px; background: #fdecec; color: #b42318; font-size: 14px; white-space: pre-line; }
.pr-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; min-height: 260px; padding: 40px 20px; border: 1px solid #ece6df; border-radius: 20px; background: #fff; color: #a59c95; text-align: center; }
.pr-empty strong { color: #4a423d; font-size: 18px; font-weight: 600; }
.pr-empty p { margin: 0 0 6px; font-size: 14px; }
.pr-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; }
.pr-card { display: flex; flex-direction: column; overflow: hidden; border: 1px solid #ece6df; border-radius: 20px; background: #fff; }
.pr-img { display: flex; align-items: center; justify-content: center; width: 100%; height: 210px; overflow: hidden; background: #f3efeb; color: #a59c95; font-size: 14px; }
.pr-img img { display: block; width: 100%; height: 100%; object-fit: cover; }
.pr-body { display: flex; flex: 1; flex-direction: column; padding: 20px; }
.pr-title-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
.pr-title-row h3 { margin: 0; font-size: 18px; font-weight: 700; }
.pr-badge { flex-shrink: 0; padding: 5px 12px; border-radius: 8px; font-size: 13px; font-weight: 500; }
.pr-badge.on { border: 1px solid #cfe8d7; background: #e8f5ec; color: #237a45; }
.pr-badge.off { border: 1px solid #f3cfcb; background: #fdecec; color: #b42318; }
.pr-shop { margin: 8px 0 0; color: #8b827b; font-size: 14px; }
.pr-desc { flex: 1; min-height: 44px; margin: 12px 0 0; color: #6f665f; font-size: 14px; line-height: 1.6; }
.pr-meta { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 16px; }
.pr-meta div { padding: 12px; border-radius: 12px; background: #faf8f6; }
.pr-meta span { display: block; margin-bottom: 6px; color: #8b827b; font-size: 12px; }
.pr-meta strong { font-size: 15px; }
.pr-actions { display: flex; gap: 10px; margin-top: 18px; }
.pr-actions .pr-btn { flex: 1; height: 40px; }
.pr-overlay { position: fixed; inset: 0; z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px; background: rgba(35, 25, 19, 0.48); }
.pr-modal { width: 100%; max-width: 640px; max-height: 90vh; overflow-y: auto; padding: 26px; border-radius: 20px; background: #fff; }
.pr-modal.small { max-width: 420px; }
.pr-modal-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; margin-bottom: 20px; }
.pr-modal-head h3 { margin: 0; font-size: 21px; font-weight: 700; }
.pr-modal-head p { margin: 5px 0 0; color: #8b827b; font-size: 13px; }
.pr-close { display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; border: 0; border-radius: 50%; background: #f5eee8; color: #6e5c50; cursor: pointer; }
.pr-close:disabled { opacity: 0.5; cursor: not-allowed; }
.pr-field { display: flex; flex-direction: column; gap: 7px; margin-bottom: 16px; }
.pr-field label { font-size: 13px; font-weight: 600; }
.pr-field input, .pr-field select, .pr-field textarea { width: 100%; box-sizing: border-box; padding: 0 14px; border: 1px solid #e7e0d9; border-radius: 12px; background: #fff; color: #25211e; font-family: inherit; font-size: 14px; outline: none; }
.pr-field input, .pr-field select { height: 42px; }
.pr-field input[type="file"] { padding: 8px 10px; }
.pr-field textarea { min-height: 90px; padding: 10px 14px; resize: vertical; }
.pr-field input:focus, .pr-field select:focus, .pr-field textarea:focus { border-color: #c9562e; box-shadow: 0 0 0 3px rgba(201, 86, 46, 0.12); }
.pr-help { color: #8b827b; font-size: 12px; }
.pr-two { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
.pr-preview { width: 100%; height: 190px; margin-top: 4px; overflow: hidden; border-radius: 12px; background: #f3efeb; }
.pr-preview img { display: block; width: 100%; height: 100%; object-fit: cover; }
.pr-form-error { margin-bottom: 14px; padding: 10px 14px; border-radius: 10px; background: #fdecec; color: #b42318; font-size: 13px; white-space: pre-line; }
.pr-modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 22px; }
.pr-confirm-text { margin: 0 0 20px; color: #6f665f; font-size: 14px; line-height: 1.6; }
@media (max-width: 1100px) { .pr-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 700px) { .pr-head { flex-direction: column; } .pr-grid { grid-template-columns: 1fr; } .pr-two { grid-template-columns: 1fr; } }
`

export default function ProductStyles() {
  return <style dangerouslySetInnerHTML={{ __html: css }} />
}
