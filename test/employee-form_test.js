/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { EmployeeForm } from '../components/employee-form.js';
import { fixture, assert } from '@open-wc/testing';
import { html } from 'lit/static-html.js';
import { t } from '../utils/i18n.js';

suite('employee-form', () => {
  let el;
  const mockEmployee = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    department: 'Tech',
    position: 'Senior',
    employmentDate: '2023-01-01',
    birthDate: '1990-01-01'
  };

  setup(async () => {
    // Mock the employee store
    window.localStorage.clear();
    const mockEmployees = [mockEmployee];
    window.localStorage.setItem('employees', JSON.stringify(mockEmployees));

    // Mock window.history and location to prevent navigation
    const originalPushState = window.history.pushState;
    window.history.pushState = () => {};
    const originalDispatchEvent = window.dispatchEvent;
    window.dispatchEvent = (event) => {
      if (event instanceof PopStateEvent) {
        return;
      }
      return originalDispatchEvent.call(window, event);
    };
    const originalBack = window.history.back;
    window.history.back = () => {};

    // Restore original functions after each test
    teardown(() => {
      window.history.pushState = originalPushState;
      window.dispatchEvent = originalDispatchEvent;
      window.history.back = originalBack;
    });
  });

  test('is defined', () => {
    const el = document.createElement('employee-form');
    assert.instanceOf(el, EmployeeForm);
  });

  test('renders empty form for new employee', async () => {
    el = await fixture(html`<employee-form></employee-form>`);
    await el.updateComplete;

    assert.exists(el.shadowRoot.querySelector('.form-container'));
    assert.exists(el.shadowRoot.querySelector('form'));
    assert.equal(el.shadowRoot.querySelector('.form-title').textContent.trim(), t('addNew'));
    
    // Check all form fields exist
    const fields = ['firstName', 'lastName', 'email', 'phone', 'department', 'position', 'employmentDate', 'birthDate'];
    fields.forEach(field => {
      assert.exists(el.shadowRoot.querySelector(`[name="${field}"]`));
    });

    // Check buttons
    assert.exists(el.shadowRoot.querySelector('button[type="submit"]'));
    assert.exists(el.shadowRoot.querySelector('button[type="button"]'));
  });

  test('renders form with employee data for edit', async () => {
    el = await fixture(html`<employee-form .employee=${mockEmployee}></employee-form>`);
    await el.updateComplete;

    // Check if form is pre-filled with employee data
    assert.equal(el.shadowRoot.querySelector('[name="firstName"]').value, mockEmployee.firstName);
    assert.equal(el.shadowRoot.querySelector('[name="lastName"]').value, mockEmployee.lastName);
    assert.equal(el.shadowRoot.querySelector('[name="email"]').value, mockEmployee.email);
    assert.equal(el.shadowRoot.querySelector('[name="phone"]').value, mockEmployee.phone);
    assert.equal(el.shadowRoot.querySelector('[name="department"]').value, mockEmployee.department);
    assert.equal(el.shadowRoot.querySelector('[name="position"]').value, mockEmployee.position);
    assert.equal(el.shadowRoot.querySelector('[name="employmentDate"]').value, mockEmployee.employmentDate);
    assert.equal(el.shadowRoot.querySelector('[name="birthDate"]').value, mockEmployee.birthDate);
  });

  test('validates required fields', async () => {
    el = await fixture(html`<employee-form></employee-form>`);
    await el.updateComplete;

    const form = el.shadowRoot.querySelector('form');
    form.dispatchEvent(new Event('submit'));
    await el.updateComplete;

    const fields = ['firstName', 'lastName', 'email', 'phone', 'department', 'position', 'employmentDate', 'birthDate'];
    fields.forEach(field => {
      assert.equal(el.errors[field], t('required'));
    });
  });

  test('validates email format', async () => {
    el = await fixture(html`<employee-form></employee-form>`);
    await el.updateComplete;

    const emailInput = el.shadowRoot.querySelector('[name="email"]');
    emailInput.value = 'invalid-email';
    emailInput.dispatchEvent(new Event('input'));
    await el.updateComplete;

    const form = el.shadowRoot.querySelector('form');
    form.dispatchEvent(new Event('submit'));
    await el.updateComplete;

    assert.equal(el.errors.email, t('invalidEmail'));
  });

  test('validates phone format', async () => {
    el = await fixture(html`<employee-form></employee-form>`);
    await el.updateComplete;

    const phoneInput = el.shadowRoot.querySelector('[name="phone"]');
    phoneInput.value = '123'; // Too short
    phoneInput.dispatchEvent(new Event('input'));
    await el.updateComplete;

    const form = el.shadowRoot.querySelector('form');
    form.dispatchEvent(new Event('submit'));
    await el.updateComplete;

    assert.equal(el.errors.phone, t('invalidPhone'));
  });

  test('validates birth date not in future', async () => {
    el = await fixture(html`<employee-form></employee-form>`);
    await el.updateComplete;

    const birthDateInput = el.shadowRoot.querySelector('[name="birthDate"]');
    birthDateInput.value = '2050-01-01'; // Future date
    birthDateInput.dispatchEvent(new Event('input'));
    await el.updateComplete;

    const form = el.shadowRoot.querySelector('form');
    form.dispatchEvent(new Event('submit'));
    await el.updateComplete;

    assert.equal(el.errors.birthDate, t('invalidBirthDate'));
  });
});