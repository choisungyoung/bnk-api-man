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
          id="Parameter_parameterGrid"
          ref="parameterGrid"
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

    removeData() {
      let self = this,
        parameterGrid = self.$refs.parameterGrid;
      parameterGrid.removeRow(self.selectedRow.rowKey);
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
  },
};
</script>
