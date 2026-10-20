'use client'

export default function ProductStyles() {
  return (
    <style jsx global>{`
      .page-container {
        width: 100%;
      }

      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 20px;
        margin-bottom: 22px;
      }

      .page-header h1 {
        margin: 0;
        color: #2f2119;
        font-size: 28px;
        font-weight: 700;
      }

      .page-header p {
        margin: 7px 0 0;
        color: #766458;
        font-size: 14px;
      }

      .primary-button {
        border: none;
        background: #c87842;
        color: #fff;
        padding: 11px 18px;
        border-radius: 9px;
        font-size: 14px;
        font-weight: 600;
        font-family: inherit;
        cursor: pointer;
      }

      .primary-button:hover {
        background: #ad6333;
      }

      .primary-button:disabled,
      .secondary-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .product-toolbar {
        display: flex;
        gap: 10px;
        width: 100%;
        max-width: 560px;
        margin-bottom: 24px;
      }

      .product-toolbar input {
        flex: 1;
        min-width: 0;
        height: 50px;
        box-sizing: border-box;
        border: 1px solid #d9d1cb;
        border-radius: 9px;
        padding: 0 14px;
        font-family: inherit;
        font-size: 15px;
        outline: none;
      }

      .product-toolbar input:focus,
      .form-group input:focus,
      .form-group select:focus,
      .form-group textarea:focus {
        border-color: #c87842;
        box-shadow: 0 0 0 3px rgba(200, 120, 66, 0.12);
      }

      .secondary-button {
        min-height: 40px;
        padding: 0 16px;
        background: #fff;
        color: #4d3b2f;
        border: 1px solid #d9d1cb;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        font-family: inherit;
        cursor: pointer;
      }

      .secondary-button:hover {
        background: #faf5f0;
      }

      .product-toolbar .secondary-button {
        height: 50px;
      }

      .error-box {
        margin-bottom: 20px;
        padding: 12px 15px;
        border-radius: 9px;
        background: #fff1f1;
        border: 1px solid #efc2c2;
        color: #c0392b;
        font-size: 14px;
        white-space: pre-line;
      }

      .loading-box,
      .empty-box {
        background: #fff;
        border: 1px solid #eee2d8;
        border-radius: 14px;
        padding: 60px 20px;
        text-align: center;
        color: #8a7769;
      }

      .empty-box h3 {
        margin: 0 0 8px;
        color: #3d2b1f;
      }

      .empty-box p {
        margin: 0 0 20px;
      }

      .product-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 24px;
      }

      .product-card {
        min-width: 0;
        background: #fff;
        border: 1px solid #eee2d8;
        border-radius: 15px;
        overflow: hidden;
        box-shadow: 0 4px 14px rgba(74, 52, 39, 0.06);
      }

      .product-image {
        width: 100%;
        height: 225px;
        background: #f5f0ec;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .product-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }

      .product-image-placeholder {
        color: #a39890;
        font-size: 14px;
      }

      .product-content {
        padding: 20px;
      }

      .product-title-row {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 12px;
      }

      .product-title-row h3 {
        margin: 0;
        color: #2f2119;
        font-size: 18px;
        font-weight: 700;
        overflow-wrap: anywhere;
      }

      .status-badge {
        flex-shrink: 0;
        padding: 7px 11px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
      }

      .status-badge.active {
        background: #dcf8e7;
        color: #16834a;
      }

      .status-badge.inactive {
        background: #fbecec;
        color: #c0392b;
      }

      .product-shop {
        margin: 10px 0 0;
        color: #766458;
        font-size: 14px;
      }

      .product-description {
        margin: 13px 0 0;
        color: #766458;
        font-size: 14px;
        line-height: 1.6;
        min-height: 45px;
        overflow-wrap: anywhere;
      }

      .product-meta {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
        margin-top: 18px;
      }

      .product-meta > div {
        min-width: 0;
        background: #faf7f4;
        border-radius: 9px;
        padding: 13px 12px;
      }

      .product-meta span {
        display: block;
        color: #8a7769;
        font-size: 13px;
        margin-bottom: 7px;
      }

      .product-meta strong {
        display: block;
        color: #2f2119;
        font-size: 14px;
        overflow-wrap: anywhere;
      }

      .product-actions {
        display: flex;
        gap: 10px;
        margin-top: 22px;
      }

      .edit-product-button,
      .delete-product-button {
        flex: 1;
        min-width: 0;
        height: 40px;
        border-radius: 9px;
        font-size: 14px;
        font-weight: 600;
        font-family: inherit;
        cursor: pointer;
      }

      .edit-product-button {
        background: #fff7ed;
        color: #b96a36;
        border: 1px solid #e8c7aa;
      }

      .edit-product-button:hover {
        background: #ffeddc;
      }

      .delete-product-button {
        background: #fff5f5;
        color: #d9534f;
        border: 1px solid #edc4c4;
      }

      .delete-product-button:hover {
        background: #ffe8e8;
      }

      .delete-product-button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .modal-overlay {
        position: fixed;
        inset: 0;
        z-index: 9999;
        background: rgba(35, 25, 19, 0.48);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
      }

      .modal-card {
        width: 100%;
        max-width: 650px;
        max-height: 90vh;
        overflow-y: auto;
        background: #fff;
        border-radius: 16px;
        padding: 25px;
        box-sizing: border-box;
      }

      .modal-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 20px;
        margin-bottom: 22px;
      }

      .modal-header h2 {
        margin: 0;
        color: #3d2b1f;
        font-size: 21px;
      }

      .modal-header p {
        margin: 5px 0 0;
        color: #8a7769;
        font-size: 13px;
      }

      .modal-close {
        flex-shrink: 0;
        width: 34px;
        height: 34px;
        border: none;
        border-radius: 50%;
        background: #f5eee8;
        color: #6e5c50;
        font-size: 22px;
        cursor: pointer;
      }

      .modal-close:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .form-group {
        margin-bottom: 16px;
      }

      .form-group label {
        display: block;
        margin-bottom: 7px;
        color: #4d3b2f;
        font-size: 13px;
        font-weight: 600;
      }

      .form-group input,
      .form-group select,
      .form-group textarea {
        display: block;
        width: 100%;
        box-sizing: border-box;
        border: 1px solid #ded2c9;
        border-radius: 8px;
        padding: 10px 12px;
        font-family: inherit;
        font-size: 14px;
        outline: none;
        background: #fff;
        color: #2f2119;
      }

      .form-group input,
      .form-group select {
        min-height: 42px;
      }

      .form-group textarea {
        min-height: 90px;
        resize: vertical;
      }

      .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 14px;
      }

      .file-help {
        display: block;
        margin-top: 6px;
        color: #8a7769;
        font-size: 12px;
      }

      .image-preview {
        width: 100%;
        height: 190px;
        margin-top: 10px;
        border-radius: 10px;
        overflow: hidden;
        background: #f5eee8;
      }

      .image-preview img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .form-error {
        margin-bottom: 15px;
        padding: 10px 12px;
        background: #fff1f1;
        border: 1px solid #efc2c2;
        color: #c0392b;
        border-radius: 8px;
        font-size: 13px;
        white-space: pre-line;
      }

      .modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 24px;
      }

      @media (max-width: 1100px) {
        .product-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (max-width: 700px) {
        .page-header {
          flex-direction: column;
        }

        .product-grid {
          grid-template-columns: 1fr;
        }

        .form-row {
          grid-template-columns: 1fr;
        }

        .modal-card {
          padding: 18px;
        }
      }
    `}</style>
  )
}