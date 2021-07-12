<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="leftDrawer"
      app
      width="400"
      style="z-index: 200;"
    >
      <v-navigation-drawer
        v-model="leftDrawer"
        absolute
        color="grey lighten-3"
        mini-variant
      >
        <v-avatar
          class="d-block text-center mx-auto mt-4"
          color="grey darken-1"
          size="36"
        >
        <v-icon dark>
          mdi-account-circle
        </v-icon>
      </v-avatar>

        <v-divider class="mx-3 my-5"></v-divider>
        <v-btn-toggle
          style="flex-direction: column;"
          tile
          color="success"
          group
          :value="0"
        >
          <v-btn
            v-for="tab in tabs"
            :key="tab.listDvcd"
            icon
            x-large
            class="d-block text-center mx-auto mb-2"
            @click="setListDvcd(tab)"
          >
            <v-icon dark>
              {{ tab.iconName }}
            </v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-navigation-drawer>

      <!-- <v-sheet color="grey lighten-5" height="128" width="100%"></v-sheet> -->
      <GroupList
        ref="requestList"
        class="ml-14"
        :listDvcd="listDvcd"
        :listTitle="listTitle"
      />
      <!--
      <v-list class="pl-14" shaped>
        <v-list-item v-for="n in 5" :key="n" link>
          <v-list-item-content>
            <v-list-item-title>Item {{ n }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      -->
    </v-navigation-drawer>

    <v-navigation-drawer
      v-model="rightDrawer"
      app
      clipped
      right
      absolute
      temporary
      width="40%"
      style="z-index: 999;"
      @input="inputEvent"
    >
      <v-list>
        <v-list-item link>
          <v-list-item-content>
            <v-list-item-title class="text-h5">
              GLOBAL DATA
            </v-list-item-title>
            <v-list-item-subtitle class="text-h6"
              >Group Name</v-list-item-subtitle
            >
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-tabs v-model="globalDataTab" color="success">
        <v-tab
          v-for="item in globalDataTabs"
          :key="item"
          @click="refreshTabs()"
        >
          {{ item }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="globalDataTab" ref="globalTabs">
        <v-tab-item eager>
          <v-card flat>
            <Parameter
              ref="globalParameter"
              :data="globalParameter"
              :height="300"
              :dvcd="'edit'"
            />
          </v-card>
        </v-tab-item>
        <v-tab-item eager>
          <v-card flat>
            <Header
              ref="globalHeader"
              :data="globalHeader"
              :height="300"
              :dvcd="'edit'"
            />
          </v-card>
        </v-tab-item>
        <v-tab-item eager>
          <v-card flat>
            <Body ref="globalBody" v-model="globalBody" :height="300" />
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-navigation-drawer>

    <v-main style="background:#FCFCFC">
      <!--  -->
      <Request v-on:input="openRightDrawer()" />
    </v-main>
  </v-app>
</template>

<script>
import Request from "@/components/Request";
import Parameter from "@/components/Parameter";
import Header from "@/components/Header";
import Body from "@/components/Body";
import GroupList from "@/components/GroupList";
import Constants from "@/constants";
import DbAccessUtils from "@/util/DbAccessUtils";

export default {
  name: "App",

  components: {
    Request,
    Parameter,
    Header,
    Body,
    GroupList,
  },

  data: () => ({
    listDvcd: Constants.LIST_DVCD.REQUEST,
    listTitle: "Request",

    leftDrawer: true,
    rightDrawer: false,
    group: null,
    globalDataTab: null,
    globalDataTabs: ["params", "header", "body"],
    globalParameter: {},
    globalHeader: {},
    globalBody: {},

    tabs: [
      {
        listDvcd: Constants.LIST_DVCD.REQUEST,
        listTitle: "Request",
        iconName: "mdi-send",
      },
      {
        listDvcd: Constants.LIST_DVCD.HISTORY,
        listTitle: "History",
        iconName: "mdi-history",
      },
    ],
  }),

  created() {
    var self = this;
    self.initTable();
  },

  methods: {
    async initTable() {
      var refs = this.$refs;
      await DbAccessUtils.initTable();
      refs.requestList.initRequestList();
    },

    inputEvent: function(isOpening) {
      let refs = this.$refs,
        globalParameter = refs.globalParameter,
        globalHeader = refs.globalHeader,
        globalBody = refs.globalBody;

      if (!isOpening) {
        // 닫힐 경우 저장
        // 모두 지우고 3개 grid정보 저장
        let globalData = {};
        refs.globalParameter.blur();
        refs.globalHeader.blur();
        DbAccessUtils.deleteAllGlobalData();

        // grid 데이터 가져오기
        if (globalParameter != null && globalParameter.getGridData() != null) {
          globalData.parameter = globalParameter.getGridData();
        }
        if (globalHeader != null && globalHeader.getGridData() != null) {
          globalData.header = globalHeader.getGridData();
        }
        if (globalBody) {
          try {
            globalData.body = JSON.stringify(globalBody.getBody());
          } catch(e) {
            this.$toasted.global.errorToast({
              message: "GLOBAL BODY가 JSON형식이 아닙니다.",
            });
            return true;
          }
          var bodyData = {};
          bodyData.value = globalData.body;
          bodyData.type = Constants.DATA_TYPE.BODY;
          console.log("saveBody", bodyData);
          DbAccessUtils.saveGlobalData(bodyData); // db 저장
        }
        // grid 데이터 db에 저장
        if (globalData.parameter) {
          for (var param of globalData.parameter) {
            param.type = Constants.DATA_TYPE.PARAMETER;
            console.log("saveParameter", param);
            DbAccessUtils.saveGlobalData(param);
          }
        }
        if (globalData.header) {
          for (var header of globalData.header) {
            header.type = Constants.DATA_TYPE.HEADER;
            console.log("saveHeader", header);
            DbAccessUtils.saveGlobalData(header);
          }
        }
        this.$toasted.global.successToast();
      } else {

        // grid 초기화
        globalParameter.clearData();
        globalHeader.clearData();
        this.$refs.globalBody.setBody({});

        // 열릴때 DB 데이터 로드
        DbAccessUtils.findAllGlobalDataByType(
          Constants.DATA_TYPE.PARAMETER
        ).then((res) => {
          console.log("findParameter", res);
          globalParameter.setGridData(res);
        });
        DbAccessUtils.findAllGlobalDataByType(Constants.DATA_TYPE.HEADER).then(
          (res) => {
            console.log("findHeader", res);
            globalHeader.setGridData(res);
          }
        );
        DbAccessUtils.findAllGlobalDataByType(Constants.DATA_TYPE.BODY).then(
          (res) => {
            console.log("findBody", res);
            if (res && res.length > 0) {
              this.$refs.globalBody.setBody(JSON.parse(res[0].value));
            }
          }
        );
      }
    },

    findAllGlobalData: function(type) {
      var result = DbAccessUtils.findAllGlobalDataByType(type);
      console.log("result", result);
    },

    refreshTabs() {
      let self = this,
        globalParameter = self.$refs.globalParameter,
        globalHeader = self.$refs.globalHeader;
      setTimeout(() => {
        globalParameter.refreshLayout();
        globalHeader.refreshLayout();
      }, 100);
    },

    openRightDrawer() {
      this.rightDrawer = true;
    },

    setListDvcd(item) {
      this.listDvcd = item.listDvcd;
      this.listTitle = item.listTitle;
    },
  },
};
</script>
