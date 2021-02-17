import request from '@/utils/request'

// 查询考试报名列表
export function listKsbm(query) {
  return request({
    url: '/ksbm/ksbm/list',
    method: 'get',
    params: query
  })
}

// 查询考试报名详细
export function getKsbm(id) {
  return request({
    url: '/ksbm/ksbm/' + id,
    method: 'get'
  })
}

// 新增考试报名
export function addKsbm(data) {
  return request({
    url: '/ksbm/ksbm',
    method: 'post',
    data: data
  })
}

// 修改考试报名
export function updateKsbm(data) {
  return request({
    url: '/ksbm/ksbm',
    method: 'put',
    data: data
  })
}

// 删除考试报名
export function delKsbm(data) {
  return request({
    url: '/ksbm/ksbm/shanchu',
    method: 'post',
    data: data
  })
}

// 导出考试报名
export function exportKsbm(query) {
  return request({
    url: '/ksbm/ksbm/export',
    method: 'get',
    params: query
  })
}
