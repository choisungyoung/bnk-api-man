<template>
  <v-container>
    <v-row class="text-center">
      <v-col class="d-flex" cols="2">
        <v-select
          :items="methodItems"
          v-model="method"
          label="METHOD"
          color="success"
        ></v-select>
      </v-col>
      <v-col class="d-flex" cols="8">
        <v-text-field
          v-model="url"
          label="URL"
          color="success"
          clearable
        ></v-text-field>
      </v-col>
      <v-col class="d-flex" cols="2">
        <v-btn class="ma-2" color="success" large @click="requestApi()">
          Send
        </v-btn>
      </v-col>
    </v-row>

    <v-card elevation="2" height="300px">
      <v-tabs v-model="requestTab" color="success">
        <v-tab v-for="item in requestTabs" :key="item">
          {{ item }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="requestTab">
        <v-tab-item>
          <v-card flat max-height="250px">
            <Parameter ref="requestParameter" :data="param" :height="180" />
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat max-height="250px">
            <Header ref="requestHeader" :data="param" :height="180" />
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <Body ref="requestBody" v-model="requestBody" :height="180" />
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
    <br />
    <v-card elevation="2" height="350px">
      <v-tabs v-model="responseTab" color="success">
        <v-tab v-for="item in responseTabs" :key="item">
          {{ item }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="responseTab">
        <v-tab-item>
          <v-card flat>
            <Body ref="responseBody" v-model="responseBody" :height="230" />
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat> </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat> </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-container>
</template>

<script>
import Parameter from "@/components/Parameter";
import Header from "./Header.vue";
import Body from "./Body.vue";
import Request from "@/Request";

export default {
  name: "Request",
  components: {
    Parameter,
    Header,
    Body,
  },
  data() {
    return {
      methodItems: ["GET", "POST"],
      requestTab: null,
      requestTabs: ["params", "header", "body"],
      responseTab: null,
      responseTabs: ["body", "cookies", "header"],
      method: null,
      url: null,
      /* REQUEST */
      requestBody: null,
      requestHeader: null,
      param: null,

      /* RESPONSE */
      responseBody: null,
      responseHeader: null,
      cookie: null,
    };
  },
  methods: {
    requestApi() {
      let self = this,
        requestParameter = self.$refs.requestParameter,
        requestHeader = self.$refs.requestHeader,
        requestBody = self.requestBody;

      let requestData = {
        method: self.method,
        url: self.url,
      };

      if (requestParameter != null && requestParameter.getParameter() != null) {
        requestData.params = requestParameter.getParameter();
      }
      if (requestHeader != null && requestHeader.getHeader() != null) {
        requestData.headers = requestHeader.getHeader();
      }
      if (requestBody != null && requestBody != "") {
        requestData.data = JSON.parse(requestBody);
      }

      return Request(requestData).then(
        (response) => {
          let result = response.data;
          self.responseBody = JSON.stringify(result);
        },
        (error) => {
          self.responseBody = JSON.stringify(error);
        }
      );
    },
  },
};
</script>
