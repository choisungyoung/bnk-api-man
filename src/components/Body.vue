<template>
  <div>
    <div @click="bodyClick">
      <prism-editor
        class="my-editor"
        v-model="body"
        ref="body"
        :readonly="!isEdit"
        :tab-size="4"
        :highlight="highlighter"
        :line-numbers="lineNumbers"
        @keyup="inputText"
      ></prism-editor>
    </div>
    <div align="right" class="mr-2 mt-1 body-2" v-if="isEdit">
      <span class="red--text">{{ bodyMessage }}</span>
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
    isEdit() {
      return this.dvcd == "edit";
    },
  },
  mounted() {
    let self = this;
    self.$refs.body.$el.style = "min-height: "+self.height+"px;max-height: "+self.height+"px;overflow-y: auto;";
    console.log("body", self.$refs.body);
    debugger;
  },
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
      let self = this,
        body = self.$refs.body;
      clearTimeout(this.debounce);
      this.debounce = setTimeout(() => {
        try {
          console.log(JSON.parse(self.body));
          self.setBody(JSON.parse(self.body));
          self.bodyMessage = "";
          body.$el.style.border = "";
        } catch (e) {
          if (self.dvcd === "edit") {
            self.bodyMessage = "JSON형식이 아닙니다.";
            //body.$el.style.border = "1px solid red";
          }
        }
      }, 1500);
    },
    clearBodyMessage() {
      let self = this;
      self.bodyMessage = "";
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
