//作为路由的记录，避免无法找到相应的路由
var router = [
  {
    path: "/msg",
    name: "msg",
    component: () => import("../page/main/msg.vue"),
  },
  {
    path: "/app",
    name: "app",
    component: () => import("../page/main/app-manager.vue"),
  },
  {
    path: "/config",
    name: "config",
    component: () => import("../page/main/config.vue"),
  },
  {
    path: "/set/list",
    name: "setList",
    component: () => import("../page/main/set/list.vue"),
  },
  {
    path: "/smsList",
    name: "smsList",
    component: () => import("../page/main/sms-list.vue"),
  },
  {
    path: "/smsTemplate",
    name: "smsTemplate",
    component: () => import("../page/main/sms-template.vue"),
  },
];
