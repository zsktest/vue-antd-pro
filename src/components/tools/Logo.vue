<template>
  <div class="logo">
    <img src="@/assets/logo.png" style="width:25px;height:25px;" />
    <h1 v-if="showTitle">{{ title }}</h1>
  </div>
</template>

<script>

export default {
  name: 'Logo',
  components: {
  },
  props: {
    title: {
      type: String,
      default: '影刀控制台',
      required: false
    },
    showTitle: {
      type: Boolean,
      default: true,
      required: false
    }
  },
  methods: {
    toggle () {
      this.$emit('toggle')
    }
  }
}
</script>
