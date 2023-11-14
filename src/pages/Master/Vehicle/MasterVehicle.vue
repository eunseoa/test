<template>
  <q-page class="q-pl-sm q-pr-sm q-pb-sm">
    <div class="row q-pt-sm">
      <q-breadcrumbs>
        <template v-slot:separator>
          <q-icon
            size="1.5em"
            name="chevron_right"
            color="primary"
          ></q-icon>
        </template>
          <q-breadcrumbs-el label="home" icon="home" to="/main" class="text-grey-7"/>
          <q-breadcrumbs-el label="기준정보" icon="info" class="text-grey-7"/>
          <q-breadcrumbs-el label="배송차량정보" icon="local_shipping" class="text-blue-10"/>
      </q-breadcrumbs>
    </div>

    <div class="row q-py-lg">
      <div class="text-h5 text-weight-bolder">
        <q-icon name="local_shipping" />
        &nbsp;<span>배송차량정보</span>
      </div>
    </div>

    <div>
      <q-card class="my-card shadow-3" style="height: 180px;">
        <q-toolbar class="shadow-2" style="height: 50px;">
          <div class="text-h6 q-pa-md text-weight-bold">
            배송차량정보
          </div>
        </q-toolbar>

        <q-separator />

        <q-card-section class="q-col-gutter-sm">
          <div class="row q-col-gutter-sm">
            <div class="col-lg-2">
              <q-select
                dense square outlined
                v-model="searchValue.logisSearch"
                :options="logisList"
                option-label="lcNm"
                option-value="lcCd"
                emit-value
                map-options
              >
                <template v-if="searchValue.logisSearch" v-slot:append>
                  <q-icon name="cancel" @click.stop.prevent="searchValue.logisSearch = ''" class="cursor-pointer"></q-icon>
                </template>
                <template v-if="searchValue.logisSearch == ''" v-slot:selected>
                  <div class="text-grey-6">물류센터 선택</div>
                </template>
              </q-select>
            </div>

            <div class="col-lg-2">
              <q-select
                dense square outlined
                v-model="searchValue.runAtSearch"
                :options="runAtList"
                option-label="cdNm"
                option-value="cd"
                emit-value
                map-options
              >
                <template v-if="searchValue.runAtSearch" v-slot:append>
                  <q-icon name="cancel" @click.stop.prevent="searchValue.runAtSearch = ''" class="cursor-pointer"></q-icon>
                </template>
                <template v-if="searchValue.runAtSearch == ''" v-slot:selected>
                  <div class="text-grey-6">운행여부 선택</div>
                </template>
              </q-select>
            </div>

            <div class="col-lg-2">
              <q-select
                dense square outlined
                v-model="searchValue.useAtSearch"
                :options="useAtList"
                option-label="cdNm"
                option-value="cd"
                emit-value
                map-options
              >
                <template v-if="searchValue.useAtSearch" v-slot:append>
                  <q-icon name="cancel" @click.stop.prevent="searchValue.useAtSearch = ''" class="cursor-pointer"></q-icon>
                </template>
                <template v-if="searchValue.useAtSearch == ''" v-slot:selected>
                  <div class="text-grey-6">사용여부 선택</div>
                </template>
              </q-select>
            </div>

            <div class="col-lg-2">
              <q-input
                dense square outlined
                v-model="searchValue.vehicleSearch"
                @keyup.enter="vehicleData"
                placeholder="검색어"
              />
            </div>

            <div class="col-lg-1">
              <q-btn
                label="조회"
                color="indigo-7"
                @click="vehicleData"
              />
            </div>
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-lg-2">
              <q-select
                dense square outlined
                v-model="searchValue.dv1stDivSearch"
                :options="dv1stDivList"
                option-label="cdNm"
                option-value="cd"
                emit-value
                map-options
              >
                <template v-if="searchValue.dv1stDivSearch" v-slot:append>
                  <q-icon name="cancel" @click.stop.prevent="searchValue.dv1stDivSearch = ''" class="cursor-pointer"></q-icon>
                </template>
                <template v-if="searchValue.dv1stDivSearch == ''" v-slot:selected>
                  <div class="text-grey-6">대분류 선택</div>
                </template>
              </q-select>
            </div>

            <div class="col-lg-2">
              <q-select
                dense square outlined
                v-model="searchValue.dv12ndDivSearch"
                :options="dv12ndDivList"
                option-label="cdNm"
                option-value="cd"
                emit-value
                map-options
              >
                <template v-if="searchValue.dv12ndDivSearch" v-slot:append>
                  <q-icon name="cancel" @click.stop.prevent="searchValue.dv12ndDivSearch = ''" class="cursor-pointer"></q-icon>
                </template>
                <template v-if="searchValue.dv12ndDivSearch == ''" v-slot:selected>
                  <div class="text-grey-6">소분류 선택</div>
                </template>
              </q-select>
            </div>

            <div class="col-lg-2">
              <q-select
                dense square outlined
                v-model="searchValue.dbTypeSearch"
                :options="dbTypeList"
                option-label="cdNm"
                option-value="cd"
                emit-value
                map-options
              >

                <template v-if="searchValue.dbTypeSearch" v-slot:append>
                  <q-icon name="cancel" @click.stop.prevent="searchValue.dbTypeSearch = ''" class="cursor-pointer"></q-icon>
                </template>
                <template v-if="searchValue.dbTypeSearch == ''" v-slot:selected>
                  <div class="text-grey-6">차량구분 선택</div>
                </template>
              </q-select>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div class="q-pt-sm">
      <div class="q-pa-xs">
        <q-card class="my-card">
          <q-tabs
            v-model="tab"
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="left"
            narrow-indicator
          >
            <q-tab name="vehicleList" label="배송차량"></q-tab>
            <q-tab name="vehicleBizPartner" label="차량별 거래처"></q-tab>
          </q-tabs>
        </q-card>
      </div>


      <q-tab-panels v-model="tab" animated class="bg-grey-2" style="height: 600px;">
        <q-tab-panel name="vehicleList" class="q-pa-xs">
          <vehicleList
            ref="vehicleListRef"
            :logislist="logisList"
          />
        </q-tab-panel>

        <q-tab-panel name="vehicleBizPartner" class="q-pa-xs">
          <bizPartByVehicle
            ref="bizPartByVehicleRef"
          />
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-page>
</template>

<script setup>
  import { useUserStore } from 'src/stores/example-store';
  import { ref, onMounted } from 'vue';
  import axios from 'axios';

  import vehicleList from 'src/pages/Master/Vehicle/MasterVehicleList.vue';
  import bizPartByVehicle from 'src/pages/Master/Vehicle/MasterBpByVehicle.vue';

  const userStore = useUserStore();

  const searchValue = ref( {
    logisSearch : '',
    runAtSearch: '',
    useAtSearch: '',
    vehicleSearch: '',
    dv1stDivSearch: '',
    dv12ndDivSearch: '',
    dbTypeSearch: ''
  })

  const vehicleListRef = ref('');
  const bizPartByVehicleRef = ref('');
  const logisList = ref([]);
  const runAtList = ref([])
  const useAtList = ref([])
  const dv1stDivList = ref([]);
  const dv12ndDivList = ref([]);
  const dbTypeList = ref([]);

  const tab = ref('');

  function selectBoxData() {
    useAtList.value = ( userStore.commomCode ).filter( code => code.cgId === 'C03');
    runAtList.value = ( userStore.commomCode ).filter( code => code.cgId === 'C04' );
    dv1stDivList.value = ( userStore.commomCode ).filter( code => code.cgId === 'G22' );
    dv12ndDivList.value = ( userStore.commomCode ).filter( code => code.cgId === 'G23' );
    dbTypeList.value = ( userStore.commomCode ).filter( code => code.cgId === 'G21' );

    axios.post( '/api/v1/logisticscenter/'
              , {}
              , { headers : { Authorization : userStore.AccessToken } } )
    .then( res => {
      if( res.data.code == 0 ) {
        logisList.value = res.data.result;
      } else if( res.data.code < 0 ) {
        Notify.create({
          type: 'negative',
          message: res.data.message,
          timeout: 600
        })
      }
    })
    .catch( error => {
      Notify.create({
        type: 'negative',
        message: 'API를 호출하는 도중 에러가 발생했습니다.',
        timeout: 600
      })
    })
  }

  function vehicleData() {
    if( tab.value == 'vehicleList' ) {
      vehicleListRef.value.loadData( searchValue.value );
    } else if( tab.value == 'vehicleBizPartner' ) {
      bizPartByVehicleRef.value.vehicleData( searchValue.value );
    }
  }

  onMounted( () => {
    if( history.state.data != null ) {
      tab.value = history.state.data.tab;
    } else {
      tab.value = 'vehicleList';
    }

    selectBoxData()
  })
</script>
