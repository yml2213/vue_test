import Mock from 'mockjs'

export default {
  getMenu: config => {
    const {username, password} = JSON.parse(config.body);
    if (username === "admin" && password === "1234") {
      return {
        code: 200,
        data: {
          menu: [
            {
              path: '/home',
              name: 'home',
              label: "首页",
              icon: 'HomeFilled',
              url: '/home/Home.vue'
            },
            {
              path: '/mall',
              name: 'mall',
              label: "商品管理",
              icon: 'video-play',
              url: '/mall/Mall.vue'
            },
            {
              path: '/user',
              name: 'user',
              label: "用户管理",
              icon: 'user',
              url: '/user/User.vue'
            },
            {
              label: '其他',
              icon: 'location',
              children: [
                {
                  path: "/page1",
                  name: "page1",
                  label: "页面1",
                  icon: "setting",
                  url: "PageOne.vue"
                },
                {
                  path: "/page2",
                  name: "page2",
                  label: "页面2",
                  icon: "setting",
                  url: "PageTwo.vue"
                },
              ]
            }
          ],
          token:  Mock.Random.guid(),
          message: "获取成功"
        }
      }
    } else if (username === "fff" && password === "fff") {
      return {
        code: 200,
        data: {
          menu: [
            {
              path: '/home',
              name: 'home',
              label: "首页",
              icon: 'HomeFilled',
              url: '/home/Home.vue'
            },
            {
              path: '/user',
              name: 'user',
              label: "用户管理",
              icon: 'user',
              url: '/user/User.vue'
            },
            {
              label: '其他',
              icon: 'location',
              children: [
                {
                  path: "/page1",
                  name: "page1",
                  label: "页面1",
                  icon: "setting",
                  url: "PageOne.vue"
                },
                {
                  path: "/page2",
                  name: "page2",
                  label: "页面2",
                  icon: "setting",
                  url: "PageTwo.vue"
                },
              ]
            }
          ],
          token:  Mock.Random.guid(),
          message: "获取成功"
        }
      }
    } else {
      return {
        code: -999,
        data: {
          message: "账号或密码错误"
        }
      }
    }
  }
}
