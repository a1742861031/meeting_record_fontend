import request from '@/utils/request'

export function addRecord(record) {
  return request({
    url: `/record`,
    method: 'post',
    data: record
  })
}

export function getRecordList(current, limit) {
  return request({
    url: `/record/list/${current}/${limit}`,
    method: 'get'
  })
}


export function getRecordById(id) {
  return request({
    url: `/record/show/${id}`,
    method: 'get'
  })
}

export function getEditRecord(id) {
  return request({
    url: `/record/edit/${id}`,
    method: 'get'
  })
}


export function editRecord(record) {
  return request({
    url: `/record/`,
    method: 'put',
    data: record
  })
}
