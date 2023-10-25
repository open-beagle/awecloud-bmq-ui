// debounce.js
/**
 * 防抖与节流
 * @param {function} func 执行函数
 * @param {number} time 防抖节流时间
 * @param {string} type debounce为防抖,throttle为节流，否则为立即执行
 * @param {this} ctx this 的指向
 */

 const debounce = (func, time, type, ctx) => {
    var timer, lastCall, rtn
    // 防抖函数
    if (type === 'debounce') {
      rtn = (...params) => {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => {
          func.apply(ctx, params)
        }, time)
      }
    } else if (type === 'throttle') {
      // 节流函数
      rtn = (...params) => {
        const now = new Date().getTime()
        if (now - lastCall < time && lastCall) return
        lastCall = now
        func.apply(ctx, params)
      }
    } else {
      // 立即执行的防抖函数
      rtn = (...params) => {
        if (timer) clearTimeout(timer)
        let callNow = !timer
        timer = setTimeout(() => {
          timer = null
        }, time)
        if (callNow) func.apply(ctx, params)
      }
    }
    return rtn
  }
  
  export default {
    name: 'Debounce',
    abstract: true,
    props: {
      time: {
        type: Number,
        default: 1000,
      },
      events: {
        type: String,
        default: 'click', // 默认点击事件
      },
      type: {
        type: String,
        default: 'throttle', // 默认节流
      },
    },
    created() {
      this.eventKeys = this.events.split(',') // 分隔事件
      this.originMap = {} // 储存事件，用于重新render时与子事件的对比
      this.debouncedMap = {} // 储存防抖节流事件
    },
    render() {
      try {
        const vnode = this.$slots.default[0]
        this.eventKeys.forEach(key => {
          const target = vnode.data.on[key]
          if (target === this.originMap[key] && this.debouncedMap[key]) {
            vnode.data.on[key] = this.debouncedMap[key]
          } else if (target) {
            this.originMap[key] = target
            this.debouncedMap[key] = debounce(target, this.time, this.type, vnode)
            vnode.data.on[key] = this.debouncedMap[key] // 重写子组件的事件
          }
        })
        return vnode
      } catch (error) {}
    },
  }
  