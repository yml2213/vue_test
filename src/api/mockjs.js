import Mock from 'mockjs'
import userApi from './mockData/user.js'
import permissionApi from './mockData/permission.js'

Mock.mock(/user\/getList/, userApi.getUserList);
Mock.mock(/user\/add/, 'post', userApi.createUser);
Mock.mock(/user\/edit/, 'post', userApi.updateUser);
Mock.mock(/user\/del/, 'post', userApi.deleteUser);

Mock.mock(/permission\/getMenu/, 'post', permissionApi.getMenu);
