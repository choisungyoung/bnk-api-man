<template>
  <v-container>
    <Grid
      id="Header_headerGrid"
      ref="headerGrid"
      :bodyHeight="height"
      :data="gridOpts.data"
      :columns="gridOpts.columns"
      :rowHeaders="gridOpts.rowHeaders"
      :summary="gridOpts.summary"
      :editingFinish="editingFinish"
      :draggable="isEditMode"
      v-model="selectedRow"
    ></Grid>
  </v-container>
</template>

<script>
import Grid from "@/components/Grid";
import {
  convertGridDataToJsonData,
  convertJsonDataToGridData,
  CustomButton,
} from "@/util/GridUtils";
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
      rowHeaders: [
        {
          type: "checkbox",
          header: "<span/>",
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
        {
          header: "DELETE",
          name: "delete",
          align: "center",
          width: 100,
          hidden: self.dvcd != "edit",
          renderer: {
            type: CustomButton,
            buttonInfo: {
              //innerText: "삭제",
              innerHTML: '<i class="mdi mdi-delete" style="align:center;"></i>',
              click: self.removeData,
            },
          },
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

    getCheckedHeader() {
      let self = this,
        headerGrid = self.$refs.headerGrid,
        gridDataList = headerGrid.getCheckedRows();

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

    removeData(row) {
      let self = this,
        headerGrid = self.$refs.headerGrid;

      let gridDataList = headerGrid.getData();
      if (row.rowKey === gridDataList[gridDataList.length - 1].rowKey) {
        // 마지막일 경우 삭제안되도록
        this.$toasted.global.errorToast({
          message: "삭제할 수 없는 행입니다.",
        });
        return;
      }

      headerGrid.removeRow(row.rowKey);
    },

    refreshLayout() {
      let self = this,
        headerGrid = self.$refs.headerGrid;
      headerGrid.refreshLayout(); // grid 화면 reload
    },

    blur() {
      let self = this,
        headerGrid = self.$refs.headerGrid;
      headerGrid.blur(); // grid blur
    },

    setGridData(gridData) {
      let self = this,
        headerGrid = self.$refs.headerGrid;
      headerGrid.setData(gridData);

      if (self.dvcd == "edit") {
        // 편집모드일 경우 디폴트 그리드 추가.
        let data = { key: "", value: "", delete: null };
        headerGrid.appendRow(data);
      }
    },
    getGridData() {
      let self = this,
        headerGrid = self.$refs.headerGrid,
        gridDataList = headerGrid.getData();
      return gridDataList;
    },

    clearData() {
      let self = this,
        headerGrid = self.$refs.headerGrid;
      headerGrid.clearData();
    },

    editingFinish(row) {
      // 편집을 시작하면 디폴트 행 추가
      let self = this,
        headerGrid = self.$refs.headerGrid,
        gridDataList = headerGrid.getData(),
        lastRow = gridDataList[gridDataList.length - 1];

      if (row.rowKey === lastRow.rowKey) {
        // 마지막을 편집할 경우 새로운 행 추가
        if (lastRow.key || lastRow.value || lastRow.description) {
          let data = { key: "", value: "", delete: null };
          headerGrid.appendRow(data);
        } else {
          // 편집 시작시 체크 박스 체크하기
          let grid = row.instance,
            rowKey = row.rowKey,
            columnName = "_checked";
          if (
            columnName != row.columnName &&
            grid.getElement(rowKey, "_checked")
          ) {
            // Row를 클릭할 때 rowHeader 체크를 시키기 위한 로직
            let event = new Event("change");
            let input = grid
              .getElement(rowKey, "_checked")
              .querySelector("input");
            input.checked = false;
            input.dispatchEvent(event);
          }
        }
      }
    },
  },
};
</script>
