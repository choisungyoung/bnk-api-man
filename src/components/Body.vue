<template>
  <div @click="bodyClick">
    <prism-editor
      class="my-editor"
      :tab-size="4"
      v-model="body"
      :highlight="highlighter"
      :line-numbers="lineNumbers"
    ></prism-editor>
  </div>
</template>

<script>
// import Prism Editor
import { PrismEditor } from "vue-prism-editor";
import "vue-prism-editor/dist/prismeditor.min.css"; // import the styles somewhere

// import highlighting library (you can use any library you want just return html string)
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-json";
import "prismjs/themes/prism-tomorrow.css"; // import syntax highlighting styles
export default {
  props: ["height"],
  components: {
    PrismEditor,
  },
  created() {},

  data() {
    return {
      body: "{}",
      lineNumbers: true,
    };
  },
  computed: {
    jsonBody: {
      get() {
        return this.body;
      },
      set(value) {
        this.body = value;
      },
    },
  },
  mounted() {},
  methods: {
    setBody(value) {
      this.body = JSON.stringify(value, null, 4);
    },
    getBody() {
      return JSON.parse(this.body);
    },
    setTextBody(text) {
      this.body = text;
    },

    myInput(value) {
      this.$emit("input", value);
    },
    highlighter(code) {
      return highlight(code, languages.json); // languages.<insert language> to return html with markup
    },

    bodyClick() {
      this.$children[0].$refs.textarea.focus();
    },
  },
};
</script>
<style>
div.prism-editor-wrapper {
  min-height: 250px;
  max-height: 250px;
  overflow-y: auto;
}
</style>
