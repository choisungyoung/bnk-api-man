<template>
  <v-container>
    <v-app-bar app clipped-right flat height="72">
      <v-responsive max-width="300" class="pt-6">
        <v-text-field
          color="success"
          label="Group Name"
          outlined
          clearable
          dense
        >
        </v-text-field>
      </v-responsive>
      <v-responsive class="pt-6 ml-3">
        <v-text-field
          color="success"
          label="Request Name"
          v-model="name"
          outlined
          clearable
          dense
        >
        </v-text-field>
      </v-responsive>
      <v-btn
        color="blue-grey"
        class="ma-2 white--text"
        @click="saveRequest"
        min-width="100"
        max-width="200"
      >
        save
      </v-btn>
    </v-app-bar>
    <v-row id="main-content">
      <v-col class="d-flex" cols="2">
        <v-select
          :items="methodItems"
          v-model="method"
          label="METHOD"
          color="success"
        ></v-select>
      </v-col>
      <v-col cols="10" sm="6" md="">
        <v-text-field
          v-model="url"
          label="URL"
          color="green"
          clearable
        ></v-text-field>
      </v-col>
      <v-col cols="auto">
        <v-btn
          class="ma-2"
          color="success"
          large
          @click="requestApi()"
          min-width="100"
          max-width="200"
        >
          Send
        </v-btn>
      </v-col>
    </v-row>

    <v-card elevation="2" height="300px">
      <v-tabs v-model="requestTab" color="success">
        <v-tab v-for="item in requestTabs" :key="item" @click="refreshTabs()">
          {{ item }}
        </v-tab>

        <v-btn
          color="blue-grey"
          class="ma-2 white--text mr-12"
          @click="openRightDrawer"
          absolute
          right
        >
          global data
          <v-icon right dark>
            mdi-table
          </v-icon>
        </v-btn>

        <v-btn
          icon
          color="blue-grey"
          absolute
          right
          class="ma-2 white--text mr-1"
          large
          @click="addGlobalData"
        >
          <v-icon>mdi-arrow-down-bold</v-icon>
        </v-btn>
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
            <Parameter ref="responseCookie" :data="responseCookie" :height="210"
          /></v-card>
        </v-tab-item>
        <v-tab-item eager>
          <v-card flat>
            <Header
              ref="responseHeader"
              v-model="responseHeader"
              :height="210"
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
import DbAccessUtils from "@/util/DbAccessUtils";
//import { convertGridDataToJsonData } from "@/util/GridUtils";
import EventBus from "@/util/EventBus";
import Constants from "@/constants";
import { convertJsonDataToGridData } from "@/util/GridUtils";

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

      id: null,
      method: null,
      url: "http://localhost:9999/FW/api/v1/login",
      name: "",

      /* REQUEST */
      requestBody: {},
      requestHeader: {},
      requestParameter: {},

      /* RESPONSE */
      responseBody: {},
      responseHeader: {},
      responseCookie: {},

      /* ADD된 상태인지 */
      isAddGlobalData: false,
    };
  },

  created() {},
  mounted() {
    var self = this;
    EventBus.$on("request:initRequestData", (requestId) => {
      self.requestTab = 0;
      // request list에서 requet 선택시 호출
      DbAccessUtils.findAllRequestById(requestId).then(async (res) => {
        if (res && res.length > 0) {
          let request = res[0];
          let result = {
            id: request.id,
            name: request.name,
            method: request.method,
            url: request.url,
            requestParameter: [],
            requestHeader: [],
            requestBody: {},
          };

          var requestData = await DbAccessUtils.findAllRequestDataByRequestId(
            request.id
          );

          console.log("findAllRequestDataByRequestId", requestData);
          result.requestParameter = requestData.parameter;
          result.requestHeader = requestData.header;
          debugger;
          if (requestData.body && requestData.body.length > 0) {
            result.requestBody = JSON.parse(requestData.body[0].value);
          }
          self.initRequestData(result);
        }
      });
    });

    EventBus.$on("request:initRequestHistory", (historyId) => {
      self.requestTab = 0;
      // request list에서 requet 선택시 호출
      DbAccessUtils.findAllRequestHistoryById(historyId).then(async (res) => {
        if (res && res.length > 0) {
          let history = res[0];
          let result = {
            //id: history.id,
            // 히스토리 저장시 INSERT 가 되게하기 위해 ID는 세팅하지 않음 DbAccessUtil.saveRequest 메소드 참고
            method: history.method,
            url: history.url,
            requestParameter: [],
            requestHeader: [],
            requestBody: {},
          };
          if (self.isJsonString(history.requestParameter)) {
            result.requestParameter = convertJsonDataToGridData(
              JSON.parse(history.requestParameter)
            );
          }
          if (self.isJsonString(history.requestHeader)) {
            result.requestHeader = convertJsonDataToGridData(
              JSON.parse(history.requestHeader)
            );
          }
          if (self.isJsonString(history.requestBody)) {
            result.requestBody = JSON.parse(history.requestBody);
          }
          self.initRequestData(result);
        }
      });
    });
  },
  methods: {
    async requestApi() {
      let self = this,
        requestParameter = self.$refs.requestParameter,
        requestHeader = self.$refs.requestHeader,
        requestBody = self.$refs.requestBody;

      let requestData = {
        method: self.method,
        url: self.url,
      };
      let loader = this.$loading.show({
        // Optional parameters
        container: this.fullPage ? null : this.$refs.formContainer,
        canCancel: true,
        onCancel: this.onCancel,
      });
      // simulate AJAX
      setTimeout(() => {}, 5000);
      // request grid 데이터 로드
      if (requestParameter) {
        requestData.params = requestParameter.getParameter();
      }
      if (requestHeader) {
        requestData.headers = requestHeader.getHeader();
      }
      if (requestBody) {
        try {
          requestData.data = requestBody.getBody();
        } catch (e) {
          console.log(e);
        }
      }

      console.log("requestData", requestData);

      //Request 실행
      let responseHeader = self.$refs.responseHeader,
        responseBody = self.$refs.responseBody;

      Request(requestData).then(
        (response) => {
          responseHeader.setHeader(response.headers);
          responseBody.setBody(response.data);
          // 쿠키 추가
          loader.hide();
        },
        (error) => {
          responseBody.setBody(error);
          loader.hide();
        }
      );

      requestData.params = JSON.stringify(requestData.params);
      requestData.headers = JSON.stringify(requestData.headers);
      requestData.data = JSON.stringify(requestData.data);
      // Request History 저장
      DbAccessUtils.saveRequestHistory(requestData);
      // history list 목록 갱신
      EventBus.$emit("request:initRequestList");
    },

    saveRequest() {
      let self = this,
        requestParameter = self.$refs.requestParameter,
        requestHeader = self.$refs.requestHeader,
        requestBody = self.requestBody;

      if (!self.name) {
        this.$toasted.global.errorToast({
          message: "requet name을 입력하세요",
        });
        return;
      }
      if (!self.url) {
        this.$toasted.global.errorToast({ message: "requet url을 입력하세요" });
        return;
      }
      if (!self.method) {
        this.$toasted.global.errorToast({
          message: "requet method를 입력하세요",
        });
        return;
      }

      // Request 테이블에 insert
      DbAccessUtils.saveRequest({
        id: self.id,
        name: self.name,
        url: self.url,
        method: self.method,
      }).then(async (requestId) => {
        // insert 성공시 RaquestData 저장

        requestParameter.blur();
        requestHeader.blur();
        await DbAccessUtils.deleteAllRequestDataByRequestId(requestId);
        debugger;
        if (requestBody) {
          // body 저장
          var bodyData = {
            id: requestId,
            value: JSON.stringify(self.requestBody),
            type: Constants.DATA_TYPE.BODY,
          };
          console.log("saveRequestBody", requestBody);
          await DbAccessUtils.saveRequestData(bodyData); // db 저장
        }

        if (requestParameter.getGridData()) {
          for (var param of requestParameter.getGridData()) {
            param.type = Constants.DATA_TYPE.PARAMETER;
            param.id = requestId;
            console.log("saveParameter", param);

            await DbAccessUtils.saveRequestData(param);
          }
        }
        if (requestHeader.getGridData()) {
          for (var header of requestHeader.getGridData()) {
            header.type = Constants.DATA_TYPE.HEADER;
            header.id = requestId;
            console.log("saveHeader", header);
            await DbAccessUtils.saveRequestData(header);
          }
        }
        this.$toasted.global.successToast();
        EventBus.$emit("request:initRequestList");
      });
    },

    initRequestData(request) {
      let self = this,
        refs = self.$refs;

      self.id = request.id;
      self.name = request.name;
      self.method = request.method;
      self.url = request.url;

      refs.requestParameter.setGridData(request.requestParameter);
      refs.requestHeader.setGridData(request.requestHeader);
      refs.requestBody.setBody(request.requestBody);

      refs.responseHeader.clearData();
      refs.responseCookie.clearData();
      refs.responseBody.setBody({});
      self.refreshTabs();
    },

    async addGlobalData() {
      // GlobalData를 REQUEST에 추가
      var self = this,
        refs = self.$refs;
      // global grid 데이터 로드
      let globalData = await DbAccessUtils.findAllGlobalDataByType();
      // parameter overwrite
      let globalParameter = globalData.parameter;
      let requestParameter = refs.requestParameter.getGridData();
      requestParameter = self.overwriteGridData(
        requestParameter,
        globalParameter
      );

      // Header overwrite
      let globalHeader = globalData.header;
      let requestHeader = refs.requestHeader.getGridData();
      requestHeader = self.overwriteGridData(requestHeader, globalHeader);

      // Body overwrite
      let globalBody = globalData.body;
      let requestBody = {};

      requestBody = refs.requestBody.getBody();
      requestBody = self.overwriteJson(requestBody, globalBody);

      // 에러가 없을 경우 SetData
      refs.requestParameter.setGridData(requestParameter);
      refs.requestHeader.setGridData(requestHeader);
      refs.requestBody.setBody(requestBody);
      this.$toasted.global.successToast();
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
    openRightDrawer() {
      this.$emit("input");
    },
    overwriteJson(target, source) {
      if (!target) {
        target = {};
      }
      if (!source) {
        source = {};
      }
      for (var key in source) {
        target[key] = source[key];
      }

      return target;
    },

    removeOverwritedJson(target, source) {
      if (!target) {
        target = {};
      }
      if (!source) {
        source = {};
      }
      for (var key in source) {
        delete target[key];
      }

      return target;
    },

    overwriteGridData(target, source) {
      if (!target) {
        target = {};
      }
      if (!source) {
        source = {};
      }
      let newTarget = [];

      target.slice().forEach(function(tgt) {
        newTarget.push({
          key: tgt.key,
          value: tgt.value,
          description: tgt.description,
        });
      });

      source
        .slice()
        .reverse()
        .forEach(function(src) {
          var isAdd = true;
          for (var ntgt of newTarget) {
            if (src.key === ntgt.key) {
              ntgt.value = src.value;
              ntgt.description = src.description;
              isAdd = false;
              break;
            }
          }
          if (isAdd) {
            newTarget.unshift(src);
          }
        });
      return newTarget;
    },

    removeOverwritedGridData(target, source) {
      if (!target) {
        target = [];
      }
      if (!source) {
        source = [];
      }
      for (var src of source) {
        for (var i = 0; i < target.length; i++) {
          if (src.key === target[i].key) {
            target.splice(i, 1);
            break;
          }
        }
      }
    },
    isJsonString(str) {
      try {
        var json = JSON.parse(str);
        return typeof json === "object";
      } catch (e) {
        console.log("json 형태가 아닙니다.", str);
        return false;
      }
    },
  },
};
</script>
