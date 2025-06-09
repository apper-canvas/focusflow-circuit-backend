import HomePage from '@/components/pages/HomePage';
// NotFoundPage is typically handled by App.jsx directly for the catch-all route, 
// not usually part of the explicit route config for display purposes.

export const routes = {
  home: {
    id: 'home',
    label: 'Timer',
    path: '/timer',
    icon: 'Timer',
component: HomePage
  }
};

export const routeArray = Object.values(routes);