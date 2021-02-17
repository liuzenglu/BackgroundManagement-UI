import request from '@/utils/request'

// 查询成绩列表
export function listChengji(query) {
  return request({
    url: '/chengji/chengji/list',
    method: 'get',
    params: query
  })
}

// 查询成绩详细
export function getChengji(id) {
  return request({
    url: '/chengji/chengji/' + id,
    method: 'get'
  })
}

// 新增成绩
export function addChengji(data) {
  return request({
    url: '/chengji/chengji',
    method: 'post',
    data: data
  })
}

// 修改成绩
export function updateChengji(data) {
  return request({
    url: '/chengji/chengji',
    method: 'put',
    data: data
  })
}

// 删除成绩
export function delChengji(id) {
  return request({
    url: '/chengji/chengji/' + id,
    method: 'delete'
  })
}

// 导出成绩
export function exportChengji(query) {
  return request({
    url: '/chengji/chengji/export',
    method: 'get',
    params: query
  })
}

// 查询成绩列表
export function banjilist(query) {
  return request({
    url: '/chengji/chengji/banjilist',
    method: 'get',
    params: query
  })
}
