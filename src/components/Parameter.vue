<template>
    <v-container>
        <v-row>
            <v-col cols="1">
                <v-list>
                    <v-list-item dense >
                        <v-btn
                            x-small
                            icon
                            color="success"
                            right
                            @click="createData()"
                        >
                            <v-icon dark>
                                mdi-plus
                            </v-icon>
                        </v-btn>
                    </v-list-item>
                    <v-list-item dense>
                        <v-btn
                            x-small
                            icon
                            color="error"
                            @click="removeData()"
                        >
                            <v-icon dark>
                                mdi-minus
                            </v-icon>
                        </v-btn>
                    </v-list-item>
                </v-list>
            </v-col>
            <v-col cols="11">
                <Grid
                    id="Parameter_parameterGrid"
                    ref="parameterGrid"
                    :bodyHeight="150"
                    :data="gridOpts.data"
                    :columns="gridOpts.columns"
                    :rowHeaders="gridOpts.rowHeaders"
                    :summary="gridOpts.summary"
                    v-model="selectedRow"
                ></Grid>    
            </v-col>
            <v-col md="0">  
            </v-col>
        </v-row>
    </v-container>
</template>

<script>

  import Grid from "@/components/Grid";
  import { CustomSingleCheckboxRowHeaders } from "@/util/GridUtils"
  export default {
    components: {
      Grid
    },
    created(){
      let self = this;
      self.gridOpts = {
        data: [],          
        rowHeaders: [{
          type: 'checkbox',
          header: '<span/>',
          renderer: {
            type: CustomSingleCheckboxRowHeaders
          }
        }],
        columns: [
          {
            header: "KEY",
            name: "key",
            align: "left",
            minWidth: 130,
            editor: 'text'
          },
          {
            header: "VALUE",
            name: "value",
            align: "left",
            minWidth: 130,
            editor: 'text'
          },
          {
            header: "DESCRIPTION",
            name: "description",
            align: "left",
            minWidth: 130,
            editor: 'text'
          },
        ],
      }
    },
    data () {
      return {
        gridOpts: {},
        selectedRow: { jobDataKey: null }, // 선택된행
      }
    },
    methods: {
      createData() {
          let self = this,
            parameterGrid = self.$refs.parameterGrid;

          let data = {key:"", value: ""};
          parameterGrid.prependRow(data);
      },

      removeData() {
          let self = this,
            parameterGrid = self.$refs.parameterGrid;
          parameterGrid.removeRow(self.selectedRow.rowKey);
      },
    }
  }
</script>