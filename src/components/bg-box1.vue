<template>
    <div class="box">
      <div class="title-box">
        <span class="title_text">{{title}}</span>
        <div class="toggle_box">
          <slot name="toggleBox"></slot>
        </div>
      </div>
      <slot></slot>
  </div>
</template>

<script setup>
const props = defineProps({
    title: {
      type: String,
      required: true
    }
})

</script>
<script>
export default {
    
}
</script>

<style scoped>
.box {
  width: 100%;
  height: 100%;
}
.title-box{
  width: 100%;
  height: 42px;
  background-image: url('../assets/imgs/title_bg.png');
  background-repeat: no-repeat;
  background-position: center left;
  background-size: contain;
  position: relative;
}
.title_text {
  display: inline-block;
  padding-left: 18px;
  padding-top: 6px;
	font-size: 22px;
  font-weight: 600;
	color: #b2f1ff;
}
.toggle_box {
  position: absolute;
  right: 0;
  height: 42px;
  top: 0;
}
</style>