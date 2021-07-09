<template>
  <div>
    <div @click="bodyClick">
      <prism-editor
        class="my-editor"
        :tab-size="4"
        v-model="body"
        :highlight="highlighter"
        :line-numbers="lineNumbers"
        @keyup="inputText"
      ></prism-editor>
    </div>
    <div align="right" class="mr-2 body-2" v-if="isEdit">
      <span class="red--text">{{bodyMessage}}</span>
    </div>
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
  props: ["height", "dvcd"],
  components: {
    PrismEditor,
  },
  created() {},

  data() {
    return {
      body: "{}",
      lineNumbers: true,
      
      /** requestBodyMessage */
      bodyMessage: "",
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
    isEdit(){
      return this.dvcd == 'edit'
    }
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
    inputText() {
      let self = this;
      clearTimeout(this.debounce); 
      this.debounce = setTimeout(() => { 
        try {
          console.log(JSON.parse(self.body));
          self.setBody(JSON.parse(self.body));
          self.bodyMessage = "";
        }
        catch (e) {
          if (self.dvcd === "edit") {
            self.bodyMessage = "JSON형식이 아닙니다.";
          }
        }
      }, 2000);
    }
  },
};
</script>
<style>
div.prism-editor-wrapper {
  min-height: 220px;
  max-height: 220px;
  overflow-y: auto;
}
</style>
