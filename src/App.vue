<template>
  <v-app id="inspire">
    <v-system-bar app>
      <v-spacer></v-spacer>
      <v-icon>mdi-square</v-icon>
      <v-icon>mdi-circle</v-icon>
      <v-icon>mdi-triangle</v-icon>
    </v-system-bar>

    <v-app-bar app clipped-right flat height="72">
      <v-responsive max-width="300" class="pt-6">
        <v-text-field
          color="success"
          label="GroupName"
          outlined
          clearable
          dense
        >
        </v-text-field>
      </v-responsive>
      <v-responsive class="pt-6 ml-3">
        <v-text-field color="success" label="ApiName" outlined clearable dense>
        </v-text-field>
      </v-responsive>
      <v-spacer></v-spacer>

      <v-responsive max-width="200">
        <v-btn
          color="blue-grey"
          class="ma-2 white--text"
          @click="rightDrawer = true"
        >
          global data
          <v-icon right dark>
            mdi-table
          </v-icon>
        </v-btn>
      </v-responsive>
    </v-app-bar>

    <v-navigation-drawer v-model="leftDrawer" app width="350" 
      style="z-index: 998;">
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
        ></v-avatar>

        <v-divider class="mx-3 my-5"></v-divider>

        <v-avatar
          v-for="n in 6"
          :key="n"
          class="d-block text-center mx-auto mb-9"
          color="grey lighten-1"
          size="28"
        ></v-avatar>
      </v-navigation-drawer>

      <!-- <v-sheet color="grey lighten-5" height="128" width="100%"></v-sheet> -->
      <GroupList class="ml-14" />
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
        <v-tab v-for="item in globalDataTabs" :key="item">
          {{ item }}
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="globalDataTab">
        <v-tab-item>
          <v-card flat>
            <Parameter 
              ref="globalParameter"
              :data="globalParameter"
              :height="300"
              :dvcd="'edit'"/>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <Header
              ref="globalHeader"
              :data="globalHeader"
              :height="300"
              :dvcd="'edit'"
            />
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <v-card flat>
            <Body ref="globalBody" v-model="globalBody" :height="300" />
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-navigation-drawer>

    <v-main style="background:#FCFCFC">
      <!--  -->
      <Request />
    </v-main>
  </v-app>
</template>

<script>
import Request from "@/components/Request";
import Parameter from "@/components/Parameter";
import Header from "@/components/Header";
import Body from "@/components/Body";
import GroupList from "@/components/GroupList";
import {initTable, fineAllGlobalDataByType, saveGlobalData, deleteAllGlobalData} from "@/util/DbAccessUtils";

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
    leftDrawer: true,
    rightDrawer: false,
    group: null,
    globalDataTab: null,
    globalDataTabs: ["params", "header", "body"],
    globalParameter: [],
    globalHeader: [],
    globalBody: "",
  }),
  
  mounted() {
    initTable();
  },

  methods: {
    inputEvent : function(isOpening) {
      if(!isOpening) {
        // 닫힐 경우 저장
        debugger;
        deleteAllGlobalData();
        this.globalParameter.type = '01';
        this.globalParameter.key = '00';
        this.globalParameter.value = '11';
        this.globalParameter.description = '222';
        saveGlobalData(this.globalParameter);
        fineAllGlobalDataByType('01');
      }
    },

    fineAllGlobalData : function(type) {
      var result = fineAllGlobalDataByType(type);
      console.log("result", result);
    }
  }
};
</script>
