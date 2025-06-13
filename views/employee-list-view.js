import { LitElement, html, css } from 'lit';
import '../components/employee-list.js';
import {EMPLOYEE_VIEW_TYPE} from '../contants/employee.js';

export class EmployeeListView extends LitElement {
  static styles = css`
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-large);
    }

    .header-title {
      font-size: var(--font-size-xxl);
      font-weight: var(--font-weight-bold);
      color: var(--color-primary);
    }

    .view-toggle {
      display: flex;
      gap: var(--spacing-small);
    }
    .toggle-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: var(--spacing-small);
      border-radius: var(--border-radius-medium);
      display: flex;
      align-items: center;
      color: var(--color-primary);
      opacity: 0.5;
      transition: background 0.2s, opacity 0.2s;
    }
    .toggle-btn.active {
      background: var(--color-bg-gray);
      opacity: 1;
    }
  `;

  static properties = {
    view: { type: String },
  };

  constructor() {
    super();
    this.view = EMPLOYEE_VIEW_TYPE.TABLE;
  }

  setView(view) {
    this.view = view;
  }

  render() {
    return html`
      <div>
        <div class="header">
          <h2 class="header-title">Employee List</h2>
          <div class="view-toggle">
            <button class="toggle-btn ${this.view === 'table' ? 'active' : ''}" @click=${() => this.setView('table')} title="Table View">
              <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="6" height="6"/><rect x="12" y="2" width="6" height="6"/><rect x="2" y="12" width="6" height="6"/><rect x="12" y="12" width="6" height="6"/></svg>
            </button>
            <button class="toggle-btn ${this.view === 'list' ? 'active' : ''}" @click=${() => this.setView('list')} title="List View">
              <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="14" height="3"/><rect x="3" y="10" width="14" height="3"/><rect x="3" y="16" width="14" height="3"/></svg>
            </button>
          </div>
        </div>
        <employee-list .view=${this.view} @edit=${this.handleEdit}></employee-list>
      </div>
    `;
  }

  handleEdit(e) {
    const employee = e.detail;
    window.history.pushState({}, '', `/edit/${employee.id}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
}

customElements.define('employee-list-view', EmployeeListView);