import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

Vue.config.productionTip = false

const firebaseConfig = {
  apiKey: "AIzaSyBPMo8EwFh0LOksgoo9dk0pRUbnDo1_7EY",
  authDomain: "personal-site-3e6db.firebaseapp.com",
  projectId: "personal-site-3e6db",
  storageBucket: "personal-site-3e6db.appspot.com",
  messagingSenderId: "869045107736",
  appId: "1:869045107736:web:cc638d2eef12c53f16976d",
  measurementId: "G-XKL1H5MF6W"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
