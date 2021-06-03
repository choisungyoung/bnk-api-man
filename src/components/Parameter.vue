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
                        >
                            <v-icon dark>
                                mdi-minus
                            </v-icon>
                        </v-btn>
                    </v-list-item>
                </v-list>
            </v-col>
            <v-col>
                <Grid
                    id="Scheduler_schedulerDtlGrid"
                    ref="schedulerDtlGrid"
                    :bodyHeight="150"
                    :data="gridOpts.data"
                    :columns="gridOpts.columns"
                    :rowHeaders="gridOpts.rowHeaders"
                    :summary="gridOpts.summary"
                    v-model="selectedRow"
                ></Grid>    
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
        data: [{jobDataKey:'111', jobDataValue: '222'}],          
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
            name: "jobDataKey",
            align: "left",
            minWidth: 130,
            editor: 'text'
          },
          {
            header: "VALUE",
            name: "jobDataValue",
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
        desserts: [
          {
            name: 'Frozen Yogurt',
            calories: 159,
          },
          {
            name: 'Ice cream sandwich',
            calories: 237,
          },
          {
            name: 'Eclair',
            calories: 262,
          },
          {
            name: 'Cupcake',
            calories: 305,
          },
          {
            name: 'Gingerbread',
            calories: 356,
          },
          {
            name: 'Jelly bean',
            calories: 375,
          },
          {
            name: 'Lollipop',
            calories: 392,
          },
          {
            name: 'Honeycomb',
            calories: 408,
          },
          {
            name: 'Donut',
            calories: 452,
          },
          {
            name: 'KitKat',
            calories: 518,
          },
        ],
      }
    },
  }
</script>