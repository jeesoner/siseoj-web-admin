import request from '@/api/http'

// 获取所有标签
export function getAll() {
  return request({
    url: 'admin/tags/all',
    method: 'get'
  })
}

export function get(id) {
  return request({
    url: 'admin/tags/' + id,
    method: 'get'
  })
}

// 分页条件查询
export function getTags(params) {
  return request({
    url: 'admin/tags',
    method: 'get',
    params
  })
}

export function add(data) {
  return request({
    url: 'admin/tags',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: 'admin/tags',
    method: 'put',
    data
  })
}

export function del(ids) {
  return request({
    url: 'admin/tags',
    method: 'delete',
    data: ids
  })
}

export default { add, del, edit, get }
