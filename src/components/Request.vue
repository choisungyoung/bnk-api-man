<template>
  <v-container>
    <v-row class="text-center">
        <v-col
            class="d-flex"
            cols="2"
        >
        <v-select
          :items="methodItems"
          label="METHOD"
          color="success"
        ></v-select>
      </v-col>
        <v-col
            class="d-flex"
            cols="8"
        >
          <v-text-field
            v-model="message1"
            label="URL"
            color="success"
            clearable
          ></v-text-field>
        </v-col>
        <v-col
            class="d-flex"
            cols="2"
        >
            <v-btn
            class="ma-2"
            :loading="loading2"
            :disabled="loading2"
            color="success"
            large
            @click="loader"
            >
            Send
            </v-btn>
      </v-col>
    </v-row>


    <v-card
        elevation="2"
        height="300px"
    >
        <v-tabs
        v-model="requestTab"
        color="success"
        >
            <v-tab
                v-for="item in requestTabs"
                :key="item"
            >
                {{ item }}
            </v-tab>
        </v-tabs>

        <v-tabs-items v-model="requestTab">
        <v-tab-item>
            <v-card
            flat
            max-height="250px"
            >
                <Parameter/>
            </v-card>
        </v-tab-item>
        <v-tab-item>
            <v-card
            flat
            >
            <v-card-text>1234</v-card-text>
            </v-card>
        </v-tab-item>
        <v-tab-item>
            <v-card
            flat
            >
            <v-card-text>1234</v-card-text>
            </v-card>
        </v-tab-item>
        </v-tabs-items>
    </v-card>
    <br>
    <v-card
        elevation="2"
        height="350px"
    >
        <v-tabs
        v-model="responseTab"
        color="success"
        >
            <v-tab
                v-for="item in responseTabs"
                :key="item"
            >
                {{ item }}
            </v-tab>
        </v-tabs>

        <v-tabs-items v-model="responseTab">
            <v-tab-item>
                <v-card
                flat
                >
                    <Parameter/>
                </v-card>
            </v-tab-item>
            <v-tab-item>
                <v-card
                flat
                >
                <v-card-text>1234</v-card-text>
                </v-card>
            </v-tab-item>
            <v-tab-item>
                <v-card
                flat
                >
                <v-card-text>1234</v-card-text>
                </v-card>
            </v-tab-item>
        </v-tabs-items>
    </v-card>
  </v-container>
</template>

<script>
  import Parameter from '@/components/Parameter';

  export default {
    name: 'Request',
    components: {
        Parameter,
    },
    data () {
        return {
            methodItems: [
                'GET','POST'
            ],
            requestTab: null,
            requestTabs: [
            'params', 'header', 'body',
            ],
            responseTab: null,
            responseTabs: [
            'body', 'cookies', 'header',
            ],
        }
    },
  }
</script>
