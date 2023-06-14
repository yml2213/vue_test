import Mock from 'mockjs'
import store from '../../store/index.js';

function param2Obj(url) {
  const search = url.split('?')[1];
  if (!search) {
    return {};
  }
  return JSON.parse(
      '{"' +
      decodeURIComponent(search)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"')
      + '"}'
  );
}

let List = []
const count = 200;
for (let i = 0; i < count; i++) {
  List.push(
      Mock.mock({
            id: Mock.Random.guid(),
            name: Mock.Random.cname(),
            addr: Mock.mock('@county(true)'),
            'age|18-60': 1,
            birth: Mock.Random.date(),
            sex: Mock.Random.integer(0, 1)
          }
      )
  );
}

export default {

  getUserList: config => {
    //做个缓存吧，不然每次刷新都不一样
    const {name, page, limit} = param2Obj(config.url);
    const total = List.length;
    //if (store.state.UserList.length > 0) {
    //  console.log("执行缓存");
    //  List = store.state.UserList[0];
    //} else if (store.state.UserList.length === 0){
    //  store.commit('saveGetUserList', List);
    //}
    //过滤结果
    const mockList = List.filter(u => {
      //模糊查询地址和姓名
      return !(name && u.name.indexOf(name) === -1 && u.addr.indexOf(name)
          === -1);
    })
    //过滤条数
    const pageList = mockList.filter((item, index) => index < limit * page
        && index >= limit * (page - 1));
    return {
      code: 200,
      data: {
        count: mockList,
        list: pageList,
        total: total
      },
      message: "获取用户数据成功"
    }
  },
  createUser: config => {
    const {name, addr, age, birth, sex} = JSON.parse(config.body);
    console.log(JSON.parse(config.body).name);
    List.unshift({
      id: Mock.Random.guid(),
      name: name,
      addr: addr,
      age: age,
      birth: birth,
      sex: sex
    });
    return {
      code: 200,
      data: "新增成功",
    };
  },
  updateUser: config => {
    const {id, name, addr, age, birth, sex} = JSON.parse(config.body);
    const sex_num = parseInt(sex)

    List.some(u => {
      if (u.id === id) {
        console.log("匹配成功，执行修改操作")
        u.name = name;
        u.sex = sex_num;
        u.age = age;
        u.addr = addr;
        u.birth = birth;
        return true
      }
    });
    return {
      code: 200,
      data: "修改成功"
    };
  },

  deleteUser: config => {
    const {id} = JSON.parse(config.body);
    if (!id) {
      return {
        code: 999,
        message: "参数不正确"
      }
    }
    //更新缓存数据
    List = List.filter(u => u.id !== id);
    const newList = List;
    store.commit('saveGetUserList', List);
    return {
      code: 200,
      data: "删除成功"
    }
  }
}

