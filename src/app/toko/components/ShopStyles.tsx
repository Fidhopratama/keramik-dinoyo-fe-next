const css = `
.sh { display: flex; flex-direction: column; gap: 24px; width: 100%; color: #25211e; }
.sh-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; }
.sh-head h2 { margin: 0; font-size: 30px; line-height: 1.2; font-weight: 700; letter-spacing: -0.02em; }
.sh-head p { margin: 6px 0 0; color: #8b827b; font-size: 15px; }
.sh-btn { display: inline-flex; align-items: center; justify-content: center; gap: 8px; height: 42px; padding: 0 18px; border-radius: 10px; font-family: inherit; font-size: 14px; font-weight: 500; white-space: nowrap; cursor: pointer; }
.sh-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.sh-btn.primary { border: 0; background: #c9562e; color: #fff; }
.sh-btn.primary:hover:not(:disabled) { background: #b24a27; }
.sh-btn.ghost { border: 1px solid #e7e0d9; background: #fff; color: #4a423d; }
.sh-btn.ghost:hover:not(:disabled) { background: #faf8f6; }
.sh-btn.edit { border: 1px solid #e8c7aa; background: #fff; color: #c4693a; }
.sh-btn.edit:hover { background: #fbeee4; }
.sh-btn.remove { border: 1px solid #f0c9c4; background: #fff; color: #b42318; }
.sh-btn.remove:hover:not(:disabled) { background: #fdecec; }
.sh-alert { padding: 12px 16px; border-radius: 12px; font-size: 14px; white-space: pre-line; }
.sh-alert.success { background: #e8f5ec; color: #237a45; }
.sh-alert.error { background: #fdecec; color: #b42318; }
.sh-loading { padding: 40px 20px; color: #8b827b; text-align: center; }
.sh-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px; min-height: 260px; padding: 40px 20px; border: 1px solid #ece6df; border-radius: 20px; background: #fff; color: #a59c95; text-align: center; }
.sh-empty strong { color: #4a423d; font-size: 18px; font-weight: 600; }
.sh-empty p { margin: 0 0 6px; font-size: 14px; }
.sh-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; }
.sh-card { display: flex; flex-direction: column; overflow: hidden; border: 1px solid #ece6df; border-radius: 20px; background: #fff; }
.sh-card.highlight { border-color: #c9562e; box-shadow: 0 0 0 3px rgba(201, 86, 46, 0.18); }
.sh-card { transition: border-color 0.3s ease, box-shadow 0.3s ease; }
.sh-img { display: flex; align-items: center; justify-content: center; width: 100%; height: 200px; overflow: hidden; background: #f3efeb; color: #a59c95; }
.sh-img img { display: block; width: 100%; height: 100%; object-fit: cover; }
.sh-body { display: flex; flex: 1; flex-direction: column; gap: 12px; padding: 20px; }
.sh-title-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
.sh-name { margin: 0; font-size: 19px; font-weight: 700; }
.sh-badge { flex-shrink: 0; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; }
.sh-badge.on { background: #e8f5ec; color: #237a45; }
.sh-badge.off { background: #f3efeb; color: #7d746d; }
.sh-desc { display: -webkit-box; min-height: 45px; margin: 0; overflow: hidden; color: #6f665f; font-size: 14px; line-height: 1.6; -webkit-line-clamp: 2; line-clamp: 2; -webkit-box-orient: vertical; }
.sh-loc { display: flex; align-items: flex-start; gap: 8px; margin: 0; color: #6f665f; font-size: 14px; line-height: 1.5; }
.sh-loc svg { flex-shrink: 0; margin-top: 2px; color: #c9562e; }
.sh-links { display: flex; flex-wrap: wrap; gap: 8px; }
.sh-chip { padding: 4px 10px; border: 1px solid #ece6df; border-radius: 999px; color: #6f665f; font-size: 12px; text-decoration: none; }
.sh-chip:hover { border-color: #e3c3ab; color: #c4693a; }
.sh-actions { display: flex; gap: 10px; margin-top: auto; padding-top: 16px; border-top: 1px solid #f1ece7; }
.sh-actions .sh-btn { flex: 1; height: 40px; }
.sh-overlay { position: fixed; inset: 0; z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px; background: rgba(35, 25, 19, 0.48); }
.sh-modal { display: flex; flex-direction: column; width: 100%; max-width: 640px; max-height: 90vh; overflow: hidden; border-radius: 20px; background: #fff; }
.sh-modal-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; padding: 24px 28px 18px; border-bottom: 1px solid #f1ece7; }
.sh-modal-head h3 { margin: 0; font-size: 21px; font-weight: 700; }
.sh-modal-head p { margin: 5px 0 0; color: #8b827b; font-size: 13px; }
.sh-close { display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; border: 0; border-radius: 50%; background: #f5eee8; color: #6e5c50; cursor: pointer; }
.sh-close:disabled { opacity: 0.5; cursor: not-allowed; }
.sh-modal-body { display: flex; flex: 1; flex-direction: column; gap: 20px; padding: 24px 28px; overflow-y: auto; }
.sh-modal-foot { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 28px; border-top: 1px solid #f1ece7; background: #fff; }
.sh-field { display: flex; flex-direction: column; gap: 8px; }
.sh-field label { font-size: 13px; font-weight: 600; }
.sh-field input[type="text"], .sh-field textarea { width: 100%; box-sizing: border-box; padding: 0 14px; border: 1px solid #e7e0d9; border-radius: 12px; background: #fff; color: #25211e; font-family: inherit; font-size: 14px; outline: none; }
.sh-field input[type="text"] { height: 44px; }
.sh-field textarea { min-height: 96px; padding: 12px 14px; resize: vertical; }
.sh-field input[type="text"]:focus, .sh-field textarea:focus { border-color: #c9562e; box-shadow: 0 0 0 3px rgba(201, 86, 46, 0.12); }
.sh-two { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.sh-check { display: flex; align-items: center; gap: 10px; padding: 12px 14px; border: 1px solid #e7e0d9; border-radius: 12px; font-size: 14px; cursor: pointer; }
.sh-check input { width: 18px; height: 18px; accent-color: #c9562e; }
.sh-upload { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; height: 160px; overflow: hidden; border: 2px dashed #e0d6cc; border-radius: 14px; background: #faf8f6; color: #8b827b; font-size: 13px; cursor: pointer; }
.sh-upload:hover { border-color: #c9562e; }
.sh-upload img { display: block; width: 100%; height: 100%; object-fit: cover; }
.sh-upload input { display: none; }
.sh-help { color: #8b827b; font-size: 12px; }
@media (max-width: 1100px) { .sh-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 700px) { .sh-head { flex-direction: column; } .sh-grid { grid-template-columns: 1fr; } .sh-two { grid-template-columns: 1fr; } .sh-modal-body, .sh-modal-head, .sh-modal-foot { padding-left: 18px; padding-right: 18px; } }
`

export default function ShopStyles() {
  return <style dangerouslySetInnerHTML={{ __html: css }} />
}
