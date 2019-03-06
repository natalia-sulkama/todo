import Vue from 'vue';
import Framework7 from 'framework7/framework7.esm.bundle.js';
import Framework7Vue from 'framework7-vue/framework7-vue.esm.bundle.js';
import 'framework7/css/framework7.bundle.css';
import '../css/icons.css';
import '../css/app.css';
import App from '../components/app.vue';

Framework7.use(Framework7Vue)

new Vue({
  el: '#app',
  render: (h) => h(App),
  components: {
    app: App
  }
});