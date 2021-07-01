<template>
  <v-card class="mx-auto" max-width="500" style="height:96vh">
    <v-sheet class="pa-4 grey lighten-1">
      <v-text-field
        v-model="search"
        label="Search Company Directory"
        dark
        dense
        flat
        solo-inverted
        hide-details
        clearable
        clear-icon="mdi-close-circle-outline"
      ></v-text-field>
      <v-checkbox
        v-model="caseSensitive"
        dense
        dark
        hide-details
        label="Case sensitive search"
      ></v-checkbox>
    </v-sheet>
    <v-card-text>
      <div align="right">
        <v-btn x-middle icon color="gray" @click="createRequest()">
          <v-icon dark>
            mdi-plus
          </v-icon>
        </v-btn>
      </div>

      <v-treeview
        :items="items"
        :search="search"
        :filter="filter"
        :open.sync="open"
        open-on-click
      >
        <template slot="label" slot-scope="{ item }">
          <div @click="selectRequest(item)">{{ item.name }}</div>
        </template>
      </v-treeview>
    </v-card-text>
  </v-card>
</template>

<script>
import DbAccessUtils from "@/util/DbAccessUtils";
import EventBus from "@/util/EventBus";
import Constants from "@/constants";

export default {
  props: ["listDvcd"],
  data: () => ({
    items: [],
    open: [1, 2],
    search: null,
    caseSensitive: false,
  }),
  computed: {
    filter() {
      return this.caseSensitive
        ? (item, search, textKey) => item[textKey].indexOf(search) > -1
        : undefined;
    },
  },
  created() {},

  mounted() {
    EventBus.$on("request:initRequestList", () => {
      this.initRequestList();
    });
  },

  watch: {
    listDvcd: () => {
      debugger;
      this.initRequestList();
    },
  },

  methods: {
    selectRequest(props) {
      EventBus.$emit("request:initRequestData", props.id);
    },
    createRequest() {
      var self = this;

      DbAccessUtils.saveRequest({
        name: "New Request",
        method: "GET",
        url: "",
      });
      self.initRequestList();
    },

    initRequestList() {
      var self = this;
      debugger;
      if (self.listDvcd == Constants.LIST_DVCD.REQUEST) {
        DbAccessUtils.findAllRequestById().then((res) => {
          self.items = [];
          for (var row of res) {
            var item = {
              id: row.id,
              name: row.name,
            };

            self.items.push(item);
          }
        });
      } else if (self.listDvcd == Constants.LIST_DVCD.HISTORY) {
        DbAccessUtils.findAllRequestHistoryById().then((res) => {
          self.items = [];
          for (var row of res) {
            var item = {
              id: row.id,
              name: row.url,
            };

            self.items.push(item);
          }
        });
      }
    },
  },
};
</script>
