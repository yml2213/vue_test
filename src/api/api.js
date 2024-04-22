import request from './request'

export default {


    upSettings(params) {
        return request({
            url: '/upSettings',
            method: 'post',
            data: params
        })
    },
    doTask() {
        return request({
            url: '/doTask',
            method: 'post',
        })
    },
    stopTask(){
        return request({
            url: '/stop',
            method: 'get',
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
