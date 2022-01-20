/**
 * @author chuzhixin 1204505056@qq.com （不想保留author可删除）
 * @description 登录、获取用户信息、退出登录、清除accessToken逻辑，不建议修改
 */

import Vue from 'vue'
import {login, getUserInfo} from '@/api/server/user'
import {
  getAccessToken,
  removeAccessToken,
  setAccessToken,
} from '@/utils/accessToken'
import {menus} from '@/api/router'
import {resetRouter} from '@/router'
import {title, tokenName} from '@/config'

const state = () => ({
  accessToken: getAccessToken(),
  username: '',
  avatar: '',
  permissions: [],
  email: '',
  mobile: '',
  isAdmin: 0
})
const getters = {
  accessToken: (state) => state.accessToken,
  username: (state) => state.username,
  avatar: (state) => state.avatar,
  permissions: (state) => state.permissions,
  email: (state) => state.email,
  mobile: (state) => state.mobile,
  isAdmin: (state) => state.isAdmin
}
const mutations = {
  setAccessToken(state, accessToken) {
    state.accessToken = accessToken
    setAccessToken(accessToken)
  },
  setUsername(state, username) {
    state.username = username
  },
  setAvatar(state, avatar) {
    state.avatar = avatar
  },
  setPermissions(state, permissions) {
    state.permissions = permissions
  },
  setEmail(state, email) {
    state.email = email
  },
  setMobile(state, mobile) {
    state.mobile = mobile
  },
  setIsAdmin(state, isAdmin) {
    state.isAdmin = isAdmin
  }
}
const actions = {
  setPermissions({commit}, permissions) {
    commit('setPermissions', permissions)
  },
  setAvatar({commit}, avatar) {
    commit("setAvatar", avatar)
  },
  async login({commit}, userInfo) {
    const {data: accessToken} = await login(userInfo)
    if (accessToken) {
      commit('setAccessToken', 'Bearer ' + accessToken)
      const hour = new Date().getHours()
      const thisTime =
        hour < 8
          ? '早上好'
          : hour <= 11
            ? '上午好'
            : hour <= 13
              ? '中午好'
              : hour < 18
                ? '下午好'
                : '晚上好'
      Vue.prototype.$baseNotify(`欢迎登录${title}`, `${thisTime}！`)
    } else {
      Vue.prototype.$baseMessage(
        `登录接口异常，未正确返回${tokenName}...`,
        'error'
      )
    }
  },
  async getUserInfo({commit, state}) {
    const {data} = await getUserInfo(state.accessToken)
    if (!data) {
      Vue.prototype.$baseMessage('验证失败，请重新登录...', 'error')
      return false
    }
    //这里应该也要加入权限
    let {username, userAvatar, userEmail, userMobile, isAdmin} = data
    if (username) {
      commit('setPermissions', menus)
      commit('setUsername', username)
      commit('setAvatar', userAvatar)
      commit('setEmail', userEmail)
      commit('setMobile', userMobile)
      commit('setIsAdmin', isAdmin)
      return menus
    } else {
      Vue.prototype.$baseMessage('用户信息接口异常', 'error')
      return false
    }
  },
  async logout({dispatch}) {
    // await logout(state.accessToken)
    await dispatch('resetAccessToken')
    await resetRouter()
  },
  resetAccessToken({commit}) {
    commit('setPermissions', [])
    commit('setAccessToken', '')
    removeAccessToken()
  },
}
export default {state, getters, mutations, actions}
