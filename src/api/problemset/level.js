import request from '@/api/http'

export function getLevelAll() {
  return request({
    url: 'admin/levels/all',
    method: 'get'
  })
}
