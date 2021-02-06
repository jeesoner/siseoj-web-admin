import request from '@/api/http'

export function getSourceAll() {
  return request({
    url: 'admin/sources/all',
    method: 'get'
  })
}
