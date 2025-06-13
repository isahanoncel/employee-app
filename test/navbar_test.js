/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {NavBar} from '../components/nav-bar.js';
import {fixture, assert} from '@open-wc/testing';
import {html} from 'lit/static-html.js';

suite('nav-bar', () => {
  test('is defined', () => {
    const el = document.createElement('nav-bar');
    assert.instanceOf(el, NavBar);
  });

  test('renders logo and links', async () => {
    const el = await fixture(html`<nav-bar></nav-bar>`);
    const logo = el.shadowRoot.querySelector('.logo-wrapper');
    const links = el.shadowRoot.querySelectorAll('.nav-link');
    assert.exists(logo);
    assert.isAbove(links.length, 0);
  });

  test('opens and closes the mobile menu', async () => {
    const el = await fixture(html`<nav-bar></nav-bar>`);
    const hamburger = el.shadowRoot.querySelector('.hamburger');
    hamburger.click();
    await el.updateComplete;
    assert.isTrue(el._isMenuOpen);
    // Overlay should be in DOM
    assert.exists(el.shadowRoot.querySelector('.overlay'));
    // Close with overlay
    el.shadowRoot.querySelector('.overlay').click();
    await el.updateComplete;
    assert.isFalse(el._isMenuOpen);
  });

  test('highlights the active link', async () => {
    window.history.pushState({}, '', '/new');
    const el = await fixture(html`<nav-bar></nav-bar>`);
    await el.updateComplete;
    const activeLink = el.shadowRoot.querySelector('.nav-link.active');
    assert.exists(activeLink);
    assert.equal(activeLink.getAttribute('href'), '/new');
  });

  test('toggles language on click', async () => {
    const el = await fixture(html`<nav-bar></nav-bar>`);
    const langSwitcher = el.shadowRoot.querySelector('.language-switcher');
    const initialLang = el._currentLang;
    langSwitcher.click();
    await el.updateComplete;
    assert.notEqual(el._currentLang, initialLang);
  });
});