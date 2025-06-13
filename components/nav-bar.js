import {LitElement, html, css} from 'lit';
import {t, setLanguage} from '../utils/i18n.js';
import {Router} from '@vaadin/router';

export class NavBar extends LitElement {
  static styles = css`
    nav {
      background-color: var(--color-white);
      padding: var(--spacing-medium);
      color: var(--color-white);
      display: flex;
      justify-content: space-between;
      margin: var(--spacing-medium);
      border-radius: var(--border-radius-large);
      position: relative;
      align-items: center;
    }

    .logo-wrapper {
      display: flex;
      align-items: center;
      gap: var(--spacing-large);
      text-decoration: none;
      cursor: pointer;
      z-index: 2;

      span {
        font-size: var(--font-size-large);
        font-weight: var(--font-weight-bold);
        color: var(--color-text-primary);

        @media (max-width: 768px) {
          font-size: var(--font-size-medium);
        }
      }
    }

    .logo-wrapper img {
      width: 40px;
      object-fit: contain;
      border-radius: var(--border-radius-large);

      @media (max-width: 768px) {
        width: 30px;
      }
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: var(--spacing-large);

      @media (max-width: 768px) {
        position: fixed;
        top: 0;
        right: -100%;
        width: 80%;
        max-width: 300px;
        height: 100vh;
        background-color: var(--color-white);
        flex-direction: column;
        padding: calc(var(--spacing-large) * 2) var(--spacing-large);
        gap: var(--spacing-large);
        transition: right 0.3s ease-in-out;
        box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
        z-index: 30;
        align-items: flex-start;

        &.active {
          right: 0;
        }
      }
    }

    .nav-link {
      color: var(--color-primary);
      text-decoration: none;
      font-size: var(--font-size-medium);
      font-weight: var(--font-weight-bold);
      opacity: 0.5;
      display: flex;
      align-items: center;
      gap: var(--spacing-small);
      cursor: pointer;

      @media (max-width: 768px) {
        font-size: var(--font-size-medium);
        width: 100%;
        padding: var(--spacing-small) 0;
      }

      &:hover {
        opacity: 1;
      }

      &.active {
        opacity: 1;
      }
    }

    .language-switcher {
      cursor: pointer;
      z-index: 2;

      @media (max-width: 768px) {
        display: flex;
        align-items: center;
        gap: var(--spacing-small);
      }

      .language-switcher-text {
        display: none;

        @media (max-width: 768px) {
          display: block;
          font-size: var(--font-size-medium);
          font-weight: var(--font-weight-bold);
          color: var(--color-text-primary);
        }
      }
    }

    .hamburger {
      display: none;
      flex-direction: column;
      justify-content: space-between;
      width: 24px;
      height: 20px;
      cursor: pointer;
      z-index: 30;
      position: relative;

      @media (max-width: 768px) {
        display: flex;
      }

      span {
        width: 100%;
        height: 2px;
        background-color: var(--color-primary);
        transition: all 0.3s ease-in-out;
      }

      &.active {
        span:nth-child(1) {
          transform: translateY(9px) rotate(45deg);
        }

        span:nth-child(2) {
          opacity: 0;
        }

        span:nth-child(3) {
          transform: translateY(-9px) rotate(-45deg);
        }
      }
    }

    .overlay {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      opacity: 0;
      transition: opacity 0.3s ease-in-out;
      z-index: 10;

      &.active {
        opacity: 1;
      }

      @media (max-width: 768px) {
        display: block;
      }
    }

    .close-btn {
      display: none;
      position: fixed;
      top: var(--spacing-large);
      right: var(--spacing-large);
      width: 32px;
      height: 32px;
      background: none;
      border: none;
      cursor: pointer;
      z-index: 40;
      padding: 0;

      @media (max-width: 768px) {
        display: block;
      }

      svg {
        width: 32px;
        height: 32px;
        stroke: var(--color-primary);
        stroke-width: 3;
      }
    }
  `;

  constructor() {
    super();
    this._router = Router;
    this._currentPath = window.location.pathname;
    this._currentLang = localStorage.getItem('lang') || 'tr';
    this._isMenuOpen = false;
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('vaadin-router-location-changed', (e) => {
      this._currentPath = e.detail.location.pathname;
      this.requestUpdate();
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener(
      'vaadin-router-location-changed',
      this._onLocationChanged
    );
  }

  _isActive(path) {
    return this._currentPath === path;
  }

  async _toggleLanguage() {
    const newLang = this._currentLang === 'tr' ? 'en' : 'tr';
    this._currentLang = newLang;
    await setLanguage(newLang);
    this.requestUpdate();
  }

  _toggleMenu() {
    this._isMenuOpen = !this._isMenuOpen;
    this.requestUpdate();
  }

  _closeMenu() {
    this._isMenuOpen = false;
    this.requestUpdate();
  }

  render() {
    return html`
      <nav>
        <a href="/" class="logo-wrapper">
          <img src="/assets/images/logo.png" alt="ING" width="40" height="40" />
          <span>ING</span>
        </a>
        <div
          class="hamburger ${this._isMenuOpen ? 'active' : ''}"
          @click=${this._toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
        ${this._isMenuOpen
          ? html`
              <button
                class="close-btn"
                @click=${this._closeMenu}
                aria-label="Menüyü Kapat"
              >
                <svg viewBox="0 0 32 32" fill="none">
                  <line
                    x1="8"
                    y1="8"
                    x2="24"
                    y2="24"
                    stroke="var(--color-primary)"
                    stroke-linecap="round"
                  />
                  <line
                    x1="24"
                    y1="8"
                    x2="8"
                    y2="24"
                    stroke="var(--color-primary)"
                    stroke-linecap="round"
                  />
                </svg>
              </button>
            `
          : ''}
        <div class="nav-links ${this._isMenuOpen ? 'active' : ''}">
          <a
            href="/"
            class="nav-link ${this._isActive('/') ? 'active' : ''}"
            @click=${this._closeMenu}
          >
            <img
              src="/assets/icons/employee.svg"
              alt="employee"
              width="20"
              height="20"
            />
            ${t('employeeList')}</a
          >
          <a
            href="/new"
            class="nav-link ${this._isActive('/new') ? 'active' : ''}"
            @click=${this._closeMenu}
          >
            <img
              src="/assets/icons/add.svg"
              alt="add"
              width="20"
              height="20"
            />${t('addNew')}
          </a>
          <div class="language-switcher" @click=${this._toggleLanguage}>
            <img
              src="/assets/icons/${this._currentLang === 'tr'
                ? 'us'
                : 'tr'}.svg"
              alt="${this._currentLang}"
              width="20"
              height="20"
            />
            <span class="language-switcher-text"
              >${this._currentLang === 'tr' ? 'English' : 'Türkçe'}</span
            >
          </div>
        </div>
        ${this._isMenuOpen
          ? html`<div class="overlay active" @click=${this._closeMenu}></div>`
          : ''}
      </nav>
    `;
  }
}

customElements.define('nav-bar', NavBar);
