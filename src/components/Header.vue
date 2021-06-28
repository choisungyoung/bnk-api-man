<template>
  <v-container>
    <v-row>
      <v-col cols="1" v-show="dvcd == 'edit'">
        <v-list>
          <v-list-item dense>
            <v-btn x-small icon color="success" right @click="createData()">
              <v-icon dark>
                mdi-plus
              </v-icon>
            </v-btn>
          </v-list-item>
          <v-list-item dense>
            <v-btn x-small icon color="error" @click="removeData()">
              <v-icon dark>
                mdi-minus
              </v-icon>
            </v-btn>
          </v-list-item>
        </v-list>
      </v-col>
      <v-col :cols="setCol">
        <Grid
          id="Header_headerGrid"
          ref="headerGrid"
          :bodyHeight="height"
          :data="gridOpts.data"
          :columns="gridOpts.columns"
          :rowHeaders="gridOpts.rowHeaders"
          :summary="gridOpts.summary"
          v-model="selectedRow"
        ></Grid>
      </v-col>
      <v-col md="0"> </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Grid from "@/components/Grid";
import {
  CustomSingleCheckboxRowHeaders,
  convertGridDataToJsonData,
  convertJsonDataToGridData,
} from "@/util/GridUtils";
export default {
  components: {
    Grid,
  },
  props: ["data", "height", "dvcd"],
  computed: {
    setCol() {
      if (this.dvcd == "edit") {
        return 11;
      } else {
        return 12;
      }
    },
  },
  created() {
    let self = this,
      editorVal = self.dvcd === "edit" ? "text" : null;
    self.gridOpts = {
      data: [],
      rowHeaders: [
        {
          type: "checkbox",
          header: "<span/>",
          renderer: {
            type: CustomSingleCheckboxRowHeaders,
          },
        },
      ],
      columns: [
        {
          header: "KEY",
          name: "key",
          align: "left",
          minWidth: 130,
          editor: editorVal,
        },
        {
          header: "VALUE",
          name: "value",
          align: "left",
          minWidth: 130,
          editor: editorVal,
        },
        {
          header: "DESCRIPTION",
          name: "description",
          align: "left",
          minWidth: 130,
          editor: editorVal,
        },
      ],
    };
  },
  data() {
    return {
      gridOpts: {},
      selectedRow: { jobDataKey: null }, // 선택된행
    };
  },
  mounted() {},
  methods: {
    getHeader() {
      let self = this,
        headerGrid = self.$refs.headerGrid,
        gridDataList = headerGrid.getData();

      if (gridDataList.length <= 0) {
        return null;
      }
      return convertGridDataToJsonData(gridDataList);
    },
    setHeader(jsonData) {
      let self = this,
        headerGrid = self.$refs.headerGrid;

      if (jsonData) {
        headerGrid.setData(convertJsonDataToGridData(jsonData));
        headerGrid.refreshLayout();
      }
    },

    createData() {
      let self = this,
        headerGrid = self.$refs.headerGrid;

      let data = { key: "", value: "" };
      headerGrid.prependRow(data);
    },

    removeData() {
      let self = this,
        headerGrid = self.$refs.headerGrid;
      headerGrid.removeRow(self.selectedRow.rowKey);
    },

    refreshLayout() {
      let self = this,
        headerGrid = self.$refs.headerGrid;
      headerGrid.refreshLayout(); // grid 화면 reload
    },

    setGridData(gridData) {
      let self = this,
        headerGrid = self.$refs.headerGrid;

      headerGrid.setData(gridData);
    },
    getGridData() {
      let self = this,
        headerGrid = self.$refs.headerGrid,
        gridDataList = headerGrid.getData();
      return gridDataList;
    },
  },
};
</script>
