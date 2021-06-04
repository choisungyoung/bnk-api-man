<template>
  <v-textarea
    :value="value"
    :height="height"
    @input="myInput"
    filled
    class="ml-5 mr-5 mt-5 mb-5"
    color="success"
  ></v-textarea>
</template>

<script>
export default {
  props: ["value", "height"],
  components: {},
  data() {
    return {
      body: null,
    };
  },
  created() {
    let self = this;
    self.body = this.data;
  },
  methods: {
    myInput(value) {
      this.$emit("input", value);
    },
  },
};
</script>
