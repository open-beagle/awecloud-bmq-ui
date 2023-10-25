<template>
  <div class="bg-tags">
    <ul>
      <li v-for="(tag, index) in tags" :key="'tag_' + index" class="tag-item">
        <span>
          {{ tag }}
        </span>
        <a @click="deleteTag(index)" v-if="!disabled">
          <i class="el-icon-close"></i>
        </a>
      </li>
      <li v-if="!disabled">
        <el-button
          type="primary2"
          size="mini"
          @click="showInput = true"
          v-if="!showInput"
        >
          新增
        </el-button>
        <el-input v-model="newTag" @blur="addTag" v-else />
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "BgTags",
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      newTag: "",
      showInput: false,
    };
  },
  computed: {
    tags() {
      return (this.value && this.value.split(",")) || [];
    },
  },
  methods: {
    deleteTag(index) {
      let tags = [...this.tags];

      tags.splice(index, 1);

      this.$emit("change", tags.join(","));
    },
    addTag() {
      let tags = [...this.tags];

      if (this.newTag) {
        tags.push(this.newTag);
      }

      this.$emit("change", tags.join(","));
      this.newTag = "";
      this.showInput = false;
    },
  },
};
</script>
