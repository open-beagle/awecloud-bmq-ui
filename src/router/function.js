var adminMenu = [
    // {
    //   name: "应用管理",
    //   path: "/app-manager",
    // },
    {
      name: "消息监控",
      path: "/msg",
    },
    {
      name: "短信清单",
      path: "/sms-list",
    },
    {
      name: "系统字典",
      path: "/config",
    },
    {
      name: "短信模板",
      path: "/sms-template",
    },
    {
      name: "首选项",
      path: "/set",
      children:[
        {
          name:'首选项',
          path:"/set/list"
        }
      ]
    }
  ]


function getViews(path) {
  // 首先把你需要动态路由的组件地址全部获取,示例项目主项目放入了main，如果直接放入page，需要去掉/main
  let pathArr = path.split('/')
  let modules = {}
  switch (pathArr.length) {
    case 2:
      modules = import.meta.glob('../page/main/**.vue')
      break;
    case 3:
      modules = import.meta.glob('../page/main/**/*.vue')
      break;
    case 4:
      modules = import.meta.glob('../page/main/**/**/*.vue')
      break;
    case 5:
      modules = import.meta.glob('../page/main/**/**/**/*.vue')
      break;
    default:
      break;
  }
  // 然后动态路由的时候这样来取
  return modules['../page/main' + path + '.vue']
}

//处理路由方法
var menuToRouter = (menu)=>{
  menu.forEach(e => {
    if(e.children){
      e.component = () => import('../page/parent/parent.vue')
      menuToRouter(e.children)
    }else{
      console.log(`@/page/main${e.path}.vue`);
      e.component= getViews(e.path)
    }
  });
}

export default {
    adminMenu,
    menuToRouter
}