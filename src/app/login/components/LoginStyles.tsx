'use client'

export default function LoginStyles() {
  return (
    <style jsx global>{`
      .login-page {
        min-height: 100vh;
        width: 100%;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 28px 20px;
        background:
          radial-gradient(
            circle at 10% 10%,
            rgba(200, 120, 66, 0.12),
            transparent 35%
          ),
          linear-gradient(135deg, #f8f2ec 0%, #eee2d6 100%);
        font-family: Arial, Helvetica, sans-serif;
      }

      .login-card {
        width: 100%;
        max-width: 430px;
        box-sizing: border-box;
        padding: 42px 38px 32px;
        border: 1px solid rgba(145, 105, 76, 0.15);
        border-radius: 20px;
        background: #fff;
        box-shadow: 0 20px 60px rgba(65, 42, 27, 0.1);
      }

      .login-logo {
        width: 64px;
        height: 64px;
        margin: 0 auto 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 18px;
        background: linear-gradient(135deg, #d58a50, #a85e32);
        color: #fff;
        font-family: Georgia, 'Times New Roman', serif;
        font-size: 36px;
        font-weight: 700;
        box-shadow: 0 8px 20px rgba(168, 94, 50, 0.2);
      }

      .login-card h1 {
        margin: 0;
        text-align: center;
        color: #35251b;
        font-family: Georgia, 'Times New Roman', serif;
        font-size: 28px;
        font-weight: 700;
        letter-spacing: -0.5px;
      }

      .login-description {
        margin: 10px 0 30px;
        text-align: center;
        color: #8a7769;
        font-size: 14px;
        line-height: 1.6;
      }

      .login-field {
        margin-bottom: 20px;
      }

      .login-field label {
        display: block;
        margin-bottom: 8px;
        color: #49372a;
        font-size: 13px;
        font-weight: 700;
      }

      .login-field input {
        display: block;
        width: 100%;
        height: 48px;
        box-sizing: border-box;
        padding: 0 14px;
        border: 1px solid #e1d6cc;
        border-radius: 9px;
        outline: none;
        background: #fffdfb;
        color: #35251b;
        font-family: inherit;
        font-size: 14px;
        transition:
          border-color 0.2s ease,
          box-shadow 0.2s ease;
      }

      .login-field input::placeholder {
        color: #b0a39a;
      }

      .login-field input:focus {
        border-color: #c87842;
        box-shadow: 0 0 0 3px rgba(200, 120, 66, 0.12);
      }

      .login-field input:disabled {
        background: #f7f3ef;
        cursor: not-allowed;
      }

      .login-error {
        margin: 0 0 18px;
        padding: 12px 14px;
        border: 1px solid #efc2c2;
        border-radius: 9px;
        background: #fff1f1;
        color: #b83232;
        font-size: 13px;
        line-height: 1.5;
        overflow-wrap: anywhere;
      }

      .login-button {
        display: block;
        width: 100%;
        min-height: 49px;
        margin-top: 8px;
        border: none;
        border-radius: 9px;
        background: linear-gradient(135deg, #ce8048, #ad6335);
        color: #fff;
        font-family: inherit;
        font-size: 14px;
        font-weight: 700;
        cursor: pointer;
        box-shadow: 0 7px 16px rgba(173, 99, 53, 0.16);
        transition:
          transform 0.2s ease,
          box-shadow 0.2s ease,
          opacity 0.2s ease;
      }

      .login-button:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 10px 22px rgba(173, 99, 53, 0.24);
      }

      .login-button:disabled {
        opacity: 0.65;
        cursor: not-allowed;
      }

      .login-divider {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-top: 29px;
      }

      .login-divider > span:first-child,
      .login-divider > span:last-child {
        flex: 1;
        height: 1px;
        background: #eee5dd;
      }

      .login-divider-text {
        color: #a08b7a;
        font-size: 10px;
        font-weight: 700;
        letter-spacing: 1.5px;
      }

      .login-note {
        display: block;
        margin: 15px 0 0;
        text-align: center;
        color: #9b8b7f;
        font-size: 12px;
      }

      @media (max-width: 480px) {
        .login-page {
          padding: 20px 14px;
        }

        .login-card {
          padding: 34px 24px 28px;
          border-radius: 16px;
        }

        .login-card h1 {
          font-size: 25px;
        }
      }
    `}</style>
  )
}