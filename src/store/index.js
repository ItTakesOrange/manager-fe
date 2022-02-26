/**
 * Vuex状态管理
 */
import { createStore } from 'vuex'
import mutations from './mutations'
import storage from '../utils/storage'

const state = {
  userInfo: storage.getItem('userInfo') || {},
  menuList: storage.getItem('menuList'),
  actionList: storage.getItem('actionList'),
  noticeCount: storage.getItem('noticeCount')
}

export default createStore({
  state,
  mutations
})
