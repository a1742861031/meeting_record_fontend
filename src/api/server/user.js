import request from '@/utils/request'
import { tokenName } from '@/config/setting.config'

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
    url: `/user/${id}`,
    method: 'delete',
    data,
  })
}
