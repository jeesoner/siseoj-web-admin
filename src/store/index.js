import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import settings from './modules/settings'
import app from './modules/app'
import user from './modules/user'
import api from './modules/api'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    user,
    api
  },
  getters
})

export default store
