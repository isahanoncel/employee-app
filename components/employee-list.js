import {LitElement, html, css} from 'lit';
import {t} from '../utils/i18n.js';
import {deleteEmployee, getEmployees} from '../store/employeeStore.js';
import {EMPLOYEE_VIEW_TYPE} from '../contants/employee.js';
import './confirm-dialog.js';

export class EmployeeList extends LitElement {
  static styles = css`
    :host {
      display: block;
      background: var(--color-white);
      border-radius: var(--border-radius-large);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
      padding: var(--spacing-large);
      margin-bottom: var(--spacing-large);
      overflow-x: visible;
    }
    .top-bar {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: var(--spacing-large);
      margin-bottom: var(--spacing-large);
    }
    .search-input {
      padding: var(--spacing-small) var(--spacing-medium);
      border: 1px solid #eee;
      border-radius: var(--border-radius-medium);
      font-size: var(--font-size-medium);
      min-width: 220px;
      outline: none;
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
    .table-wrapper {
      width: 100%;
      overflow-x: auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      min-width: 900px;
    }
    th,
    td {
      padding: var(--spacing-small) var(--spacing-medium);
      text-align: left;
      font-size: var(--font-size-medium);
    }
    th {
      color: var(--color-primary);
      font-weight: var(--font-weight-bold);
      background: var(--color-white);
      border-bottom: 2px solid #f2f2f2;
    }
    tr {
      border-bottom: 1px solid #f2f2f2;
    }
    td {
      color: var(--color-text-primary);
    }
    .actions {
      display: flex;
      gap: var(--spacing-small);
    }
    .icon-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 4px;
      border-radius: var(--border-radius-small);
      color: var(--color-primary);
      transition: background 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .icon-btn:hover {
      background: var(--color-bg-gray);
    }
    .list-view {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: var(--spacing-large);
    }
    .list-card {
      position: relative;
      display: flex;
      flex-direction: column;
      background: var(--color-white);
      border-radius: var(--border-radius-large);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.07);
      padding: var(--spacing-xl) var(--spacing-large) var(--spacing-large)
        var(--spacing-large);
      min-height: 220px;
      transition: box-shadow 0.2s;
      overflow: hidden;
    }
    .list-card:hover {
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
    }
    .card-actions {
      position: absolute;
      top: var(--spacing-medium);
      right: var(--spacing-medium);
      display: flex;
      gap: var(--spacing-small);
      z-index: 2;
    }
    .card-avatar {
      width: 56px;
      height: 56px;
      border-radius: var(--border-radius-small);
      background: var(--color-bg-gray);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-primary);
      margin-bottom: var(--spacing-large);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      user-select: none;
    }
    .card-info {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-small);
      flex: 1;
    }
    .info-row {
      display: flex;
      gap: var(--spacing-small);
      align-items: center;
      font-size: var(--font-size-medium);
    }
    .info-label {
      color: var(--color-text-primary);
      font-weight: var(--font-weight-bold);
      min-width: 90px;
      opacity: 0.7;
    }
    .info-value {
      color: var(--color-text-primary);
      font-weight: var(--font-weight-regular);
      word-break: break-word;
    }
    .badge {
      display: inline-block;
      padding: 2px 10px;
      border-radius: var(--border-radius-medium);
      font-size: var(--font-size-small);
      font-weight: var(--font-weight-bold);
      background: var(--color-bg-gray);
      color: var(--color-primary);
      margin-left: 4px;
    }
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: var(--spacing-small);
      margin-top: var(--spacing-large);
      flex-wrap: wrap;
    }
    .page-btn {
      background: none;
      border: none;
      color: var(--color-primary);
      font-size: var(--font-size-medium);
      border-radius: var(--border-radius-medium);
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background 0.2s;
    }
    .page-btn.active,
    .page-btn:hover {
      background: var(--color-bg-gray);
    }
    @media (max-width: 900px) {
      table {
        min-width: 600px;
      }
      .list-view {
        grid-template-columns: 1fr;
      }
    }
    @media (max-width: 600px) {
      :host {
        padding: var(--spacing-medium);
      }
      .table-wrapper {
        -webkit-overflow-scrolling: touch;
      }
      th,
      td {
        font-size: var(--font-size-small);
        padding: var(--spacing-small);
      }
      .list-card {
        padding: var(--spacing-large) var(--spacing-medium);
        min-height: 180px;
      }
      .card-avatar {
        width: 44px;
        height: 44px;
        font-size: var(--font-size-large);
        margin-bottom: var(--spacing-medium);
      }
      .info-label {
        min-width: 70px;
        font-size: var(--font-size-small);
      }
      .info-row {
        font-size: var(--font-size-small);
      }
    }
    .delete-selected-employees {
      background: var(--color-bg-gray);
      color: var(--color-primary);
      border: none;
      padding: var(--spacing-small) var(--spacing-medium);
      border-radius: var(--border-radius-medium);
      cursor: pointer;
      transition: background 0.2s;
      font-size: var(--font-size-medium);
      font-weight: var(--font-weight-bold);
      text-transform: uppercase;
    }
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-xl) var(--spacing-large);
      text-align: center;
      background: var(--color-white);
      border-radius: var(--border-radius-large);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
    }
    .empty-state-icon {
      width: 64px;
      height: 64px;
      opacity: 0.5;
    }
    .empty-state-title {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
      margin-bottom: var(--spacing-small);
    }
    .empty-state-description {
      font-size: var(--font-size-medium);
      color: var(--color-text-secondary);
      max-width: 400px;
      margin: 0 auto;
    }
  `;

  static properties = {
    view: {type: String, reflect: true},
    search: {type: String},
    page: {type: Number},
    pageSize: {type: Number},
    employees: {type: Array},
    showDeleteConfirm: { type: Boolean },
    employeeToDelete: { type: Object },
    selectedIds: { type: Array },
    showBulkDeleteConfirm: { type: Boolean }
  };

  constructor() {
    super();
    this.view = EMPLOYEE_VIEW_TYPE.TABLE;
    this.search = '';
    this.page = 1;
    this.pageSize = 10;
    this.employees = getEmployees();
    this.showDeleteConfirm = false;
    this.employeeToDelete = null;
    this.selectedIds = [];
    this.showBulkDeleteConfirm = false;
    this._onLanguageChanged = this._onLanguageChanged.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('language-changed', this._onLanguageChanged);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('language-changed', this._onLanguageChanged);
  }

  _onLanguageChanged() {
    this.requestUpdate();
  }

  get filteredEmployees() {
    if (!this.search) return this.employees;
    const s = this.search.toLowerCase();
    return this.employees.filter(
      (e) =>
        e.firstName.toLowerCase().includes(s) ||
        e.lastName.toLowerCase().includes(s) ||
        e.email.toLowerCase().includes(s) ||
        e.department.toLowerCase().includes(s) ||
        e.position.toLowerCase().includes(s)
    );
  }

  get pagedEmployees() {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredEmployees.slice(start, start + this.pageSize);
  }

  get pageCount() {
    return Math.ceil(this.filteredEmployees.length / this.pageSize);
  }

  setView(view) {
    this.view = view;
  }

  setSearch(e) {
    this.search = e.target.value;
    this.page = 1;
  }

  setPage(page) {
    if (page < 1 || page > this.pageCount) return;
    this.page = page;
  }

  emitEdit(emp) {
    this.dispatchEvent(
      new CustomEvent('edit', {detail: emp, bubbles: true, composed: true})
    );
  }
  emitDelete(emp) {
    this.dispatchEvent(
      new CustomEvent('delete', {detail: emp, bubbles: true, composed: true})
    );
  }

  willUpdate(changedProps) {
    if (changedProps.has('view')) {
      this.requestUpdate();
    }
  }

  checkAll(e) {
    const checkboxes = this.shadowRoot.querySelectorAll(
      'input[type="checkbox"]'
    );
    checkboxes.forEach((checkbox) => {
      checkbox.checked = e.target.checked;
    });
  }

  _onCheckboxChange(e, id) {
    if (e.target.checked) {
      this.selectedIds = [...this.selectedIds, id];
    } else {
      this.selectedIds = this.selectedIds.filter(selectedId => selectedId !== id);
    }
  }

  _onCheckAllChange(e) {
    if (e.target.checked) {
      this.selectedIds = this.pagedEmployees.map(emp => emp.id);
    } else {
      this.selectedIds = [];
    }
  }

  _isChecked(id) {
    return this.selectedIds.includes(id);
  }

  _isAllChecked() {
    return this.pagedEmployees.length > 0 && this.pagedEmployees.every(emp => this.selectedIds.includes(emp.id));
  }

  _onBulkDeleteClick() {
    this.showBulkDeleteConfirm = true;
  }

  _handleBulkDeleteProceed() {
    this.selectedIds.forEach(id => deleteEmployee(id));
    this.employees = getEmployees();
    this.selectedIds = [];
    this.showBulkDeleteConfirm = false;
  }

  _handleBulkDeleteCancel() {
    this.showBulkDeleteConfirm = false;
  }

  _onDeleteClick(emp) {
    this.employeeToDelete = emp;
    this.showDeleteConfirm = true;
  }

  _handleDeleteProceed() {
    if (this.employeeToDelete) {
      deleteEmployee(this.employeeToDelete.id);
      this.employees = getEmployees();
    }
    this.showDeleteConfirm = false;
    this.employeeToDelete = null;
  }

  _handleDeleteCancel() {
    this.showDeleteConfirm = false;
    this.employeeToDelete = null;
  }

  renderEmptyState() {
    return html`
      <div class="empty-state">
        <img src="/assets/icons/empty-state.svg" alt="No data" class="empty-state-icon" />
        <h3 class="empty-state-title">${t('noEmployeesFound')}</h3>
      </div>
    `;
  }

  renderTable() {
    if (this.pagedEmployees.length === 0) {
      return this.renderEmptyState();
    }

    return html`
      <div class="table-wrapper">
        ${this.selectedIds.length > 0 ? html`
          <div style="margin-bottom: var(--spacing-large); display: flex; justify-content: flex-end;">
            <button class="delete-selected-employees" @click=${this._onBulkDeleteClick}>
              ${t('deleteSelectedEmployees')}
            </button>
          </div>
        ` : ''}
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  class="check-all"
                  .checked=${this._isAllChecked()}
                  @change=${this._onCheckAllChange}
                />
              </th>
              <th>${t('firstName')}</th>
              <th>${t('lastName')}</th>
              <th>${t('employmentDate')}</th>
              <th>${t('birthDate')}</th>
              <th>${t('phone')}</th>
              <th>${t('email')}</th>
              <th>${t('department')}</th>
              <th>${t('position')}</th>
              <th>${t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            ${this.pagedEmployees.map(
              (emp) => html`
                <tr>
                  <td>
                    <input
                      type="checkbox"
                      .checked=${this._isChecked(emp.id)}
                      @change=${e => this._onCheckboxChange(e, emp.id)}
                    />
                  </td>
                  <td>${emp.firstName}</td>
                  <td>${emp.lastName}</td>
                  <td>${emp.employmentDate}</td>
                  <td>${emp.birthDate}</td>
                  <td>${emp.phone}</td>
                  <td>${emp.email}</td>
                  <td>${emp.department}</td>
                  <td>${emp.position}</td>
                  <td class="actions">
                    <button
                      class="icon-btn"
                      @click=${() => this.emitEdit(emp)}
                      title="Edit"
                    >
                      <img src="/assets/icons/edit.svg" alt="Edit" width="24" height="24" />
                    </button>
                    <button
                      class="icon-btn"
                      @click=${() => this._onDeleteClick(emp)}
                      title="Delete"
                    >
                      <img src="/assets/icons/trash.svg" alt="Delete" width="24" height="24" />
                    </button>
                  </td>
                </tr>
              `
            )}
          </tbody>
        </table>
      </div>
    `;
  }

  renderList() {
    if (this.pagedEmployees.length === 0) {
      return this.renderEmptyState();
    }

    return html`
      <div class="list-view">
        ${this.pagedEmployees.map(
          (emp) => html`
            <div class="list-card">
              <div class="card-actions">
                <button
                  class="icon-btn"
                  @click=${() => this.emitEdit(emp)}
                  title="Edit"
                >
                   <img src="/assets/icons/edit.svg" alt="Edit" width="24" height="24" />
                </button>
                <button
                  class="icon-btn"
                  @click=${() => this._onDeleteClick(emp)}
                  title="Delete"
                >
                  <img src="/assets/icons/trash.svg" alt="Delete" width="24" height="24" />
                </button>
              </div>
              <div class="card-avatar">
                ${emp.firstName[0]}${emp.lastName[0]}
              </div>
              <div class="card-info">
                <div class="info-row">
                  <span class="info-label">${t('firstName')}:</span>
                  <span class="info-value">${emp.firstName}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">${t('lastName')}:</span>
                  <span class="info-value">${emp.lastName}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">${t('email')}:</span>
                  <span class="info-value">${emp.email}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">${t('phone')}:</span>
                  <span class="info-value">${emp.phone}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">${t('employmentDate')}:</span>
                  <span class="info-value">${emp.employmentDate}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">${t('birthDate')}:</span>
                  <span class="info-value">${emp.birthDate}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">${t('department')}:</span>
                  <span class="badge">${emp.department}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">${t('position')}:</span>
                  <span class="badge">${emp.position}</span>
                </div>
              </div>
            </div>
          `
        )}
      </div>
    `;
  }

  renderPagination() {
    const pages = [];

    if (this.pageCount <= 1) return html``;
    for (let i = 1; i <= this.pageCount; i++) {
      if (i === 1 || i === this.pageCount || Math.abs(i - this.page) <= 1) {
        pages.push(i);
      } else if (
        (i === 2 && this.page > 3) ||
        (i === this.pageCount - 1 && this.page < this.pageCount - 2)
      ) {
        pages.push('...');
      }
    }
    return html`
      <div class="pagination">
        <button
          class="page-btn"
          ?disabled=${this.page === 1}
          @click=${() => this.setPage(this.page - 1)}
        >
          &lt;
        </button>
        ${pages.map((p) =>
          p === '...'
            ? html`<span>...</span>`
            : html`<button
                class="page-btn ${this.page === p ? 'active' : ''}"
                @click=${() => this.setPage(p)}
              >
                ${p}
              </button>`
        )}
        <button
          class="page-btn"
          ?disabled=${this.page === this.pageCount}
          @click=${() => this.setPage(this.page + 1)}
        >
          &gt;
        </button>
      </div>
    `;
  }

  render() {
    return html`
      <div class="top-bar">
        <input
          class="search-input"
          type="text"
          .value=${this.search}
          @input=${this.setSearch}
          placeholder="${t('search') || 'Search...'}"
        />
      </div>
      ${this.view === EMPLOYEE_VIEW_TYPE.TABLE
        ? this.renderTable()
        : this.renderList()}

      ${this.pagedEmployees.length > 0 ? this.renderPagination() : ''}

      <confirm-dialog
        .open=${this.showDeleteConfirm}
        .title=${t('deleteConfirmTitle')}
        .description=${t('deleteConfirmDesc')
          .replace('{firstName}', this.employeeToDelete?.firstName || '')
          .replace('{lastName}', this.employeeToDelete?.lastName || '')}
        @proceed=${this._handleDeleteProceed}
        @cancel=${this._handleDeleteCancel}
      ></confirm-dialog>
      <confirm-dialog
        .open=${this.showBulkDeleteConfirm}
        .title=${t('deleteSelectedEmployees')}
        .description=${t('deleteSelectedEmployeesDesc')}
        @proceed=${this._handleBulkDeleteProceed}
        @cancel=${this._handleBulkDeleteCancel}
      ></confirm-dialog>
    `;
  }
}

customElements.define('employee-list', EmployeeList);
