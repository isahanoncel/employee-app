import { LitElement, html, css } from 'lit';
import { t } from '../utils/i18n.js';
import { getEmployees, addEmployee, updateEmployee } from '../store/employeeStore.js';
import './confirm-dialog.js';

export class EmployeeForm extends LitElement {
  static styles = css`
    .form-container {
      max-width: 50%;
      margin: 40px auto;
      background: var(--color-white);
      border-radius: var(--border-radius-large);
      box-shadow: 0 2px 16px rgba(0,0,0,0.07);
      padding: var(--spacing-xxl) var(--spacing-xl);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-large);

      @media (max-width: 992px) {
        max-width: 90%;
      }
    }
    .form-title {
      font-size: var(--font-size-xxl);
      font-weight: var(--font-weight-bold);
      color: var(--color-primary);
      text-align: center;
      margin-bottom: var(--spacing-large);
    }
    form {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-large);
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-small);
    }
    label {
      font-size: var(--font-size-medium);
      font-weight: var(--font-weight-bold);
      color: var(--color-text-primary);
      margin-bottom: 2px;
    }
    input, select {
      padding: var(--spacing-small) var(--spacing-medium);
      border: 1px solid #eee;
      border-radius: var(--border-radius-medium);
      font-size: var(--font-size-medium);
      background: var(--color-bg-gray);
      color: var(--color-text-primary);
      outline: none;
      transition: border 0.2s;
    }
    input:focus, select:focus {
      border: 1.5px solid var(--color-primary);
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--spacing-medium);
      margin-top: var(--spacing-large);
    }
    .form-fields {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-large) var(--spacing-large);
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
      background: var(--color-bg-gray);
      color: var(--color-primary);
    }
    .error-message {
      color: var(--color-danger);
      font-size: 12px;
      margin-top: 2px;
    }
    @media (max-width: 600px) {
      .form-container {
        padding: var(--spacing-large) var(--spacing-medium);
      }
    }
    @media (max-width: 700px) {
      .form-fields {
        grid-template-columns: 1fr;
      }
    }
  `;

  static properties = {
    employee: { type: Object },
    form: { type: Object },
    errors: { type: Object },
    showConfirm: { type: Boolean }
  };

  constructor() {
    super();
    this.form = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      department: '',
      position: '',
      employmentDate: '',
      birthDate: ''
    };
    this.errors = {};
    this.showConfirm = false;
    this._onLanguageChanged = this._onLanguageChanged.bind(this);
  }

  _onLanguageChanged() {
    this.requestUpdate();
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('language-changed', this._onLanguageChanged);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('language-changed', this._onLanguageChanged);
  }

  updated(changedProps) {
    if (changedProps.has('employee') && this.employee) {
      this.form = { ...this.employee };
      this.errors = {};
    }
  }

  handleInput(e) {
    const { name, value } = e.target;
    this.form = { ...this.form, [name]: value };
    this.errors = { ...this.errors, [name]: '' };
  }

  validate() {
    const errors = {};
    if (!this.form.firstName) errors.firstName = t('required');
    if (!this.form.lastName) errors.lastName = t('required');
    if (!this.form.email) errors.email = t('required');
    else if (!/^[^@]+@[^@]+\.[^@]+$/.test(this.form.email)) errors.email = t('invalidEmail');
    if (!this.form.phone) errors.phone = t('required');
    else if (!/^\+?\d[\d\s\-()]{7,}$/.test(this.form.phone)) errors.phone = t('invalidPhone');
    if (!this.form.department) errors.department = t('required');
    if (!this.form.position) errors.position = t('required');
    if (!this.form.employmentDate) errors.employmentDate = t('required');
    if (!this.form.birthDate) errors.birthDate = t('required');

    if (this.form.birthDate) {
      const birth = new Date(this.form.birthDate);
      const today = new Date();
      today.setHours(0,0,0,0);
      if (birth > today) {
        errors.birthDate = t('invalidBirthDate');
      }
    }

    if (this.form.birthDate && this.form.employmentDate) {
      const birth = new Date(this.form.birthDate);
      const employment = new Date(this.form.employmentDate);
      if (employment <= birth) {
        errors.employmentDate = t('employmentAfterBirth');
      }
    }

    const employees = getEmployees();
    if (employees.some(e => e.email === this.form.email && (!this.form.id || String(e.id) !== String(this.form.id)))) {
      errors.email = t('uniqueEmail');
    }
    return errors;
  }

  handleSubmit(e) {
    e.preventDefault();
    this.errors = this.validate();
    if (Object.keys(this.errors).length > 0) return;
    if (this.form.id) {
      this.showConfirm = true;
    } else {
      addEmployee({ ...this.form });
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }

  _handleConfirmProceed() {
    updateEmployee(this.form);
    this.showConfirm = false;
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  _handleConfirmCancel() {
    this.showConfirm = false;
  }

  handleCancel() {
    window.history.back();
  }

  render() {
    return html`
      <div class="form-container">
        <div class="form-title">${this.form.id ? t('editEmployee') : t('addNew')}</div>
        <form @submit=${this.handleSubmit}>
          <div class="form-fields">
            <div class="form-group">
              <label for="firstName">${t('firstName')}</label>
              <input name="firstName" .value=${this.form.firstName} @input=${this.handleInput} placeholder=${t('firstName')} />
              ${this.errors.firstName ? html`<div class="error-message">${this.errors.firstName}</div>` : ''}
            </div>
            <div class="form-group">
              <label for="lastName">${t('lastName')}</label>
              <input name="lastName" .value=${this.form.lastName} @input=${this.handleInput} placeholder=${t('lastName')} />
              ${this.errors.lastName ? html`<div class="error-message">${this.errors.lastName}</div>` : ''}
            </div>
            <div class="form-group">
              <label for="email">${t('email')}</label>
              <input name="email" .value=${this.form.email} @input=${this.handleInput} placeholder=${t('email')} type="email" />
              ${this.errors.email ? html`<div class="error-message">${this.errors.email}</div>` : ''}
            </div>
            <div class="form-group">
              <label for="phone">${t('phone')}</label>
              <input name="phone" .value=${this.form.phone} @input=${this.handleInput} placeholder=${t('phone')} />
              ${this.errors.phone ? html`<div class="error-message">${this.errors.phone}</div>` : ''}
            </div>
            <div class="form-group">
              <label for="department">${t('department')}</label>
              <select name="department" .value=${this.form.department} @change=${this.handleInput}>
                <option value="">${t('select')}</option>
                <option value="Analytics">Analytics</option>
                <option value="Tech">Tech</option>
              </select>
              ${this.errors.department ? html`<div class="error-message">${this.errors.department}</div>` : ''}
            </div>
            <div class="form-group">
              <label for="position">${t('position')}</label>
              <select name="position" .value=${this.form.position} @change=${this.handleInput}>
                <option value="">${t('select')}</option>
                <option value="Junior">Junior</option>
                <option value="Medior">Medior</option>
                <option value="Senior">Senior</option>
              </select>
              ${this.errors.position ? html`<div class="error-message">${this.errors.position}</div>` : ''}
            </div>
            <div class="form-group">
              <label for="employmentDate">${t('employmentDate')}</label>
              <input name="employmentDate" .value=${this.form.employmentDate} @input=${this.handleInput} type="date" />
              ${this.errors.employmentDate ? html`<div class="error-message">${this.errors.employmentDate}</div>` : ''}
            </div>
            <div class="form-group">
              <label for="birthDate">${t('birthDate')}</label>
              <input name="birthDate" .value=${this.form.birthDate} @input=${this.handleInput} type="date" />
              ${this.errors.birthDate ? html`<div class="error-message">${this.errors.birthDate}</div>` : ''}
            </div>
          </div>
          <div class="form-actions">
            <button type="button" class="btn btn-secondary" @click=${this.handleCancel}>${t('cancel')}</button>
            <button type="submit" class="btn btn-primary">${t('save')}</button>
          </div>
        </form>
        <confirm-dialog
          .open=${this.showConfirm}
          .title=${t('editEmployee')}
          .description=${t('editConfirmDesc').replace('{firstName}', this.form.firstName).replace('{lastName}', this.form.lastName)}
          @proceed=${this._handleConfirmProceed}
          @cancel=${this._handleConfirmCancel}
        ></confirm-dialog>
      </div>
    `;
  }
}

customElements.define('employee-form', EmployeeForm);