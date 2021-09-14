import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import "normalize.css/normalize.css"

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import iconPicker from 'e-icon-picker';
import "e-icon-picker/lib/symbol.js"; //基本彩色图标库
import 'e-icon-picker/lib/index.css'; // 基本样式，包含基本图标
import 'font-awesome/css/font-awesome.min.css'; //font-awesome 图标库
import 'element-ui/lib/theme-chalk/icon.css'; //element-ui 图标库


Vue.config.productionTip = false
Vue.use(ElementUI);
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
//全局删除增加图标
Vue.use(iconPicker, {
  FontAwesome: true,
  ElementUI: true,
  eIcon: true,//自带的图标，来自阿里妈妈
  eIconSymbol: false,//是否开启彩色图标
  addIconList: [],
  removeIconList: []
});
// 注册一个全局自定义指令 `v-hasperm`
Vue.directive('hasperm', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el,binding) {
    if(binding.value){
      let btnPerms = JSON.parse(localStorage.getItem("btnList"))
     let hasPerm = btnPerms.some(item => item.permSign==binding.value)
      if(!hasPerm){
        el.remove();
      }
    }

  }
})