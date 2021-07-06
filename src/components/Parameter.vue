<template>
  <v-container>
    <Grid
      id="Parameter_parameterGrid"
      ref="parameterGrid"
      :bodyHeight="height"
      :data="gridOpts.data"
      :columns="gridOpts.columns"
      :rowHeaders="gridOpts.rowHeaders"
      :summary="gridOpts.summary"
      :editingFinish="editingFinish"
      v-model="selectedRow"
    ></Grid>
  </v-container>
</template>

<script>
import Grid from "@/components/Grid";
import { convertGridDataToJsonData, CustomButton } from "@/util/GridUtils";
export default {
  components: {
    Grid,
  },
  props: ["data", "height", "dvcd"],
  computed: {},
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
          align: "left",
          width: 100,
          hidden: self.dvcd != "edit",
          renderer: {
            type: CustomButton,
            buttonInfo: {
              innerText: "삭제",
              //innerHTML: '<i class="fa fa-spinner fa-spin"></i>',
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
  methods: {
    getParameter() {
      let self = this,
        parameterGrid = self.$refs.parameterGrid,
        gridDataList = parameterGrid.getData();
      if (gridDataList.length <= 0) {
        return null;
      }
      return convertGridDataToJsonData(gridDataList);
    },

    createData() {
      let self = this,
        parameterGrid = self.$refs.parameterGrid;

      let data = { key: "", value: "" };
      parameterGrid.prependRow(data);
    },

    removeData(row) {
      let self = this,
        parameterGrid = self.$refs.parameterGrid;
      let gridDataList = parameterGrid.getData();
      if (row.rowKey === gridDataList[gridDataList.length - 1].rowKey) {
        // 마지막일 경우 삭제안되도록
        this.$toasted.global.errorToast({
          message: "삭제할 수 없는 행입니다.",
        });
        return;
      }
      parameterGrid.removeRow(row.rowKey);
    },

    refreshLayout() {
      let self = this,
        parameterGrid = self.$refs.parameterGrid;
      parameterGrid.refreshLayout(); // grid 화면 reload
    },
    blur() {
      let self = this,
        parameterGrid = self.$refs.parameterGrid;
      parameterGrid.blur(); // grid blur
    },
    appendGridData(gridData) {
      let self = this,
        parameterGrid = self.$refs.parameterGrid;

      parameterGrid.appendRows(gridData);
    },
    setGridData(gridData) {
      let self = this,
        parameterGrid = self.$refs.parameterGrid;
      parameterGrid.setData(gridData);
      if (self.dvcd == "edit") {
        // 편집모드일 경우 디폴트 그리드 추가.
        let data = { key: "", value: "", delete: null };
        parameterGrid.appendRow(data);
      }
    },
    getGridData() {
      let self = this,
        parameterGrid = self.$refs.parameterGrid,
        gridDataList = parameterGrid.getData();
      return gridDataList;
    },

    clearData() {
      let self = this,
        parameterGrid = self.$refs.parameterGrid;
      parameterGrid.clearData();
    },

    editingFinish(row) {
      // 편집을 시작하면 디폴트 행 추가
      let self = this,
        parameterGrid = self.$refs.parameterGrid,
        gridDataList = parameterGrid.getData(),
        lastRow = gridDataList[gridDataList.length - 1];

      if (row.rowKey === lastRow.rowKey) {
        // 마지막을 편집할 경우 새로운 행 추가
        if (lastRow.key || lastRow.value || lastRow.description) {
          let data = { key: "", value: "", delete: null };
          parameterGrid.appendRow(data);
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
