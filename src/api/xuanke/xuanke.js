import request from '@/utils/request'

// 查询用户选课列表
export function listXuanke(query) {
  return request({
    url: '/xuanke/xuanke/list',
    method: 'get',
    params: query
  })
}

// 查询用户选课详细
export function getXuanke(id) {
  return request({
    url: '/xuanke/xuanke/' + id,
    method: 'get'
  })
}

// 新增用户选课
export function addXuanke(data) {
  return request({
    url: '/xuanke/xuanke',
    method: 'post',
    data: data
  })
}

// 修改用户选课
export function updateXuanke(data) {
  return request({
    url: '/xuanke/xuanke',
    method: 'put',
    data: data
  })
}

// 删除用户选课
export function delXuanke(data) {
  return request({
    url: '/xuanke/xuanke/shanchu',
    method: 'post',
    data: data
  })
}

// 导出用户选课
export function exportXuanke(query) {
  return request({
    url: '/xuanke/xuanke/export',
    method: 'get',
    params: query
  })
}
