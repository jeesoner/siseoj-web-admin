import request from '@/api/http'

export function getRoles(params) {
  return request({
    url: 'admin/roles',
    method: 'get',
    params
  })
}

export function getAllRole() {
  const params = {
    current: 1,
    size: 9999
  }
  return request({
    url: 'admin/roles',
    method: 'get',
    params
  })
}

export function get(id) {
  return request({
    url: 'admin/roles/' + id,
    method: 'get'
  })
}

export function getByUseId(uid) {
  return request({
    url: 'admin/roles?uid=' + uid,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: 'admin/roles',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: 'admin/roles',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: 'admin/roles',
    method: 'delete',
    data: ids
  })
}

export default { getRoles, getByUseId, get, add, edit, del }
