import request from '@/utils/request'

export function addRecord(record) {
  return request({
    url: `/record`,
    method: 'post',
    data:record
  })
}

