import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const path = require('path')
console.log(__dirname);

function resolve_path (dir) {
  return path.join(__dirname, './', dir)
}


export default {
  plugins: [
    vue()
  ],
  //本地运行基础路径，如：http://localhost:5173/awecloud/bmq/
  base: "/awecloud/bmq/",
  clearScreen:false,
  resolve:{
    //别名，代码引入时方便引入
    alias:{
      '@':resolve_path('src'),
    }
  },
  css:{
    devSourcemap:true,//代码编排，调试时是否能看到源码
  },
  server:{
    host:'0.0.0.0',//host配置，0.0.0.0会添加本地ip，开启局域网访问路径
    hmr:true,//热更新
    proxy: {
      // 选项写法
      '/msg/system':{
        target: 'https://msg.wodcloud.com/msg/system', // 所要代理的目标地址
        rewrite: path => path.replace(/^\/msg\/system/, ''), // 重写传过来的path路径，比如 `/api/index/1?id=10&name=zs`（注意:path路径最前面有斜杠（/），因此，正则匹配的时候不要忘了是斜杠（/）开头的；选项的 key 也是斜杠（/）开头的）
        changeOrigin: true,  // true/false, Default: false - changes the origin of the host header to the target URL
        secure: false,//解决证书缺失问题
      },
      '/msg/application':{
        target: 'https://msg.wodcloud.com/msg/application', // 所要代理的目标地址
        rewrite: path => path.replace(/^\/msg\/application/, ''), // 重写传过来的path路径，比如 `/api/index/1?id=10&name=zs`（注意:path路径最前面有斜杠（/），因此，正则匹配的时候不要忘了是斜杠（/）开头的；选项的 key 也是斜杠（/）开头的）
        changeOrigin: true,  // true/false, Default: false - changes the origin of the host header to the target URL
        secure: false,//解决证书缺失问题
      },
      '/msg/dict':{
        target: 'https://msg.wodcloud.com/msg/dict', // 所要代理的目标地址
        rewrite: path => path.replace(/^\/msg\/dict/, ''), // 重写传过来的path路径，比如 `/api/index/1?id=10&name=zs`（注意:path路径最前面有斜杠（/），因此，正则匹配的时候不要忘了是斜杠（/）开头的；选项的 key 也是斜杠（/）开头的）
        changeOrigin: true,  // true/false, Default: false - changes the origin of the host header to the target URL
        secure: false,//解决证书缺失问题
      },
      '/msg/mgt':{
        target: 'https://msg.wodcloud.com/msg/mgt', // 所要代理的目标地址
        rewrite: path => path.replace(/^\/msg\/mgt/, ''), // 重写传过来的path路径，比如 `/api/index/1?id=10&name=zs`（注意:path路径最前面有斜杠（/），因此，正则匹配的时候不要忘了是斜杠（/）开头的；选项的 key 也是斜杠（/）开头的）
        changeOrigin: true,  // true/false, Default: false - changes the origin of the host header to the target URL
        secure: false,//解决证书缺失问题
      },
      '/msg/sms':{
        target: 'https://msg.wodcloud.com/msg/sms', // 所要代理的目标地址
        rewrite: path => path.replace(/^\/msg\/sms/, ''), // 重写传过来的path路径，比如 `/api/index/1?id=10&name=zs`（注意:path路径最前面有斜杠（/），因此，正则匹配的时候不要忘了是斜杠（/）开头的；选项的 key 也是斜杠（/）开头的）
        changeOrigin: true,  // true/false, Default: false - changes the origin of the host header to the target URL
        secure: false,//解决证书缺失问题
      },
    }
  },
  build:{
    outDir:'dist/awecloud/bmq',//打包输出文件夹
    assetsDir:'static',//打包输出静态文件
  },
  
}
