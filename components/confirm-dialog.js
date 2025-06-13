import { LitElement, html, css } from 'lit';

export class ConfirmDialog extends LitElement {
  static styles = css`
    .overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.3);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .dialog {
      background: var(--color-white);
      border-radius: var(--border-radius-large);
      box-shadow: 0 8px 32px rgba(0,0,0,0.18);
      padding: var(--spacing-xxl) var(--spacing-xl);
      min-width: 340px;
      max-width: 90vw;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-medium);
      position: relative;
      z-index: 1001;
    }
    .dialog-title {
      color: var(--color-primary);
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      margin-bottom: var(--spacing-small);
    }
    .dialog-desc {
      color: var(--color-text-primary);
      font-size: var(--font-size-medium);
      opacity: 0.8;
      margin-bottom: var(--spacing-large);
    }
    .dialog-actions {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-small);
    }
    .btn {
      padding: var(--spacing-small) var(--spacing-xl);
      font-size: var(--font-size-medium);
      font-weight: var(--font-weight-bold);
      border: none;
      border-radius: var(--border-radius-medium);
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn-primary {
      background: var(--color-primary);
      color: var(--color-white);
    }
    .btn-primary:hover {
      background: #ff7f32;
    }
    .btn-secondary {
      background: var(--color-white);
      color: var(--color-secondary);
      border: 1.5px solid var(--color-secondary);
    }
    .close-btn {
      position: absolute;
      top: var(--spacing-medium);
      right: var(--spacing-medium);
      background: none;
      border: none;
      font-size: 24px;
      color: var(--color-secondary);
      cursor: pointer;
    }
  `;

  static properties = {
    open: { type: Boolean },
    title: { type: String },
    description: { type: String }
  };

  constructor() {
    super();
    this.open = false;
    this.title = '';
    this.description = '';
  }

  _close() {
    this.dispatchEvent(new CustomEvent('cancel', { bubbles: true, composed: true }));
  }

  _proceed() {
    this.dispatchEvent(new CustomEvent('proceed', { bubbles: true, composed: true }));
  }

  render() {
    if (!this.open) return html``;
    return html`
      <div class="overlay" @click=${this._close}>
        <div class="dialog" @click=${e => e.stopPropagation()}>
          <button class="close-btn" @click=${this._close} aria-label="Close">&times;</button>
          <div class="dialog-title">${this.title}</div>
          <div class="dialog-desc">${this.description}</div>
          <div class="dialog-actions">
            <button class="btn btn-primary" @click=${this._proceed}>Proceed</button>
            <button class="btn btn-secondary" @click=${this._close}>Cancel</button>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('confirm-dialog', ConfirmDialog); 