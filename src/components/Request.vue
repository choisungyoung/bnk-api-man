<template>
  <v-container>
    <v-row class="text-center" id="main-content">
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
        <v-tab v-for="item in requestTabs" :key="item" @click="refreshTabs()">
          {{ item }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="requestTab">
        <v-tab-item eager>
          <v-card flat max-height="250px">
            <Parameter
              ref="requestParameter"
              :data="requestParameter"
              :height="180"
              :dvcd="'edit'"
            />
          </v-card>
        </v-tab-item>
        <v-tab-item eager>
          <v-card flat max-height="250px">
            <Header
              ref="requestHeader"
              :data="requestHeader"
              :height="180"
              :dvcd="'edit'"
            />
          </v-card>
        </v-tab-item>
        <v-tab-item eager>
          <v-card flat>
            <Body ref="requestBody" v-model="requestBody" :height="180" />
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
    <br />
    <v-card elevation="2" height="350px">
      <v-tabs v-model="responseTab" color="success">
        <v-tab v-for="item in responseTabs" :key="item" @click="refreshTabs()">
          {{ item }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="responseTab">
        <v-tab-item eager>
          <v-card flat>
            <Body ref="responseBody" v-model="responseBody" :height="230" />
          </v-card>
        </v-tab-item>
        <v-tab-item eager>
          <v-card flat>
            <Parameter
              ref="responseCookie"
              :data="responseCookie"
              :height="180"
          /></v-card>
        </v-tab-item>
        <v-tab-item eager>
          <v-card flat>
            <Header
              ref="responseHeader"
              v-model="responseHeader"
              :height="230"
            />
          </v-card>
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
      url: "http://localhost:9999/FW/api/v1/login",
      /* REQUEST */
      requestBody:
        '{"userId":"9999999", "password":"chrldkagh1!","cmgrpCd":"01"}',
      requestHeader: {},
      requestParameter: {},

      /* RESPONSE */
      responseBody: "",
      responseHeader: {},
      responseCookie: {},
    };
  },
  mounted() {},
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
          let responseHeader = self.$refs.responseHeader;

          self.responseBody = JSON.stringify(response.data);
          self.responseHeader = response.headers;

          responseHeader.setHeader(self.responseHeader);
          // 쿠키 추가
        },
        (error) => {
          self.responseBody = JSON.stringify(error);
        }
      );
    },
    refreshTabs() {
      let self = this,
        requestParameter = self.$refs.requestParameter,
        requestHeader = self.$refs.requestHeader,
        responseCookie = self.$refs.responseCookie,
        responseHeader = self.$refs.responseHeader;
      setTimeout(() => {
        requestParameter.refreshLayout();
        requestHeader.refreshLayout();
        responseCookie.refreshLayout();
        responseHeader.refreshLayout();
      }, 100);
    },
  },
};
</script>
