'use client'

export default function WorkshopStyles() {
  return (
    <style>{`
      .workshop-page {
        width: 100%;
        box-sizing: border-box;
      }

      .workshop-page *,
      .workshop-page *::before,
      .workshop-page *::after {
        box-sizing: border-box;
      }

      .workshop-page .workshop-heading {
        display: flex !important;
        justify-content: space-between !important;
        align-items: center !important;
        gap: 20px !important;
        margin-bottom: 28px !important;
      }

      .workshop-page .workshop-heading h1 {
        margin: 0 !important;
        color: #3d2b1f !important;
        font-size: 28px !important;
        font-weight: 700 !important;
      }

      .workshop-page .workshop-heading p {
        margin: 7px 0 0 !important;
        color: #8a7769 !important;
        font-size: 14px !important;
      }

      .workshop-page .workshop-add-button {
        border: none !important;
        background: #c87842 !important;
        color: #fff !important;
        padding: 12px 19px !important;
        min-height: 42px !important;
        border-radius: 9px !important;
        font-family: inherit !important;
        font-size: 14px !important;
        font-weight: 600 !important;
        cursor: pointer !important;
        transition: all .2s ease !important;
      }

      .workshop-page .workshop-add-button:hover {
        background: #ad6536 !important;
        transform: translateY(-1px) !important;
      }

      .workshop-page .workshop-toolbar {
        display: flex !important;
        align-items: center !important;
        gap: 14px !important;
        padding: 15px !important;
        margin-bottom: 24px !important;
        background: #fff !important;
        border: 1px solid #eee2d8 !important;
        border-radius: 13px !important;
      }

      .workshop-page .workshop-search {
        flex: 1 !important;
        position: relative !important;
        min-width: 0 !important;
      }

      .workshop-page .workshop-search-icon {
        position: absolute !important;
        left: 14px !important;
        top: 50% !important;
        transform: translateY(-50%) !important;
        color: #9b8d82 !important;
        font-size: 20px !important;
        pointer-events: none !important;
      }

      .workshop-page .workshop-search input {
        width: 100% !important;
        height: 44px !important;
        padding: 0 15px 0 42px !important;
        border: 1px solid #ded2c9 !important;
        border-radius: 9px !important;
        outline: none !important;
        font-family: inherit !important;
        font-size: 14px !important;
        background: #fff !important;
      }

      .workshop-page .workshop-search input:focus {
        border-color: #c87842 !important;
        box-shadow: 0 0 0 3px rgba(200,120,66,.10) !important;
      }

      .workshop-page .workshop-filter {
        height: 44px !important;
        min-width: 190px !important;
        padding: 0 13px !important;
        border: 1px solid #ded2c9 !important;
        border-radius: 9px !important;
        background: #fff !important;
        color: #4d3b2f !important;
        font-family: inherit !important;
        font-size: 14px !important;
        outline: none !important;
      }

      .workshop-page .workshop-grid {
        display: grid !important;
        grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        gap: 24px !important;
      }

      .workshop-page .workshop-card {
        display: flex !important;
        flex-direction: column !important;
        min-width: 0 !important;
        overflow: hidden !important;
        background: #fff !important;
        border: 1px solid #eee2d8 !important;
        border-radius: 15px !important;
        box-shadow: 0 4px 14px rgba(74,52,39,.06) !important;
        transition: all .2s ease !important;
      }

      .workshop-page .workshop-card:hover {
        transform: translateY(-3px) !important;
        box-shadow: 0 9px 23px rgba(74,52,39,.10) !important;
      }

      .workshop-page .workshop-image {
        position: relative !important;
        width: 100% !important;
        height: 235px !important;
        overflow: hidden !important;
        background: #f5eee8 !important;
      }

      .workshop-page .workshop-image img {
        display: block !important;
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
      }

      .workshop-page .workshop-image-placeholder {
        width: 100% !important;
        height: 100% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        color: #a79587 !important;
        font-size: 40px !important;
        background: #f5eee8 !important;
      }

      .workshop-page .workshop-status {
        position: absolute !important;
        top: 13px !important;
        right: 13px !important;
        padding: 6px 11px !important;
        border-radius: 30px !important;
        background: #fff !important;
        font-size: 12px !important;
        font-weight: 700 !important;
        box-shadow: 0 3px 10px rgba(0,0,0,.08) !important;
        z-index: 2 !important;
      }

      .workshop-page .workshop-status.upcoming {
        color: #2768e8 !important;
      }

      .workshop-page .workshop-status.ongoing {
        color: #198754 !important;
      }

      .workshop-page .workshop-status.completed {
        color: #777 !important;
      }

      .workshop-page .workshop-status.cancelled {
        color: #d9534f !important;
      }

      .workshop-page .workshop-content {
        padding: 21px !important;
      }

      .workshop-page .workshop-content h3 {
        margin: 0 !important;
        color: #3d2b1f !important;
        font-size: 19px !important;
        font-weight: 700 !important;
        line-height: 1.35 !important;
        overflow-wrap: anywhere !important;
      }

      .workshop-page .workshop-description {
        margin: 9px 0 19px !important;
        min-height: 44px !important;
        color: #806f62 !important;
        font-size: 14px !important;
        line-height: 1.55 !important;
        overflow-wrap: anywhere !important;
      }

      .workshop-page .workshop-info {
        display: flex !important;
        flex-direction: column !important;
        gap: 11px !important;
        padding-bottom: 18px !important;
        border-bottom: 1px solid #eee7e1 !important;
      }

      .workshop-page .workshop-info-row {
        display: flex !important;
        align-items: center !important;
        gap: 11px !important;
        color: #5f554e !important;
        min-width: 0 !important;
      }

      .workshop-page .workshop-info-icon {
        width: 22px !important;
        flex: 0 0 22px !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        color: #c87842 !important;
      }

      .workshop-page .workshop-info-row strong {
        min-width: 0 !important;
        font-size: 13px !important;
        font-weight: 500 !important;
        line-height: 1.4 !important;
        overflow-wrap: anywhere !important;
      }

      .workshop-page .workshop-actions {
        display: grid !important;
        grid-template-columns: 1fr 1fr !important;
        gap: 10px !important;
        width: 100% !important;
        margin-top: 18px !important;
      }

      .workshop-page .workshop-edit-btn,
      .workshop-page .workshop-delete-btn {
        appearance: none !important;
        -webkit-appearance: none !important;
        width: 100% !important;
        height: 42px !important;
        min-height: 42px !important;
        margin: 0 !important;
        padding: 0 15px !important;
        border-radius: 9px !important;
        font-family: inherit !important;
        font-size: 14px !important;
        font-weight: 600 !important;
        line-height: 1 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 7px !important;
        cursor: pointer !important;
        transition: all .2s ease !important;
      }

      .workshop-page .workshop-edit-btn {
        background: #fff7ed !important;
        color: #c87842 !important;
        border: 1px solid #e8c7aa !important;
      }

      .workshop-page .workshop-edit-btn:hover:not(:disabled) {
        background: #c87842 !important;
        color: #fff !important;
        border-color: #c87842 !important;
        transform: translateY(-1px) !important;
        box-shadow: 0 4px 10px rgba(200,120,66,.18) !important;
      }

      .workshop-page .workshop-delete-btn {
        background: #fff5f5 !important;
        color: #d9534f !important;
        border: 1px solid #edc4c4 !important;
      }

      .workshop-page .workshop-delete-btn:hover:not(:disabled) {
        background: #d9534f !important;
        color: #fff !important;
        border-color: #d9534f !important;
        transform: translateY(-1px) !important;
        box-shadow: 0 4px 10px rgba(217,83,79,.18) !important;
      }

      .workshop-page .workshop-edit-btn:disabled,
      .workshop-page .workshop-delete-btn:disabled {
        opacity: .55 !important;
        cursor: not-allowed !important;
        transform: none !important;
        box-shadow: none !important;
      }

      .workshop-page .workshop-button-icon {
        font-size: 15px !important;
        line-height: 1 !important;
      }

      .workshop-page .workshop-empty {
        grid-column: 1 / -1 !important;
        padding: 60px 25px !important;
        text-align: center !important;
        background: #fff !important;
        border: 1px solid #eee2d8 !important;
        border-radius: 14px !important;
      }

      .workshop-page .workshop-empty-icon {
        margin-bottom: 12px !important;
        color: #b5a69a !important;
        font-size: 40px !important;
      }

      .workshop-page .workshop-empty h3 {
        margin: 0 0 8px !important;
        color: #3d2b1f !important;
      }

      .workshop-page .workshop-empty p {
        margin: 0 0 18px !important;
        color: #806f62 !important;
      }

      .workshop-page .workshop-error {
        margin-bottom: 20px !important;
        padding: 13px 16px !important;
        border-radius: 9px !important;
        background: #fff1f1 !important;
        border: 1px solid #efc2c2 !important;
        color: #c0392b !important;
      }

      .workshop-page .workshop-modal-overlay {
        position: fixed !important;
        inset: 0 !important;
        z-index: 99999 !important;
        padding: 20px !important;
        background: rgba(35,25,19,.55) !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        overflow-y: auto !important;
      }

      .workshop-page .workshop-modal {
        width: min(720px, 100%) !important;
        max-height: 92vh !important;
        overflow-y: auto !important;
        padding: 25px !important;
        background: #fff !important;
        border-radius: 16px !important;
        box-shadow: 0 20px 55px rgba(0,0,0,.2) !important;
      }

      .workshop-page .workshop-modal-header {
        display: flex !important;
        align-items: center !important;
        justify-content: space-between !important;
        gap: 15px !important;
        margin-bottom: 22px !important;
      }

      .workshop-page .workshop-modal-header h2 {
        margin: 0 !important;
        color: #3d2b1f !important;
        font-size: 21px !important;
      }

      .workshop-page .workshop-modal-header p {
        margin: 5px 0 0 !important;
        color: #8a7769 !important;
        font-size: 13px !important;
      }

      .workshop-page .workshop-close {
        width: 35px !important;
        height: 35px !important;
        flex: 0 0 35px !important;
        border: none !important;
        border-radius: 50% !important;
        background: #f5eee8 !important;
        color: #6e5c50 !important;
        font-size: 22px !important;
        cursor: pointer !important;
      }

      .workshop-page .workshop-form-group {
        min-width: 0 !important;
        margin-bottom: 16px !important;
      }

      .workshop-page .workshop-form-group label {
        display: block !important;
        margin-bottom: 7px !important;
        color: #4d3b2f !important;
        font-size: 13px !important;
        font-weight: 600 !important;
      }

      .workshop-page .workshop-form-group label span {
        color: #d9534f !important;
        margin-left: 3px !important;
      }

      .workshop-page .workshop-form-group input,
      .workshop-page .workshop-form-group textarea,
      .workshop-page .workshop-form-group select {
        width: 100% !important;
        box-sizing: border-box !important;
        padding: 10px 12px !important;
        border: 1px solid #ded2c9 !important;
        border-radius: 8px !important;
        outline: none !important;
        background: #fff !important;
        color: #3d2b1f !important;
        font-family: inherit !important;
        font-size: 14px !important;
      }

      .workshop-page .workshop-form-group textarea {
        min-height: 95px !important;
        resize: vertical !important;
      }

      .workshop-page .workshop-form-group input:focus,
      .workshop-page .workshop-form-group textarea:focus,
      .workshop-page .workshop-form-group select:focus {
        border-color: #c87842 !important;
        box-shadow: 0 0 0 3px rgba(200,120,66,.10) !important;
      }

      .workshop-page .workshop-form-group input:disabled,
      .workshop-page .workshop-form-group textarea:disabled,
      .workshop-page .workshop-form-group select:disabled {
        opacity: .65 !important;
        cursor: not-allowed !important;
      }

      .workshop-page .workshop-form-row {
        display: grid !important;
        grid-template-columns: 1fr 1fr !important;
        gap: 14px !important;
      }

      .workshop-page .workshop-file {
        display: none !important;
      }

      .workshop-page .workshop-upload {
        width: 100% !important;
        min-height: 180px !important;
        padding: 18px !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 7px !important;
        border: 1.5px dashed #d8d0c9 !important;
        border-radius: 11px !important;
        background: #faf9f7 !important;
        cursor: pointer !important;
        overflow: hidden !important;
      }

      .workshop-page .workshop-upload:hover {
        border-color: #c87842 !important;
        background: #fffaf5 !important;
      }

      .workshop-page .workshop-upload img {
        width: 100% !important;
        height: 210px !important;
        object-fit: cover !important;
        border-radius: 8px !important;
      }

      .workshop-page .workshop-upload-icon {
        width: 44px !important;
        height: 44px !important;
        border-radius: 50% !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        background: #fff0e4 !important;
        color: #c87842 !important;
        font-size: 22px !important;
      }

      .workshop-page .workshop-upload strong {
        color: #3d2b1f !important;
        font-size: 14px !important;
      }

      .workshop-page .workshop-upload small {
        color: #999 !important;
        font-size: 12px !important;
        text-align: center !important;
      }

      .workshop-page .workshop-modal-actions {
        display: flex !important;
        justify-content: flex-end !important;
        gap: 10px !important;
        margin-top: 22px !important;
      }

      .workshop-page .workshop-cancel,
      .workshop-page .workshop-save {
        min-height: 42px !important;
        padding: 0 18px !important;
        border-radius: 9px !important;
        font-family: inherit !important;
        font-size: 14px !important;
        font-weight: 600 !important;
        cursor: pointer !important;
      }

      .workshop-page .workshop-cancel {
        background: #fff !important;
        color: #5f554e !important;
        border: 1px solid #ddd5ce !important;
      }

      .workshop-page .workshop-save {
        background: #c87842 !important;
        color: #fff !important;
        border: 1px solid #c87842 !important;
      }

      .workshop-page .workshop-save:hover:not(:disabled) {
        background: #ad6536 !important;
        border-color: #ad6536 !important;
      }

      .workshop-page .workshop-cancel:disabled,
      .workshop-page .workshop-save:disabled {
        opacity: .55 !important;
        cursor: not-allowed !important;
      }

      .workshop-page .workshop-loading {
        padding: 30px !important;
        color: #806f62 !important;
      }

      @media (max-width: 900px) {
        .workshop-page .workshop-grid {
          grid-template-columns: 1fr !important;
        }
      }

      @media (max-width: 650px) {
        .workshop-page .workshop-heading {
          flex-direction: column !important;
          align-items: flex-start !important;
        }

        .workshop-page .workshop-toolbar {
          flex-direction: column !important;
          align-items: stretch !important;
        }

        .workshop-page .workshop-filter {
          width: 100% !important;
        }

        .workshop-page .workshop-form-row {
          grid-template-columns: 1fr !important;
          gap: 0 !important;
        }

        .workshop-page .workshop-actions {
          grid-template-columns: 1fr !important;
        }

        .workshop-page .workshop-modal {
          padding: 18px !important;
        }

        .workshop-page .workshop-modal-overlay {
          padding: 10px !important;
          align-items: flex-start !important;
        }

        .workshop-page .workshop-modal-actions {
          flex-direction: column-reverse !important;
        }

        .workshop-page .workshop-cancel,
        .workshop-page .workshop-save {
          width: 100% !important;
        }
      }
    `}</style>
  )
}