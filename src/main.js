import "lib-flexible/flexible.js";

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import VueAxios from "vue-axios";
import axios from "axios";
Vue.use(VueAxios, axios);

// 图标
import { Icon } from "vant";
Vue.use(Icon);
// 按钮
import { Button } from "vant";
Vue.use(Button);
// 布局
import { Row, Col } from "vant";
Vue.use(Row).use(Col);
// 单元格
import { Cell, CellGroup } from "vant";
Vue.use(Cell).use(CellGroup);
// 弹出层
import { Popup } from "vant";
Vue.use(Popup);
// 搜索框
import { Search } from "vant";
Vue.use(Search);
// 加载
import { Loading } from "vant";
Vue.use(Loading);
// Slider滑块
import { Slider } from "vant";
Vue.use(Slider);
// 导航栏
import { NavBar } from 'vant';
Vue.use(NavBar);
// 输入框
import { Field } from 'vant';
Vue.use(Field);
// 轻提示
import { Toast } from 'vant';
Vue.use(Toast);
// 轮播
import { Swipe, SwipeItem } from 'vant';
Vue.use(Swipe).use(SwipeItem);
// 懒加载
import { Lazyload } from 'vant';
Vue.use(Lazyload);
// 弹出框
import { Dialog } from 'vant';
Vue.use(Dialog);
// 标签页
import { Tab, Tabs } from 'vant';
Vue.use(Tab).use(Tabs);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
