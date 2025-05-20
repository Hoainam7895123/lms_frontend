import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import { ServerTable } from "v-tables-3";
import axios from "axios";
import VueSweetalert2 from "vue-sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import "../src/assets/css/styles.css";
import VueApexCharts from "vue3-apexcharts";

axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;

axios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    config.headers = {
      Authorization: "JWT " + localStorage.getItem("jwt"),
      "Content-Type": "application/json",
    };
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

function refreshAccessToken() {
  localStorage.setItem("jwt", "");
  location.href = "/";
  return axios
    .post(`/api/refresh_token`, {
      refresh_token: localStorage.getItem("jwt_refresh"),
    })
    .then((r) => {
      let data = r.data;
      if (data.error) {
        throw "Can not retry token";
      } else {
        localStorage.setItem("jwt", data.access_token);
        return data.access_token;
      }
    });
}

// Response interceptor for API calls
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const access_token = await refreshAccessToken();
        axios.defaults.headers.common["Authorization"] =
          "Bearer " + access_token;
      } catch (error) {
        // Can not get refresh access token
        // Raise logout event
        localStorage.setItem("jwt", "");
        location.href = "/";
        return Promise.reject("Can not refresh token");
      }
      console.log("retry request");
      return axios(originalRequest);
    }
    return Promise.reject(error);
  }
);

const app = createApp(App);
window.axios = require("axios");
app.use(VueApexCharts);
app.use(VueSweetalert2);
app.use(store); // ✅ Đăng ký Vuex store vào app

app.use(router);
app.use(ServerTable);
import VueUploadComponent from "vue-upload-component";
app.component("file-upload", VueUploadComponent);
app.component("v-select", vSelect);

//import VueCoreVideoPlayer from 'vue-core-video-player'
//app.use(VueCoreVideoPlayer)

app.mount("#app");
