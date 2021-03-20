import request from '@/api/http'

export function getAllSource() {
  return request({
    url: 'admin/sources/all',
    method: 'get'
  })
}

export function getSources(params) {
  return request({
    url: 'admin/sources',
    method: 'get',
    params
  })
}

export function get(id) {
  return request({
    url: 'admin/sources/' + id,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: 'admin/sources',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: 'admin/sources',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'admin/sources',
    method: 'delete',
    data: ids
  })
}

export default { getSources, get, add, edit, del }
