# awecloud-bmq-ui

## template project

<https://cloud.wodcloud.com/git/beagle/vue3-base>

```bash
# 初始化模板
git remote add template ssh://git@cloud.wodcloud.com:10022/beagle/vue3-base.git
git fetch template
git merge template/master

# 初始登录地址
http://localhost:4173/awecloud/bmq/
admin/admin
```

## debug

```bash
yarn serve
```

## build

```bash
docker run -it --rm \
-v $PWD/:/go/src/github.com/open-beagle/awecloud-bmq-ui \
-w /go/src/github.com/open-beagle/awecloud-bmq-ui \
registry.cn-qingdao.aliyuncs.com/wod/node:v18 \
yarn build
```
