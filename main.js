import {loadTranslations} from './utils/i18n.js';

(async () => {
  await loadTranslations();
  import('./router.js');
  import('./components/nav-bar.js');
  import('./views/employee-list-view.js');
  import('./views/employee-form-view.js');
})();
