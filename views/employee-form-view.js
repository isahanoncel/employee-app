import { LitElement, html } from 'lit';
import '../components/employee-form.js';
import { getEmployees } from '../store/employeeStore.js';

export class EmployeeFormView extends LitElement {
  static properties = {
    employee: { type: Object },
  };

  constructor() {
    super();
    this.employee = null;
  }

  connectedCallback() {
    super.connectedCallback();
    const url = new URL(window.location.href);
    const parts = url.pathname.split('/');
    const id = parts[2];

    if (id) {
      const employees = getEmployees();
      this.employee = employees.find(e => String(e.id) === String(id));
    }
  }

  render() {
    return html`<employee-form .employee=${this.employee}></employee-form>`;
  }
}
customElements.define('employee-form-view', EmployeeFormView);