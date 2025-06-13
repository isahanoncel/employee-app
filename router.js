import { Router } from '@vaadin/router';

const outlet = document.querySelector('#outlet');

const router = new Router(outlet);
router.setRoutes([
  { path: '/', component: 'employee-list-view' },
  { path: '/new', component: 'employee-form-view' },
  { path: '/edit/:id', component: 'employee-form-view' },
]);