import request from './request'

export default {
  getTableData(params) {
    return request({
      url: '/home/getTableData',
      method: 'get',
      data: params,
      mock: true
    })
  },
  getCountData(params) {
    return request({
      url: '/home/getCountData',
      method: 'get',
      data: params,
      mock: true
    })
  },
  getEchartsData(params) {
    return request({
      url: '/home/getOrderData',
      method: 'get',
      data: params,
      mock: true
    })
  },

  getUserData(params) {
    return request({
          url: '/user/getList',
          method: 'get',
          data: params,
          mock: false
    })
  },
  createUser(params) {
    return request({
      url: '/user/add',
      method: 'post',
      data: params,
      mock: false
    })
  },
  updateUser(params) {
    return request({
      url: '/user/edit',
      method: 'post',
      data: params,
      mock: false
    })
  },
  deleteUser(params) {
    return request({
      url: '/user/del',
      method: 'post',
      data: params,
      mock: false
    })
  },
  getMenu(params){
    return request({
      url: '/permission/getMenu',
      method: 'post',
      data: params,
      mock: false
    })
  }
}
