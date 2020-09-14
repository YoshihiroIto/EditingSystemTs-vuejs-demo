import 'reflect-metadata';
import Vue from 'vue';
import App from './App.vue';

//  composition-api
import VueCompositionApi from '@vue/composition-api';
Vue.use(VueCompositionApi);

// DI
import setupDi from './setupDi';
setupDi();

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
library.add(faChevronDown, faChevronRight);
Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;
new Vue({
  render: h => h(App),
}).$mount('#app');
