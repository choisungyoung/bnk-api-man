<template>
    <v-textarea
        v-model="response"
        filled
        class="ml-5 mr-5 mt-5 mb-5"
        height="100%"
        color="success"
        value=""
    ></v-textarea>
</template>

<script>

export default {
    props: ["response"],
    components: {
    },
    data() {
        return {
        }
    },
}
</script>