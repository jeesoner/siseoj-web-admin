import request from '@/api/http'

export function getContests(params) {
  return request({
    url: 'admin/contest',
    method: 'get',
    params
  })
}

export function get(id) {
  return request({
    url: 'admin/contest/' + id,
    method: 'get'
  })
}

export function add(data) {
  return request({
    url: 'admin/contest',
    method: 'post',
    data
  })
}

export function edit(data) {
  return request({
    url: 'admin/contest',
    method: 'put',
    data
  })
}

export function del(id) {
  return request({
    url: 'admin/contest',
    method: 'delete',
    data: id
  })
}

/**
 * 获取比赛题目列表
 */
export function getContestProblem(id) {
  return request({
    url: 'admin/contest/problem-list/?cid=' + id,
    method: 'get'
  })
}

/**
 * 获取比赛题目
 */
export function getProblems(id, params) {
  return request({
    url: `admin/contest/${id}/problems`,
    method: 'get',
    params
  })
}

export function updateContestProblem(data) {
  return request({
    url: 'admin/contest/problem-list',
    method: 'put',
    data
  })
}

export default { getContests, get, add, edit, del, getProblems, getContestProblem, updateContestProblem }
