import Vue from "vue";
import App from "./app";
import Vuex from "vuex";
import { stores } from "./store";
import "root/node_modules/iview/dist/styles/iview.css";

// vuex
Vue.use(Vuex);

// 按需引入iview组件
import { Button, Form, Input, Icon, Message } from "iview";
Vue.component("Form", Form);
Vue.component("FormItem", Form.Item);
Vue.component("Input", Input);
Vue.component("Button", Button);
Vue.component("Icon", Icon);
Vue.prototype.$Message = Message;

// init vuex
const store = new Vuex.Store(stores);
Vue.config.debug = true;

// init vue
new Vue({
    el: "#app",
    template: "<App/>",
    components: { App },
    store
});
