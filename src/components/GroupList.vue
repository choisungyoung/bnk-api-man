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
      <v-container>
        <v-row no-gutters>
          <v-col cols="12" sm="6" md="" align-self="center">
            <h3>
              <strong>{{ listTitle }}</strong>
            </h3>
          </v-col>
          <v-col cols="6" md="4">
            <div align="right">
              <v-btn
                x-small
                icon
                color="gray"
                @click="createRequest()"
                v-show="isRequest"
              >
                <v-icon dark>
                  mdi-plus
                </v-icon>
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>

      <v-treeview
        :items="items"
        :search="search"
        :filter="filter"
        :open.sync="open"
        open-on-click
        activatable
        color="success"
        @update:active="selectRequest"
      >
        <template slot="label" slot-scope="{ item }">
          <div v-if="item.children">
            {{ item.name }}
          </div>
          <div v-else>
            <v-hover v-slot:default="{ hover }">
              <div>
                <v-row no-gutters>
                  <v-col cols="12" sm="6" md="" align-self="center">
                    <span
                      style="width: 200px;display: block;overflow: hidden;text-overflow: ellipsis; white-space: nowrap; "
                    >
                      {{ item.name }}
                    </span>
                  </v-col>
                  <v-col cols="auto">
                    <div align="right" width="30px">
                      <v-menu bottom left small :offset-y="true">
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn icon small v-bind="attrs" v-on="on">
                            <v-icon v-if="hover">mdi-dots-vertical</v-icon>
                          </v-btn>
                        </template>

                        <v-list>
                          <v-list-item
                            link
                            icon
                            small
                            @click="duplicateRequest(item)"
                            v-show="isRequest"
                          >
                            <v-list-item-icon>
                              <v-icon>mdi-content-copy</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>duplicate</v-list-item-title>
                          </v-list-item>

                          <v-list-item
                            link
                            icon
                            small
                            @click="deleteRequest(item)"
                          >
                            <v-list-item-icon>
                              <v-icon>mdi-delete</v-icon>
                            </v-list-item-icon>
                            <v-list-item-title>delete</v-list-item-title>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </v-hover>
          </div>
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
  props: ["listDvcd", "listTitle"],
  data: () => ({
    items: [],
    open: [],
    search: null,
    caseSensitive: false,
  }),
  computed: {
    filter() {
      return this.caseSensitive
        ? (item, search, textKey) => item[textKey].indexOf(search) > -1
        : undefined;
    },
    isRequest() {
      return this.listDvcd === Constants.LIST_DVCD.REQUEST ? true : false;
    },
  },
  created() {},

  mounted() {
    EventBus.$on("request:initRequestList", () => {
      this.initRequestList();
    });
  },

  watch: {
    listDvcd: {
      handler: function() {
        this.initRequestList(); // call it in the context of your component object
      },
    },
  },

  methods: {
    selectRequest(props) {
      let id = props[0];
      let self = this;
      if (self.listDvcd == Constants.LIST_DVCD.REQUEST) {
        EventBus.$emit("request:initRequestData", id);
      } else if (self.listDvcd == Constants.LIST_DVCD.HISTORY) {
        EventBus.$emit("request:initRequestHistory", id);
      }
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

    async duplicateRequest(props) {
      let self = this;
      if (self.listDvcd == Constants.LIST_DVCD.REQUEST) {
        let id = await DbAccessUtils.duplicateRequestById(props.id);
        DbAccessUtils.duplicateRequestDataById(id, props.id);
      }
      this.$toasted.global.successToast();
      self.initRequestList();
    },
    deleteRequest(props) {
      let self = this;
      if (self.listDvcd == Constants.LIST_DVCD.REQUEST) {
        DbAccessUtils.deleteRequestById(props.id);
      } else if (self.listDvcd == Constants.LIST_DVCD.HISTORY) {
        DbAccessUtils.deleteRequestHistoryById(props.id);
      }
      this.$toasted.global.successToast();
      self.initRequestList();
    },

    initRequestList() {
      var self = this;
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
          let cdate = "",
            children = [];

          res.slice().forEach(function(row, index, array) {
            if (index == 0) {
              self.open.push(row.requestDate);
            }
            if (row.requestDate != cdate) {
              // push timing
              if (children.length > 0) {
                // 첫번째 아이템의 경우는 제외하기 위해서
                let item = {
                  id: cdate,
                  name: cdate,
                  children: children,
                };
                self.items.push(item);
                children = [];
              }
              cdate = row.requestDate;
            }
            children.push({
              id: row.id,
              name: row.url,
            });

            if (index == array.length - 1) {
              //마지막 item children에 push 후 items에 push
              let item = {
                id: cdate,
                name: cdate,
                children: children,
              };
              self.items.push(item);
            }
          });
        });
      }
    },
  },
};
</script>
