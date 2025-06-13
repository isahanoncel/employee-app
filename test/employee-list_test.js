import { EmployeeList } from '../components/employee-list.js';
import { fixture, assert, oneEvent } from '@open-wc/testing';
import { html } from 'lit/static-html.js';
import { addEmployee } from '../store/employeeStore.js';

suite('employee-list', () => {
  let el;
  const mockEmployees = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      department: 'Tech',
      position: 'Senior',
      employmentDate: '2023-01-01',
      birthDate: '1990-01-01'
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      phone: '+9876543210',
      department: 'Analytics',
      position: 'Junior',
      employmentDate: '2022-05-10',
      birthDate: '1995-05-10'
    }
  ];

  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  setup(async () => {
    mockEmployees.forEach(emp => addEmployee(emp));
    el = await fixture(html`<employee-list></employee-list>`);
    await el.updateComplete;
  });

  test('is defined', () => {
    const el = document.createElement('employee-list');
    assert.instanceOf(el, EmployeeList);
  });

  test('renders employee table', async () => {
    assert.exists(el.shadowRoot.querySelector('.table-wrapper'));
    const rows = Array.from(el.shadowRoot.querySelectorAll('tbody tr'));
    console.log('Rendered rows:', rows.map(row => row.textContent));
    const employeeRows = rows.filter(row => Array.from(row.querySelectorAll('td')).some(td => td.textContent.includes('@')));
    assert.equal(employeeRows.length, mockEmployees.length);
    assert.include(employeeRows[0].textContent, 'John');
    assert.include(employeeRows[1].textContent, 'Jane');
  });

  test('filters employees by search', async () => {
    const input = el.shadowRoot.querySelector('.search-input');
    input.value = 'Jane';
    input.dispatchEvent(new Event('input'));
    await el.updateComplete;
    const rows = Array.from(el.shadowRoot.querySelectorAll('tbody tr'))
      .filter(row => Array.from(row.querySelectorAll('td')).some(td => td.textContent.includes('jane@example.com')));
    assert.equal(rows.length, 1);
    assert.include(rows[0].textContent, 'Jane');
  });

  test('switches to list view', async () => {
    el.setView('list');
    await el.updateComplete;
    assert.exists(el.shadowRoot.querySelector('.list-view'));
    const cards = Array.from(el.shadowRoot.querySelectorAll('.list-card'))
      .filter(card => card.textContent.includes('john@example.com') || card.textContent.includes('jane@example.com'));
    assert.equal(cards.length, mockEmployees.length);
  });

  test('selects and bulk deletes employees', async () => {
    // Select all
    const checkAll = el.shadowRoot.querySelector('.check-all');
    checkAll.click();
    await el.updateComplete;
    assert.isTrue(checkAll.checked);
    // Click bulk delete
    const bulkDeleteBtn = el.shadowRoot.querySelector('.btn.btn-primary');
    bulkDeleteBtn.click();
    await el.updateComplete;
    // Confirm bulk delete
    el._handleBulkDeleteProceed();
    await el.updateComplete;
    const rows = Array.from(el.shadowRoot.querySelectorAll('tbody tr'))
      .filter(row => Array.from(row.querySelectorAll('td')).some(td => td.textContent.includes('@')));
    assert.equal(rows.length, 0);
  });

  test('emits edit event when edit button is clicked', async () => {
    const editBtn = el.shadowRoot.querySelector('.icon-btn[title="Edit"]');
    setTimeout(() => editBtn.click());
    const event = await oneEvent(el, 'edit');
    assert.equal(event.detail.firstName, 'John');
  });

  test('shows and cancels delete confirm dialog', async () => {
    const deleteBtn = el.shadowRoot.querySelector('.icon-btn[title="Delete"]');
    deleteBtn.click();
    await el.updateComplete;
    assert.isTrue(el.showDeleteConfirm);
    // Cancel
    el._handleDeleteCancel();
    await el.updateComplete;
    assert.isFalse(el.showDeleteConfirm);
  });

  test('deletes employee after confirm', async () => {
    const deleteBtn = el.shadowRoot.querySelector('.icon-btn[title="Delete"]');
    deleteBtn.click();
    await el.updateComplete;
    // Confirm
    el._handleDeleteProceed();
    await el.updateComplete;
    const rows = Array.from(el.shadowRoot.querySelectorAll('tbody tr'))
      .filter(row => Array.from(row.querySelectorAll('td')).some(td => td.textContent.includes('@')));
    assert.equal(rows.length, 1);
    assert.notInclude(rows[0].textContent, 'John');
  });
});
