<template>
  <prism-editor
    class="my-editor"
    v-model="body"
    :highlight="highlighter"
    :line-numbers="lineNumbers"
  ></prism-editor>
  <!--
  <div>
    <h2>vue-code-highlight example</h2>
    <code-highlight language="javascript">
      <textarea>
      var a ;
      </textarea>
    </code-highlight>
  </div>
  -->
  <!--
  <JsonEditor ref="jsonBody" :objData="jsonBody" v-model="jsonBody">
  </JsonEditor>
  <v-textarea
    v-model="jsonBody"
    :height="height"
    filled
    class="ml-5 mr-5 mt-5 mb-5"
    color="success"
    @input="myInput"
  ></v-textarea>
  -->
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
      body: "",
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

    myInput(value) {
      this.$emit("input", value);
    },
    highlighter(code) {
      return highlight(code, languages.json); // languages.<insert language> to return html with markup
    },
  },
};
</script>
<style>
div.prism-editor-wrapper {
  max-height: 230px;
  overflow-y: auto;
}
</style>
