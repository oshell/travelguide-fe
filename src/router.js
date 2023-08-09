
import {createRouter, createWebHistory } from 'vue-router';
import CityView from './components/CityView';
import CountryView from './components/CountryView';
import CountryOverview from './components/CountryOverview';
import CriteriaSearch from './components/CriteriaSearch';
import HomeView from './components/HomeView';


const routes = [
  { path: '/', component: HomeView, name: 'index' },
  { path: '/city/:id/:name', component: CityView, name: 'city' },
  { path: '/countries', component: CountryOverview, name: 'countries' },
  { path: '/country/:name', component: CountryView, name: 'country' },
  { path: '/search', component: CriteriaSearch, name: 'search' },
]


const router = createRouter({
  // 4. Provide the history implementation to use. We are using the hash history for simplicity here.
  history: createWebHistory(),
  routes, // short for `routes: routes`
});

export default router;

