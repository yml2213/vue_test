import request from './request'

export default {
    uploadTxt(fileContent) {
        return request({
            url: '/upload',
            method: 'post',
            data: fileContent
        })
    },
    getData(params) {
        return request({
            url: '/getData',
            method: 'post',
            data: params
        })
    },


    getUserData(params) {
        return request({
            url: '/user/getList',
            method: 'get',
            data: params,
        })
    },
    createUser(params) {
        return request({
            url: '/user/add',
            method: 'post',
            data: params,
        })
    },
    updateUser(params) {
        return request({
            url: '/user/edit',
            method: 'post',
            data: params,
        })
    },
    deleteUser(params) {
        return request({
            url: '/user/del',
            method: 'post',
            data: params,
        })
    },
    getMenu(params) {
        return request({
            url: '/permission/getMenu',
            method: 'post',
            data: params,
        })
    }
}
