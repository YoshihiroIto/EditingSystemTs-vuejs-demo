import 'reflect-metadata';
import Vue from 'vue';
import App from './App.vue';
import VueCompositionApi from '@vue/composition-api';
import setupDi from './setupDi';

Vue.use(VueCompositionApi);

Vue.config.productionTip = false;

setupDi();

new Vue({
  render: h => h(App),
}).$mount('#app');
