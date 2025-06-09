import Home from '../pages/Home';
import NotFound from '../pages/NotFound';

export const routes = {
  home: {
    id: 'home',
    label: 'Timer',
    path: '/timer',
    icon: 'Timer',
    component: Home
  }
};

export const routeArray = Object.values(routes);