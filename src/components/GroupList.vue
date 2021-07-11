<template>
  <v-card class="mx-auto" max-width="500" style="height:96vh" elevation="0">
    <v-sheet class="pa-4 grey lighten-1">
      <v-text-field
        v-model="search"
        label="Search"
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
        v-show="false"
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
              <v-tooltip bottom open-delay="1000">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    x-small
                    icon
                    color="gray"
                    @click="importRequest()"
                    v-show="isRequest"
                    class="mr-3"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon dark>
                      mdi-import
                    </v-icon>
                    <input
                      id="fileUpload"
                      type="file"
                      hidden
                      @change="loadFile"
                    />
                  </v-btn>
                </template>
                <span>Import</span>
              </v-tooltip>
              <v-tooltip bottom open-delay="1000">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    x-small
                    icon
                    color="gray"
                    @click="exportRequest()"
                    v-show="isRequest"
                    class="mr-3"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon dark>
                      mdi-export
                    </v-icon>
                  </v-btn>
                </template>
                <span>Export</span>
              </v-tooltip>
              <v-tooltip bottom open-delay="1000">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    x-small
                    icon
                    color="gray"
                    @click="createRequest()"
                    v-show="isRequest"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon dark>
                      mdi-plus
                    </v-icon>
                  </v-btn>
                </template>
                <span>Add Reqest</span>
              </v-tooltip>
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
        color="success"
        ref="treeview"
      >
        <template slot="label" slot-scope="{ item }">
          <draggable
            class="dragArea list-group"
            :list="items"
            :id="item.id"
            @start="checkStart"
            @end="checkEnd"
            v-bind="dragOptions"
          >
            <div v-if="item.children">
              {{ item.name }}
            </div>
            <div v-else @click="selectRequest(item)">
              <v-hover v-slot:default="{ hover }">
                <div>
                  <v-row no-gutters justify="center" align="center">
                    <v-tooltip bottom open-delay="1000" :disabled="isRequest">
                      <template v-slot:activator="{ on, attrs }">
                        <v-col cols="auto">
                          <div :class="getMethodClassName(item.method)">
                            <span
                              style="font-size: 11px;vertical-align: middle;"
                              v-bind="!isRequest ? attrs : null"
                              v-on="!isRequest ? on : null"
                            >
                              {{ item.method }} &nbsp;
                            </span>
                          </div>
                        </v-col>
                        <v-col cols="12" sm="6" md="" align-self="center">
                          <span
                            style="width: 170px;display:block;overflow: hidden;text-overflow: ellipsis; white-space: nowrap; "
                            v-bind="attrs"
                            v-on="on"
                          >
                            {{ item.name }}
                          </span>
                        </v-col>
                      </template>
                      <span>{{ item.requestDtti }}</span>
                    </v-tooltip>
                    <v-col cols="auto">
                      <div align="right" width="30px">
                        <v-menu bottom left small :offset-y="true">
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn icon small v-bind="attrs" v-on="on">
                              <v-icon v-if="hover">mdi-dots-vertical</v-icon>
                            </v-btn>
                          </template>

                          <v-list dense>
                            <v-list-item
                              link
                              icon
                              small
                              @click="duplicateRequest(item)"
                              v-show="isRequest"
                            >
                              <v-list-item-icon>
                                <v-icon small>mdi-content-copy</v-icon>
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
                                <v-icon small>mdi-delete</v-icon>
                              </v-list-item-icon>
                              <v-list-item-content>
                                <v-list-item-title>delete</v-list-item-title>
                              </v-list-item-content>
                            </v-list-item>
                          </v-list>
                        </v-menu>
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </v-hover>
            </div>
          </draggable>
        </template>
      </v-treeview>
    </v-card-text>
  </v-card>
</template>

<script>
import DbAccessUtils from "@/util/DbAccessUtils";
import EventBus from "@/util/EventBus";
import Constants from "@/constants";
import draggable from "vuedraggable";

export default {
  components: {
    draggable,
  },
  props: ["listDvcd", "listTitle"],
  data: () => ({
    items: [],
    active: [],
    dragItem: [],
    open: [],
    search: "",
    caseSensitive: false,
    drag: false,
    selectedItem: 1,
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
    filteItems: {
      set: function(items) {
        this.items = items;
      },
      get: function() {
        let self = this;
        return self.getFiltedItems(self.items);
      },
    },
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
      };
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
      let id = props.id;
      let self = this;
      debugger;
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
        DbAccessUtils.deleteAllRequestDataByRequestId(props.id);
      } else if (self.listDvcd == Constants.LIST_DVCD.HISTORY) {
        DbAccessUtils.deleteRequestHistoryById(props.id);
      }
      this.$toasted.global.successToast();
      self.initRequestList();
    },

    async importRequest() {
      document.getElementById("fileUpload").click();
    },

    loadFile(event) {
      let self = this;
      console.log(event.target.files[0]);
      let file = event.target.files[0];
      let inputJson;
      var reader = new FileReader();
      var utils = DbAccessUtils;
      reader.onload = async function() {
        const dialogInstance = await self.$dialog.confirm({
          text:
            "JSON파일을 IMPORT하시면 기존의 데이터가 모두 삭제됩니다. \n 계속 진행하시겠습니까?",
          title: "주의",
          waitForResult: true,
        });

        if (dialogInstance) {
          try {
            inputJson = JSON.parse(reader.result);

            // 모든 데이터 삭제
            await utils.deleteAllRequest();
            await utils.deleteAllRequestData();
            await utils.deleteAllGlobalData();

            for (var request of inputJson.request) {
              await utils.saveRequestWithId(request);
            }
            for (var requestData of inputJson.requestData) {
              await utils.saveRequestData(requestData);
            }
            for (var globalData of inputJson.globalData) {
              await utils.saveGlobalData(globalData);
            }
          } catch (e) {
            self.$toasted.global.errorToast("입력파일이 JSON형식이 아닙니다.");
            return;
          }
          self.$toasted.global.successToast();
          self.initRequestList();
        } else {
          document.getElementById("fileUpload").value = "";
        }
      };
      reader.readAsText(file, /* optional */ "utf-8");
    },
    async exportRequest() {
      let outputJson = {
        request: [],
        requestData: [],
        globalData: [],
      };

      outputJson.request = await DbAccessUtils.findAllRequestById();
      outputJson.requestData = await DbAccessUtils.findAllRequestDataByRequestId();
      outputJson.globalData = await DbAccessUtils.findAllGlobalData();

      const data = JSON.stringify(outputJson);
      const blob = new Blob([data], { type: "text/plain" });
      const e = document.createEvent("MouseEvents"),
        a = document.createElement("a");
      a.download = "REQUEST_DATA.json";
      a.href = window.URL.createObjectURL(blob);
      a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");
      e.initEvent(
        "click",
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      );
      a.dispatchEvent(e);
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
              method: row.method,
              parentId: null,
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
              method: row.method,
              requestDtti: row.requestDtti,
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

    getFiltedItems(items) {
      let self = this,
        itemList = JSON.parse(JSON.stringify(items)), //깊은 복사
        filtedItmes = [];
      for (let item of itemList) {
        if (item.children) {
          item.children = self.getFiltedItems(item.children);
          filtedItmes.push(item);
          continue;
        }

        if (item.name.toLowerCase().includes(self.search.toLowerCase())) {
          filtedItmes.push(item);
        }
      }
      return filtedItmes;
    },

    findTreeItem: function(items, id) {
      if (!items) {
        return;
      }
      for (var i = 0; i < items.length; i++) {
        var item = items[i];
        // Test current object
        if (item.id.toString() === id) {
          return item;
        }
        // Test children recursively
        const child = this.findTreeItem(item.children, id);
        if (child) {
          return child;
        }
      }
    },
    checkStart: function(evt) {
      var self = this;
      self.dragItem = [];
      self.dragItem.push(self.findTreeItem(self.items, evt.from.id));
      self.drag = true;
    },
    checkEnd: function(evt) {
      var self = this;
      debugger;
      if (self.listDvcd == Constants.LIST_DVCD.REQUEST) {
        var itemSelected = self.dragItem[0];
        var fromParent = itemSelected.parentId
          ? self.findTreeItem(self.items, itemSelected.parentId)
          : null;

        var toItem = self.findTreeItem(self.items, evt.to.id);
        var toParent = toItem.parentId
          ? self.findTreeItem(self.items, itemSelected.parentId)
          : null;

        var objFrom = fromParent ? fromParent.children : self.items;
        var objTo = toParent ? toParent.children : self.items;

        objFrom.splice(objFrom.indexOf(itemSelected), 1);
        if (evt.newIndex == 1) {
          // 밑으로 드래그 end되었을 경우
          objTo.splice(objTo.indexOf(toItem) + 1, 0, itemSelected);
        } else {
          objTo.splice(objTo.indexOf(toItem), 0, itemSelected);
        }

        // 목록 정렬 저장 (Tree 고려 X)
        var index = 0;
        for (let item of self.items) {
          item.sort = index++;
          DbAccessUtils.updateRequestSort(item);
        }

        this.$toasted.global.successToast();
      }

      self.drag = false;
      return false;
    },

    getMethodClassName(method) {
      let className = "";
      if (Constants.REQUEST_METHOD.GET == method) {
        className = "yellow";
      } else if (Constants.REQUEST_METHOD.POST == method) {
        className = "green";
      } else {
        className = "grey";
      }
      return className + "--text";
    },

    remvoeAllActiveClassName() {
      var elements = document.getElementsByClassName("v-treeview-node--active");
      for (let element of elements) {
        element.classList.remove("v-treeview-node--active");
        element.classList.remove("success--text");
      }
    },
  },
};
</script>
<style>
.v-treeview-node__root {
  min-height: 35px;
}
.handle {
  float: left;
  padding-top: 8px;
  padding-bottom: 8px;
}
</style>
