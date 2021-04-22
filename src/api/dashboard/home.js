import request from '@/api/http'

export function getSystemInfo() {
  return request({
    url: 'admin/system',
    method: 'get'
  })
}
