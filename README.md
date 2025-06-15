# Employee Management Application

[![Live Demo](https://img.shields.io/badge/Live%20Demo-employee--app--ruddy.vercel.app-brightgreen?style=flat-square&logo=vercel)](https://employee-app-ruddy.vercel.app/)

## 🚀 Overview

This project is a modern, fully tested **Employee Management Application** built with **LitElement (JavaScript)**. It is designed as a case study for ING and aims to provide HR staff with an intuitive, robust, and responsive interface to manage employee records.

- **Live Demo:** [https://employee-app-ruddy.vercel.app/](https://employee-app-ruddy.vercel.app/)

---

## 📚 Features

- **Employee Listing:**
  - View all employee records in both table and card (list) formats.
  - Pagination and search functionality for both views.
  - Edit and Delete actions for each employee.

- **Add Employee:**
  - Add a new employee with fields: First Name, Last Name, Employment Date, Birth Date, Phone, Email, Department (Analytics/Tech), Position (Junior/Medior/Senior).
  - Strong validation: required fields, email/phone format, unique email, logical date checks.

- **Edit Employee:**
  - Edit any employee record via a dedicated form.
  - Pre-filled form with current data.
  - Confirmation dialog before updating.

- **Delete Employee:**
  - Delete any employee with confirmation dialog.
  - Bulk delete support via selection checkboxes.

- **Navigation:**
  - Custom navigation bar for seamless page switching.
  - Client-side routing with Vaadin Router.

- **Localization:**
  - Full support for English and Turkish.
  - Language auto-detected from the root HTML `lang` attribute.

- **Responsive Design:**
  - Fully responsive for desktop and mobile.
  - No CSS frameworks (e.g., Bootstrap) used; all styles are custom.

- **State Management:**
  - Employee data is persisted in browser localStorage.
  - Custom store implementation for state updates and reactivity.

- **Testing:**
  - Detailed unit tests for all components and features.
  - >85% test coverage (see below for details).

---

## 🏗️ Project Structure

```
├── assets/           # Static assets (icons, images)
├── components/       # LitElement web components (employee-list, employee-form, nav-bar, confirm-dialog, etc.)
├── contants/         # Constants used throughout the app
├── locales/          # Localization files (en, tr)
├── store/            # State management (localStorage logic)
├── styles/           # Custom CSS
├── utils/            # Utility functions (i18n, validation, etc.)
├── views/            # Page-level components
├── index.html        # App entry point
├── main.js           # Main JS entry (router, app init)
├── router.js         # Vaadin Router setup
├── package.json      # Project metadata and scripts
├── rollup.config.js  # Rollup bundler config
├── test/             # Unit tests for all components
└── ...
```

---

## ⚙️ Getting Started

### 1. **Clone the Repository**
```sh
git clone https://github.com/isahanoncel/employee-app.git
cd employee-management-app
```

### 2. **Install Dependencies**
```sh
npm install
```

### 3. **Run Locally**
```sh
npm start
# or
npx web-dev-server --app-index index.html --node-resolve --open --watch --history-api-fallback
```

### 4. **Build for Production**
```sh
npm run build
```
- Output will be in the `dist/` directory.

### 5. **Run Tests**
```sh
npm test
```
- Coverage reports are generated automatically.

---

## 🧩 Key Components

- **<employee-list>**: Displays employees in table or card view, supports search, pagination, edit, and delete.
- **<employee-form>**: Add/edit employee form with validation and localization.
- **<confirm-dialog>**: Reusable confirmation dialog for delete/edit actions.
- **<nav-bar>**: Responsive navigation bar with language switcher.

---

## 🌍 Localization
- All UI text is localized (English & Turkish).
- Language is auto-detected from `<html lang="en">` or `<html lang="tr">`.
- Easily extendable for more languages via the `locales/` directory.

---

## 🧪 Testing & Coverage
- All components and business logic are covered by unit tests using [@open-wc/testing](https://open-wc.org/docs/testing/).
- Test coverage is >85%.
- To run tests and see coverage:
  ```sh
  npm test
  # Coverage report will be shown in the terminal and as HTML output
  ```

---

## 🛠️ Technical Highlights
- **LitElement**: Modern, fast, and lightweight web components.
- **Vaadin Router**: Client-side routing for SPA navigation.
- **Custom State Management**: No Redux, all logic is in `store/` and uses localStorage.
- **No CSS Frameworks**: All responsive design is hand-crafted.
- **Accessibility**: Semantic HTML, keyboard navigation, and ARIA attributes where appropriate.
- **CI/CD Ready**: Easily deployable to Vercel, Netlify, or any static host.

---

## 🌐 Live Demo
[https://employee-app-ruddy.vercel.app/](https://employee-app-ruddy.vercel.app/)

---

## 📋 Case Study Requirements Checklist

- [x] List all employee records (table & list view, pagination, search)
- [x] Add new employee (with validation)
- [x] Edit employee (with confirmation)
- [x] Delete employee (with confirmation & bulk delete)
- [x] Navigation menu
- [x] Client-side routing (Vaadin Router)
- [x] Responsive design (no CSS frameworks)
- [x] State management (localStorage)
- [x] Localization (EN/TR)
- [x] Unit tests (>85% coverage)
- [x] Working application, ready for review


> **This project was developed as a case study for ING.**
