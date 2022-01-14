import request from '@/utils/request'

export function getTypes() {
  return request({
    url: `/type/list`,
    method: 'get',
  })
}

