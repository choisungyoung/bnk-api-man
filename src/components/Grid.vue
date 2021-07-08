<template>
  <div>
    <!--
            heightResizable=true
        -->
    <Grid
      ref="tuiGrid"
      :rowHeight="rowHeight"
      :minRowHeight="minRowHeight"
      :data="data"
      :rowHeaders="rowHeaders"
      :columns="columns"
      :columnOptions="columnOptions"
      :treeColumnOptions="treeColumnOptions"
      :summary="summary"
      :theme="theme"
      :language="language"
      :bodyHeight="bodyHeight"
      :showDummyRows="true"
      :draggable="draggable"
      @click="onClick"
      @check="onCheck"
      @checkAll="onCheckAll"
      @uncheck="onUncheck"
      @uncheckAll="onUncheckAll"
      @expand="onExpand"
      @collapse="onCollapse"
      @editingFinish="editingFinish"
      @editingStart="onEditingStart"
      @dragStart="onDragStart"
      @drop="onDrop"
    >
    </Grid>
  </div>
</template>

<script>
import { Grid } from "@toast-ui/vue-grid";
import "tui-grid/dist/tui-grid.css";

export default {
  components: {
    Grid,
  },
  data() {
    return {
      language: "ko",
      selectedCSS: "tui-grid-cell-checked-row",
    };
  },
  props: {
    rowHeight: {
      type: [String, Number],
      default: "auto",
    },
    minRowHeight: {
      type: [String, Number],
      default: "35",
    },
    theme: {
      type: [String],
      default: "default",
    },
    data: {
      type: [Array, Object],
      required: true,
    },
    columns: {
      type: [Array],
      required: true,
    },
    summary: {
      type: [Object],
      default: () => {
        return {};
      },
    },
    rowHeaders: {
      type: [Array],
      default: () => {
        return [];
      },
    },
    treeColumnOptions: {
      type: [Object],
      default: () => {
        return {
          resizable: true,
        };
      },
    },
    columnOptions: {
      type: [Object],
      default: () => {
        return {
          resizable: true,
        };
      },
    },
    bodyHeight: {
      type: [Number, String],
      default: 300,
    },
    draggable: {
      type: [Boolean],
      default: true,
    },

    editingFinish: {
      type: [Function],
      
      default: ()=> {

      }
    },
  },
  methods: {
    setColumns(columns) {
      let grid = this.$refs.tuiGrid;
      grid.invoke("setColumns", columns);
    },

    getData() {
      let grid = this.$refs.tuiGrid;
      return grid.invoke("getData");
    },

    setData(dataList) {
      let grid = this.$refs.tuiGrid;
      grid.invoke("clear");
      grid.invoke("resetData", dataList);
      grid.invoke("checkAll");
    },

    clearData() {
      let grid = this.$refs.tuiGrid;

      grid.invoke("clear");
    },

    refreshLayout() {
      let grid = this.$refs.tuiGrid;

      grid.invoke("refreshLayout");
    },
    getCheckedRows() {
      let grid = this.$refs.tuiGrid;
      return grid.invoke("getCheckedRows");
    },

    getCreatedRows() {
      let grid = this.$refs.tuiGrid;

      return grid.invoke("getModifiedRows", {
        ignoredColumns: ["_children", "_attributes"],
      }).createdRows;
    },

    getUpdatedRows() {
      let grid = this.$refs.tuiGrid;

      return grid.invoke("getModifiedRows", {
        ignoredColumns: ["_children", "_attributes"],
      }).updatedRows;
    },

    getDeletedRows() {
      let grid = this.$refs.tuiGrid;

      return grid.invoke("getModifiedRows", {
        ignoredColumns: ["_children", "_attributes"],
      }).deletedRows;
    },

    prependRow(row, options) {
      let grid = this.$refs.tuiGrid;

      grid.invoke("prependRow", row, options);
    },

    appendRow(row, options) {
      let grid = this.$refs.tuiGrid;

      grid.invoke("appendRow", row, options);
    },

    appendRows(data) {
      let grid = this.$refs.tuiGrid;

      grid.invoke("appendRows", data);
    },

    appendTreeRow(row, options) {
      let grid = this.$refs.tuiGrid;

      grid.invoke("appendTreeRow", row, options);
    },

    removeRow(rowKey, options) {
      let grid = this.$refs.tuiGrid;
      grid.invoke("removeRow", rowKey, options);
    },
    removeRowClassName(rowKey, className) {
      let grid = this.$refs.tuiGrid;
      grid.invoke("removeRowClassName", rowKey, className);
    },
    removeTreeRow(rowKey) {
      let grid = this.$refs.tuiGrid;
      grid.invoke("removeTreeRow", rowKey);
    },

    onClick(props) {
      let grid = props.instance,
        rowKey = props.rowKey,
        columnName = "_checked";
      let gridDataList = props.instance.getData();

      if (grid.getElement(rowKey, "_checked")) {
        if (props.rowKey === gridDataList[gridDataList.length - 1].rowKey) {
          // 마지막일 경우 체크안되도록
          let event = new Event("change");
          let input = grid.getElement(rowKey, "_checked").querySelector("input");
          input.checked = false;
          input.dispatchEvent(event);
        } else if (
          columnName != props.columnName &&
          grid.getElement(rowKey, "_checked")
        ) {
          // Row를 클릭할 때 rowHeader 체크를 시키기 위한 로직
          let event = new Event("change");
          let input = grid.getElement(rowKey, "_checked").querySelector("input");
          input.checked = true;
          input.dispatchEvent(event);
        }
      }
    },

    onCheck(props) {
      let self = this,
        grid = props.instance;

      grid.addRowClassName(props.rowKey, self.selectedCSS);

      let checkedRows = grid.getCheckedRows();
      if (checkedRows.length === 1) {
        self.$emit("input", checkedRows[0]);
        self.$emit("check", checkedRows[0]);
      } else {
        self.$emit("input", checkedRows);
        self.$emit("check", checkedRows[0]);
      }
    },

    onCheckAll(props) {
      let self = this,
        grid = props.instance;
      for (let key of grid.getCheckedRowKeys()) {
        grid.addRowClassName(key, self.selectedCSS);
      }
    },

    onUncheck(props) {
      let self = this,
        grid = props.instance,
        rowKey = props.rowKey;

      grid.removeRowClassName(rowKey, self.selectedCSS);

      let checkedRows = grid.getCheckedRows();
      if (checkedRows.length === 1) {
        self.$emit("input", checkedRows[0]);
      } else {
        self.$emit("input", checkedRows);
      }
    },

    onUncheckAll(props) {
      let self = this,
        grid = props.instance;

      for (let key = 0; key < grid.getRowCount(); key++) {
        grid.removeRowClassName(key, self.selectedCSS);
      }
    },

    blur() {
      let grid = this.$refs.tuiGrid;
      return grid.invoke("blur");
    },

    onExpand() {},

    onCollapse() {},

    onDebuggerMethod() {},
    onEditingStart(props) {
      // 편집 시작시 체크 박스 체크하기
      let grid = props.instance,
        rowKey = props.rowKey,
        columnName = "_checked";
      if (
        columnName != props.columnName &&
        grid.getElement(rowKey, "_checked")
      ) {
        // Row를 클릭할 때 rowHeader 체크를 시키기 위한 로직
        let event = new Event("change");
        let input = grid.getElement(rowKey, "_checked").querySelector("input");
        input.checked = true;
        input.dispatchEvent(event);
      }
    },
    onDrop(gridEvent) {
      let gridDataList = gridEvent.instance.getData(),
      lastGridData = gridDataList[gridDataList.length - 1];

      if (gridEvent.rowKey === lastGridData.rowKey) {
        // 마지막 행으로 드랍될 경우 마지막 앞 행으로 
        let data = gridDataList.pop();
        gridDataList.splice(gridDataList.length-1, 0, data);
      }
      gridEvent.instance.resetData(gridDataList);
      gridEvent.stopped = true;
    },
    onDragStart(gridEvent) {
      let gridDataList = gridEvent.instance.getData();
      if (gridEvent.rowKey === gridDataList[gridDataList.length - 1].rowKey) {
        // 마지막일 경우 드레그 안되도록
        gridEvent.stopped = true;
      } 
    },
    getRootElement() {
      return this.$ref.tuiGrid;
    },
    invoke(methodName, ...args) {
      let grid = this.$refs.tuiGrid,
        gridInstance = grid.gridInstance;
      if (gridInstance[methodName] === "function") {
        return grid.invoke(methodName, ...args);
      }
      return null;
    },
  },
};
</script>

<style></style>
