//路由前端原则可以不写，但是需要在recorder中记录，防止以后忘记
//不用新建父路由的文件，父路由全部由parent/parent.vue来支撑
import {createRouter, createWebHashHistory} from "vue-router";
import store from '../store'


//写入初始必须有的路由
const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../page/login/index.vue')
  },
  {
    path: '/',
    name: 'index',
    component: () => import('../page/welcom.vue'),
  },
  {
    path: '/404',
    component: () => import('../page/404.vue')
  }
]

//重新创建router
function newRouterFunc(){
  return createRouter({
    history: createWebHashHistory(),
    routes
  });
}

const router = newRouterFunc()

function inWhiteList(toPath) {
  //配置白名单
  const whiteList = ['/login']
  const path = whiteList.find((value) => {
    // 使用正则匹配
    const reg = new RegExp('^' + value)
    return reg.test(toPath)
  })
  return !!path
}

router.beforeEach((to, from, next) => {

  const userInfo = store.state.userInfo
  
  // 检查to.path是否存在于免登陆白名单
  if (inWhiteList(to.path)) {
    next()
  } else {
    // 判断是否已经登录，未登录则重定向到首页或其他页面（通过query传参记录原来的路径）
    // 根据配置判断是否跳转第三方登录，跳转第三方登录则不跳login
    // axios封装中也需要对是否登录过期进行判断，如果登录过期，则跳转登录页，具体跳转地址根据配置来·
    if (!userInfo) {
      next({
        path: '/login',
      })
    } else {
      
    }
  }

  //判读是否匹配，否则跳转404
  if (to.matched.length !== 0) {
    next()
  } else {
    return next({ path: '/404' })
  }
})


// 在路由完成初始导航时调用，如果有异步操作放置到这里
// 请求相应的角色和菜单
// router.onReady(() => {
//   generateRoutes()
// })

export function generateRoutes() {
  const _asyncRoutes = store.state.route

  if (_asyncRoutes) {
    //动态添加路由

    _asyncRoutes.forEach(e => {
      router.addRoute(e)
    });
  }

  router.addRoute(
    {
      path: '/:pathMatch(.*)',
      redirect: '/404'
    }
  )

}

//新创建一个router替代之前的router，并把matcher方法替换成新的router的matcher
export function resetRouter() {
  const newRouter = newRouterFunc()
  router.matcher = newRouter.matcher
}


export default router
