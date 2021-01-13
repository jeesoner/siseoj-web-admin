import request from '@api/http'

export function getUserInfo(id) {
  return request({
    url: '/users',
    method: 'get',
    data: {
      id
    }
  })
}
