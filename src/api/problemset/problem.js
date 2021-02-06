import request from '@/api/http'
import qs from 'qs'

export function getProblems(params) {
  return request({
    url: 'admin/problems?' + qs.stringify(params, { indices: false }),
    method: 'get'
  })
}

export function getProblem(id) {
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

export function del(ids) {
  return request({
    url: 'admin/problems',
    method: 'delete',
    data: ids
  })
}
