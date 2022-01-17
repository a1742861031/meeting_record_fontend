import request from '@/utils/request'

export function addRecord(record) {
  return request({
    url: `/record`,
    method: 'post',
    data:record
  })
}

export function getRecordList(current,limit) {
  return request({
    url: `/record/list/${current}/${limit}`,
    method: 'get'
  })
}

