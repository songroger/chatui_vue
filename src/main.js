import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";
import store from "./store";
// import SocketPlugin from "./plugins"

import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github';
import '@kangc/v-md-editor/lib/theme/style/github.css';

import hljs from 'highlight.js';

VMdPreview.use(githubTheme, {
  Hljs: hljs,
});

// import "./plugins/socketPlugin";

// Vue.config.productionTip = false;

const app = createApp(App);
app.use(router);
app.use(store);
app.use(VMdPreview);
app.mount("#app");
