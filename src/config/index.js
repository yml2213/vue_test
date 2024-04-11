const env = import.meta.env.MODE || 'prod'

const EnvConfig = {
  development:{
    baseApi:'/',
    mockApi: 'https://www.fastmock.site/mock/1877f671704d23e0a3d3ecbd318f77b6/api'
  },
  test:{
    baseApi:'/api',
    mockApi: 'https://www.fastmock.site/mock/1877f671704d23e0a3d3ecbd318f77b6/api'

  },
  prod:{
    baseApi:'/api',
    mockApi: 'https://www.fastmock.site/mock/1877f671704d23e0a3d3ecbd318f77b6/api'

  }
}
export  default {
  env,
  //开启或关闭mock
  ...EnvConfig[env]
}
