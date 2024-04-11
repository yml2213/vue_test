import {createStore} from "vuex";
import Cookie from "js-cookie"

export default createStore({
  state: {
    isCollapse: true,
    currentMenu: null,
    tabsList: [{
      path: '/',
      name: 'home',
      label: '主程序',
      icon: 'home'
    }],
    UserList: [],
    menu: [],
    token: ''
  },
  mutations: {
    updateIsCollapse(state, payload) {
      console.log(state.isCollapse);

      state.isCollapse = !state.isCollapse;
    },
    selectMenu(state, val) {
      val.name === 'home' ? (state.currentMenu = null) : (state.currentMenu =
          val)
      if (val.name === 'home') {
        state.currentMenu = null;
      } else {
        state.currentMenu = val;
        let result = state.tabsList.findIndex(item => item.name === val.name)
        {
          result === -1 ? state.tabsList.push(val) : '';
        }
      }
    },
    closeTab(state, val) {
      let index = state.tabsList.findIndex(item => item.name === val.name)
      state.tabsList.splice(index, 1);
    },
    saveGetUserList(state, list) {
      state.UserList.push(list);
    },
    setMenu(state, val) {
      state.menu = val;
      localStorage.setItem('menu', JSON.stringify(val));
    },
    addMenu(state, router) {
      const localMenu = localStorage.getItem('menu');
      if (!localMenu) {
        return;
      }
      const menu = JSON.parse(localMenu);
      state.menu = menu;
      const menuArray = [];
      menuArray.forEach(item => {
        router.addRoute('Main', item)
      })
    },
    cleanMenu(state) {
      state.menu = [];
      localStorage.removeItem('menu');
    },
    setToken(state, val) {
      localStorage.setItem('token',val)
      state.token = val;
    },
    clearToken(state) {
      Cookie.remove('token');
      state.token = '';
    },
    getToken(state) {
      state.toekn = state.token || Cookie.get('token');
    }

  }
})
