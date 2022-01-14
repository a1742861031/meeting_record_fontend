import request from '@/utils/request'
import qs from 'qs';

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data,
  })
}
export function getUserInfo(accessToken) {
  return request({
    url: '/user/userinfo',
    method: 'post',
  })
}

export function getList(current, limit, query) {
  if (query) {
    return request({
      url: `/user/list/${current}/${limit}/${query}`,
      method: 'get',
    })
  } else {
    return request({
      url: `/user/list/${current}/${limit}`,
      method: 'get',
    })
  }
}

export function deleteById(data) {
  return request({
    url: `/user/`,
    method: 'delete',
    params: {
      ids: data,
    },
    paramsSerializer: params => {
      return qs.stringify(params, {
        indices: false
      })
    }
  })
}

export function editUser(user) {
  return request({
    url: `/user/`,
    method: 'put',
    data: user
  })
}
export function editPassword(form) {
  return request({
    url: `/user/password`,
    method: 'put',
    data: form
  })
}

