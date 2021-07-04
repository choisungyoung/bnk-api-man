<template>
  <JsonEditor ref="jsonBody" :objData="jsonBody" v-model="jsonBody">
  </JsonEditor>
  <!--
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
export default {
  props: ["value", "height"],

  created() {},

  data() {
    return {
      body: this.value,
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

  methods: {
    setBody(value) {
      this.body = value;
    },
    getBody() {
      return this.body;
    },

    myInput(value) {
      this.$emit("input", value);
    },
  },
};
</script>
