import request from '@/api/http'

export function getUsers(params) {
  return request({
    url: 'admin/users',
    method: 'get',
    params
  })
}

export function get(id) {
  return request({
    url: 'admin/users/' + id,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: 'admin/users',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: 'admin/users',
    method: 'put',
    data
  })
}

export function del(ids) {
  return request({
    url: 'admin/users',
    method: 'delete',
    data: ids
  })
}

export default { getUsers, get, add, edit, del }
