<template>
  <v-textarea
    v-model="jsonBody"
    :height="height"
    filled
    class="ml-5 mr-5 mt-5 mb-5"
    color="success"
    @input="myInput"
  ></v-textarea>
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
        if (!this.body) {
          return "{}";
        }
        return this.body;
      },
      set(newValue) {
        this.body = newValue;
      },
    },
  },

  methods: {
    setBody(value) {
      this.body = value;
    },
    getBody() {
      return this.jsonBody;
    },

    myInput(value) {
      this.$emit("input", value);
    },
  },
};
</script>
