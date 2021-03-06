import 'reflect-metadata';
import Vue from 'vue';
import App from '@/App.vue';

Vue.config.devtools = process.env.NODE_ENV === 'development';

//  composition-api
import VueCompositionApi from '@vue/composition-api';
Vue.use(VueCompositionApi);

import { initializeComponentHelper } from './components/ComponentHelper';
initializeComponentHelper();

// DI
import setupDi from './di/setupDi';
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
