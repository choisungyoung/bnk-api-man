<template>
  <v-container>
    <Grid
      id="Cookie_cookieGrid"
      ref="cookieGrid"
      :bodyHeight="height"
      :data="gridOpts.data"
      :columns="gridOpts.columns"
      :rowHeaders="gridOpts.rowHeaders"
      :summary="gridOpts.summary"
      :draggable="isEditMode"
      v-model="selectedRow"
    ></Grid>
  </v-container>
</template>

<script>
import Grid from "@/components/Grid";
import { convertGridDataToJsonData } from "@/util/GridUtils";
export default {
  components: {
    Grid,
  },
  props: ["data", "height", "dvcd"],
  computed: {
    isEditMode() {
      let self = this;
      return self.dvcd === "edit";
    },
  },
  created() {
    let self = this,
      editorVal = self.dvcd === "edit" ? "text" : null;
    self.gridOpts = {
      data: [
        {
          key: "",
          value: "",
        },
      ],
      columns: [
        {
          header: "Name",
          name: "name",
          align: "left",
          minWidth: 130,
          editor: editorVal,
        },
        {
          header: "Value",
          name: "value",
          align: "left",
          minWidth: 130,
          editor: editorVal,
        },
        {
          header: "Domain",
          name: "domain",
          align: "left",
          minWidth: 130,
          editor: editorVal,
        },
        {
          header: "Path",
          name: "path",
          align: "left",
          minWidth: 130,
          editor: editorVal,
        },
        {
          header: "ExpirationDate",
          name: "expirationDate",
          align: "left",
          minWidth: 130,
          editor: editorVal,
          formatter: function(data) {
            debugger;
            if (data.value) {
              var date = new Date(data.value * 1000);
              return date.toLocaleString();
            }
            return "";
          },
        },
        {
          header: "HttpOnly",
          name: "httpOnly",
          align: "left",
          minWidth: 130,
          editor: editorVal,
        },
        {
          header: "Secure",
          name: "secure",
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
  methods: {
    getCookie() {
      let self = this,
        cookieGrid = self.$refs.cookieGrid,
        gridDataList = cookieGrid.getData();
      if (gridDataList.length <= 0) {
        return null;
      }
      return convertGridDataToJsonData(gridDataList);
    },

    getCheckedCookie() {
      let self = this,
        cookieGrid = self.$refs.cookieGrid,
        gridDataList = cookieGrid.getCheckedRows();

      if (gridDataList.length <= 0) {
        return null;
      }
      return convertGridDataToJsonData(gridDataList);
    },

    createData() {
      let self = this,
        cookieGrid = self.$refs.cookieGrid;

      let data = { key: "", value: "" };
      cookieGrid.prependRow(data);
    },

    removeData(row) {
      let self = this,
        cookieGrid = self.$refs.cookieGrid;
      cookieGrid.removeRow(row.rowKey);
    },

    refreshLayout() {
      let self = this,
        cookieGrid = self.$refs.cookieGrid;
      cookieGrid.refreshLayout(); // grid 화면 reload
    },
    blur() {
      let self = this,
        cookieGrid = self.$refs.cookieGrid;
      cookieGrid.blur(); // grid blur
    },
    appendGridData(gridData) {
      let self = this,
        cookieGrid = self.$refs.cookieGrid;

      cookieGrid.appendRows(gridData);
    },
    setGridData(gridData) {
      let self = this,
        cookieGrid = self.$refs.cookieGrid;
      cookieGrid.setData(gridData);
    },
    getGridData() {
      let self = this,
        cookieGrid = self.$refs.cookieGrid,
        gridDataList = cookieGrid.getData();
      return gridDataList;
    },

    clearData() {
      let self = this,
        cookieGrid = self.$refs.cookieGrid;
      cookieGrid.clearData();
    },
  },
};
</script>
