import request from '@/api/http'

export function getProblems(params) {
  return request({
    url: 'admin/problems',
    method: 'get',
    params
  })
}

export function getProblemCase(pid) {
  return request({
    url: 'admin/problems/case?pid=' + pid,
    method: 'get'
  })
}

export function getProblemInfo(id) {
  return request({
    url: 'admin/problems/' + id,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: 'admin/problems',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: 'admin/problems',
    method: 'put',
    data
  })
}

export function updateAuth(data) {
  return request({
    url: 'admin/problems/auth',
    method: 'put',
    data
  })
}

export function del(ids) {
  return request({
    url: 'admin/problems',
    method: 'delete',
    data: ids
  })
}
