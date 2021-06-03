<template>
  <v-container>
    <v-row class="text-center">
        <v-col
            class="d-flex"
            cols="2"
        >
        <v-select
          :items="methodItems"
          v-model="method"
          label="METHOD"
          color="success"
        ></v-select>
      </v-col>
        <v-col
            class="d-flex"
            cols="8"
        >
          <v-text-field
            v-model="url"
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
            color="success"
            large
            @click="requestApi()"
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
            max-height="250px"
            >
                <Header />
            </v-card>
        </v-tab-item>
        <v-tab-item>
            <v-card
            flat
            >
                <Body />
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
                </v-card>
            </v-tab-item>
            <v-tab-item>
                <v-card
                flat
                >
                </v-card>
            </v-tab-item>
            <v-tab-item>
                <v-card
                flat
                >
                </v-card>
            </v-tab-item>
        </v-tabs-items>
    </v-card>
  </v-container>
</template>

<script>
  import Parameter from '@/components/Parameter';
  import Header from './Header.vue';
  import Body from './Body.vue';
  import Request from '@/Request'

  export default {
    name: 'Request',
    components: {
        Parameter,
        Header,
        Body
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
            method: null,
            url: null,
            body: null,
            param: null,
            header: null,
            response: null,
        }
    },
    methods: {
        requestApi()  {
            let self = this

            return Request({
                method: self.method,
                url: self.url,
                data: self.body,
                params: self.param,
                headers: self.header
            }).then((response) =>{
                let result = response.data;
                response = result;
            });
        },
    }
  }
</script>
