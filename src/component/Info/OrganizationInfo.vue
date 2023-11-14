<template>
  <div>
    <q-card class="my-card shadow-3" style="height: 80px;">
      <q-toolbar class="shadow-2">
        <div>
          <div class="text-h6 q-pa-md">
            부서정보
          </div>
        </div>

        <q-space></q-space>

        <q-btn
          v-if="menuauth.modPermAt == true && orgCd != null"
          flat stretch
          icon="edit"
          @click="orgModify"
        >
          <q-tooltip>
            수정
          </q-tooltip>
        </q-btn>

        <q-btn
          v-if="menuauth.regPermAt == true && orgCd == null"
          flat stretch
          icon="save"
          @click="orgReg"
        >
          <q-tooltip>
            저장
          </q-tooltip>
        </q-btn>
      </q-toolbar>

      <q-separator />

      <q-card-section>
        <div class="q-gutter-lg">
          <div class="row q-col-gutter-md q-pb-md">
            <div class="col-lg-6">
              코드 <span style="color: red">&nbsp;*</span>
              <q-input
                dense square outlined
                v-bind:readonly="orgCd != null"
                v-model="orgInfo.orgCd"
                class="q-pt-sm"
              />
            </div>

            <div class="col-lg-6">
              부서명 <span style="color: red">&nbsp;*</span>
              <q-input
                dense square outlined
                v-bind:readonly="menuauth.modPermAt != true"
                v-model="orgInfo.orgNm"
                class="q-pt-sm"
              />
            </div>
          </div>

          <div class="row q-col-gutter-md q-pb-md">
            <div class="col-lg-6">
              이메일
              <q-input
                dense square outlined
                v-bind:readonly="menuauth.modPermAt != true"
                v-model="orgInfo.orgEmail"
                class="q-pt-sm"
                placeholder="대표 이메일 주소 입력"
              />
            </div>

            <div class="col-lg-6">
              전화번호
              <q-input
                dense square outlined
                v-bind:readonly="menuauth.modPermAt != true"
                v-model="orgInfo.orgTelNo"
                class="q-pt-sm"
                placeholder="&quot;-&quot; 구분자 사용"
              />
            </div>
          </div>

          <div class="row q-col-gutter-md q-pb-md">
            <div class="col-lg-6">
              표시여부
              <q-select
                dense square outlined
                v-bind:readonly="menuauth.modPermAt != true"
                v-model="orgInfo.displayAt"
                :options="displayAtOptions"
                emit-value map-options
                class="q-pt-sm"
              />
            </div>

            <div class="col-lg-6">
              표시순서
              <q-input
                dense square outlined
                v-bind:readonly="menuauth.modPermAt != true"
                v-model="orgInfo.displayOrd"
                class="q-pt-sm"
              />
            </div>
          </div>

          <div class="row q-col-gutter-md">
            <div class="col-lg-6">
              사용여부
              <q-select
                dense square outlined
                v-bind:readonly="menuauth.modPermAt != true"
                v-model="orgInfo.useAt"
                :options="useAtOptions"
                emit-value map-options
                class="q-pt-sm"
              />
            </div>
          </div>

          <div>
            <input type="hidden" v-model="orgInfo.lcCd">
            <input type="hidden" v-model="orgInfo.corpId">
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
  import { useUserStore } from 'src/stores/example-store';
  import { ref, onMounted, watch } from 'vue';
  import { Notify } from 'quasar'
  import axios from 'axios';

  const userStore = useUserStore();

  const props = defineProps([
    'menuauth',
    'corpId',
    'lcCd',
    'orgCd'
  ]);

  const menuauth = ref( props.menuauth );
  const upperCorpId = ref( props.corpId );
  const upperLcCd = ref( props.lcCd );
  const selectOrgCd = ref( props.orgCd );
  const orgInfo = ref({});
  const displayAtOptions = ref([
    {
      label: '표시',
      value: 'Y'
    },
    {
      label: '미표시',
      value: 'N'
    }
  ])

  const useAtOptions = ref([
  {
      label: '사용',
      value: 'Y'
    },
    {
      label: '미사용',
      value: 'N'
    }
  ])

  function loadData( lcCd, orgCd ) {
    axios.get( `/api/v1/logisticscenter/organization/${lcCd}/${orgCd}`
              , { headers : { Authorization : userStore.AccessToken } } )
    .then( res => {
      if( res.data.code == 0 ) {
        orgInfo.value = res.data.result;
      } else if ( res.data.code < 0 ) {
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

  function orgModify() {
    if( !orgInfo.value.orgCd
      || !orgInfo.value.orgNm ) {
      Notify.create({
        type: 'negative',
        message: '필수항목을 입력해주세요',
        timeout: 600
      })
    } else {
      axios.post( '/api/v1/logisticscenter/organization/modify'
                , orgInfo.value
                , { headers : { Authorization : userStore.AccessToken } } )
      .then( res => {
        if( res.data.code == 0 ) {
          Notify.create({
            type: 'positive',
            message: '부서정보가 수정되었습니다.',
            timeout: 600
          })

          setTimeout( () => {
            router.go(0)
          }, 1000 )
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
  }

  function orgReg() {
    if( !orgInfo.value.orgCd
      || !orgInfo.value.orgNm ) {
      Notify.create({
        type: 'negative',
        message: '필수항목을 입력해주세요',
        timeout: 600
      })
    } else {
      axios.post( '/api/v1/logisticscenter/organization/registration'
                , orgInfo.value
                , { headers : { Authorization : userStore.AccessToken } } )
      .then( res => {
        if( res.data.code == 0 ) {
          Notify.create({
            type: 'positive',
            message: '부서정보가 등록되었습니다.',
            timeout: 600
          })

          setTimeout( () => {
            router.go(0)
          }, 1000 )
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
  }

  function orgDel() {

  }

  function orgInfoClear() {
    orgInfo.value = {
      orgCd: null,
      orgNm: null,
      lcCd: upperLcCd.value,
      corpId: upperCorpId.value,
      orgTelNo: null,
      orgEmail: null,
      displayAt: null,
      displayOrd: null,
      useAt: null
    }
  }

  watch( () => props.orgCd, () => {
    if( props.orgCd != null ) {
      upperLcCd.value = props.lcCd;

      loadData( props.lcCd, props.orgCd )
    } else if ( props.orgCd == null ) {
      upperCorpId.value = props.corpId;
      upperLcCd.value = props.lcCd;
      selectOrgCd.value = props.orgCd;

      orgInfoClear()
    }
  })

  onMounted( () => {
    if( selectOrgCd.value != null ) {
      loadData( upperLcCd.value, selectOrgCd.value )
    } else if( selectOrgCd.value == null ) {
      orgInfoClear()
    }
  })
</script>
