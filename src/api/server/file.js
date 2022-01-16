import request from '@/utils/request'

export function uploadFile(file) {
  return request({
      url: `/file/upload`,
      method: 'post',
      data: file,
      headers: {
        'Content-Type':
          'multipart/form-data'
      }
    }
  )
}

