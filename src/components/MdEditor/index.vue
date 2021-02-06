<template>
  <vue-simplemde ref="markdownEditor" v-model="content" :config="configs" />
</template>

<script>
import VueSimplemde from 'vue-simplemde'

export default {
  name: 'MdEditor',
  components: {
    VueSimplemde
  },
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      configs: {
        status: false,
        spellChecker: false,
        renderingConfig: {
          codeSyntaxHighlighting: true,
          highlightingTheme: 'atom-one-light'
        }
      }
    }
  }
}
</script>

<style>
  @import '~simplemde/dist/simplemde.min.css';
</style>
