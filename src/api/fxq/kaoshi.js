import request from '@/utils/request'

// 查询考试安排列表
export function listKaoshi(query) {
  return request({
    url: '/fxq/kaoshi/list',
    method: 'get',
    params: query
  })
}

// 查询考试安排详细
export function getKaoshi(id) {
  return request({
    url: '/fxq/kaoshi/' + id,
    method: 'get'
  })
}

// 新增考试安排
export function addKaoshi(data) {
  return request({
    url: '/fxq/kaoshi',
    method: 'post',
    data: data
  })
}

// 修改考试安排
export function updateKaoshi(data) {
  return request({
    url: '/fxq/kaoshi',
    method: 'put',
    data: data
  })
}

// 删除考试安排
export function delKaoshi(id) {
  return request({
    url: '/fxq/kaoshi/' + id,
    method: 'delete'
  })
}

// 导出考试安排
export function exportKaoshi(query) {
  return request({
    url: '/fxq/kaoshi/export',
    method: 'get',
    params: query
  })
}getCourseList

export function getCourseList(query) {
  return request({
    url: '/fxq/kaoshi/getCourseList',
    method: 'get',
    params: query
  })
}
