<template>
  <div>
    <q-card class="my-card shadow-3" style="height: 800px;">
      <q-toolbar class="shadow-2">
        <div>
          <div class="text-h6 q-pa-md">
            물류센터
          </div>
        </div>

        <q-space></q-space>

        <q-btn
          v-if="menuauth.modPermAt == true && lcCd != null"
          flat stretch
          icon="edit"
          @click="logisModify"
        >
          <q-tooltip>
            수정
          </q-tooltip>
        </q-btn>

        <q-btn
          v-if="menuauth.regPermAt == true && lcCd == null"
          flat stretch
          icon="save"
          @click="logisReg"
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
            <div class="col-lg-4">
              코드 <span style="color: red">&nbsp;*</span>
              <q-input
                dense square outlined
                v-bind:readonly="lcCd != null"
                v-model="logisInfo.lcCd"
                class="q-pt-sm"
              />
            </div>

            <div class="col-lg-4">
              물류센터 <span style="color: red">&nbsp;*</span>
              <q-input
                dense square outlined
                v-bind:readonly="menuauth.modPermAt != true"
                v-model="logisInfo.lcNm"
                class="q-pt-sm"
              />
            </div>

            <div class="col-lg-4">
              약식명 <span style="color: red">&nbsp;*</span>
              <q-input
                dense square outlined
                v-bind:readonly="menuauth.modPermAt != true"
                v-model="logisInfo.lcShortNm"
                class="q-pt-sm"
              />
            </div>
          </div>

          <div class="row q-col-gutter-md q-pb-md">
            <div class="col-lg-4">
              사업자 등록 번호
              <q-input
                dense square outlined
                v-bind:readonly="menuauth.modPermAt != true"
                v-model="logisInfo.bizRegNo"
                class="q-pt-sm"
                placeholder="000-00-00000"
              />
            </div>

            <div class="col-lg-4">
              대표자
              <q-input
                dense square outlined
                v-bind:readonly="menuauth.modPermAt != true"
                v-model="logisInfo.ceoNm"
                class="q-pt-sm"
              />
            </div>

            <div class="col-lg-4">
              E-Mail
              <q-input
                dense square outlined
                v-bind:readonly="menuauth.modPermAt != true"
                v-model="logisInfo.lcEmail"
                class="q-pt-sm"
                placeholder="대표 이메일 주소 입력"
              />
            </div>
          </div>

          <div class="row q-col-gutter-md q-pb-md">
            <div class="col-lg-4">
              업태
              <q-select
                dense square outlined
                v-bind:readonly="menuauth.modPermAt != true"
                v-model="logisInfo.bizType"
                class="q-pt-sm"
              />
            </div>

            <div class="col-lg-4">
              종목
              <q-select
                dense square outlined
                v-bind:readonly="menuauth.modPermAt != true"
                v-model="logisInfo.bizItem"
                class="q-pt-sm"
              />
            </div>

            <div class="col-lg-4">
              대표 전화번호
              <q-input
                dense square outlined
                v-bind:readonly="menuauth.modPermAt != true"
                v-model="logisInfo.lcTelNo"
                class="q-pt-sm"
                placeholder="&quot;-&quot; 구분자 사용"
              />
            </div>
          </div>

          <div class="row q-col-gutter-md  q-pb-md">
            <div class="col-lg-12">
              주소
              <div class="row q-col-gutter-sm q-pt-sm">
                <div class="col-lg-2">
                  <q-input
                    dense square outlined disable
                    v-model="logisInfo.postNo"
                    placeholder="우편번호"
                    />
                </div>

                <div class="col-lg-4">
                  <q-input
                    dense square outlined disable
                    v-model="logisInfo.lcAddr"
                    placeholder="우편번호 선택시 자동 입력"
                  />
                </div>

                <div class="col-lg-4">
                  <q-input
                    dense square outlined
                    v-bind:readonly="menuauth.modPermAt != true"
                    v-model="logisInfo.lcAddrDtl"
                    placeholder="상세주소 입력"
                  />
                </div>

                <div class="col-lg-2">
                  <q-btn
                    v-bind:readonly="menuauth.modPermAt != true"
                    class="full-width"
                    color="teal-6"
                    @click="pastCode"
                  >
                    <span class="text-caption">
                      우편번호검색
                    </span>
                  </q-btn>
                </div>
              </div>
            </div>
          </div>

          <div class="row q-col-gutter-md">
            <div class="col-lg-4">
              표시여부
              <q-select
                dense square outlined
                v-bind:readonly="menuauth.modPermAt != true"
                v-model="logisInfo.displayAt"
                :options="displayAtOptions"
                emit-value map-options
                class="q-pt-sm"
              />
            </div>

            <div class="col-lg-4">
              표시순서
              <q-input
                dense square outlined
                v-bind:readonly="menuauth.modPermAt != true"
                v-model="logisInfo.displayOrd"
                class="q-pt-sm"
              />
            </div>

            <div class="col-lg-4">
              사용여부
              <q-select
                dense square outlined
                v-bind:readonly="menuauth.modPermAt != true"
                v-model="logisInfo.useAt"
                :options="useAtOptions"
                emit-value map-options
                class="q-pt-sm"
              />
            </div>
          </div>

          <div>
            <input type="hidden" v-model="logisInfo.corpId">
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
  import { useUserStore } from 'src/stores/example-store';
  import { ref, onMounted, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { Notify } from 'quasar'
  import axios from 'axios';

  const userStore = useUserStore();
  const router = useRouter();

  const props = defineProps([
    'menuauth',
    'corpId',
    'lcCd'
  ]);

  const menuauth = ref( props.menuauth );
  const selectLcCd = ref( props.lcCd );
  const upperCorpId = ref( props.corpId );
  const logisInfo = ref({});
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

  function loadData( lcCd ) {
    axios.get( `/api/v1/logisticscenter/${lcCd}`
            , { headers : { Authorization : userStore.AccessToken } } )
    .then( res => {
      if( res.data.code == 0 ) {
        logisInfo.value = res.data.result;
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

  function pastCode() {
    let address = null;
    let extraAddress = null;
    let postCode = null;

    new window.daum.Postcode({
      oncomplete: (data) => {
        if ( extraAddress != "") {
          extraAddress = "";
        }

        if( data.userSelectedType == "R" ) {
          // 도로명 주소를 선택했을 경우
          address = data.roadAddress;
        }
        else {
          // 지번주소를 선택했을 경우
          address = data.jibunAddress;
        }

        // 도로명 주소를 선택했을 경우 참고항목을 조합
        if( data.userSelectedType == "R" ) {
          // 법정동명이 있을 경우 추가한다. (법정리는 제외)
          // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
          if( data.bname != "" && /[동|로|가]$/g.test( data.bname ) ) {
              extraAddress += data.bname
          }

          // 건물명이 있고, 공동주택일 경우 추가한다.
          if( data.buildingName != "" || data.apartment == "Y" ) {
              extraAddress += extraAddress.value != "" ? `, ${data.buildingName}` : data.buildingName;
          }

          // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
          if( extraAddress != "" ) {
              extraAddress = `( ${ extraAddress } )`;
          }
        }
        else {
          extraAddress = "";
        }

        address = address + " " + extraAddress;

        // 우편번호를 입력한다.
        postCode = data.zonecode;

        logisInfo.value.lcAddr = address;
        logisInfo.value.lcAddrDtl = extraAddress;
        logisInfo.value.postNo = postCode;
      },
    }).open({
        popupKey: 'popup1'
    })
  }

  function logisModify() {
    if( !logisInfo.value.lcCd
      || !logisInfo.value.lcNm
      || !logisInfo.value.lcShortNm ) {
      Notify.create({
        type: 'negative',
        message: '필수항목을 입력해주세요',
        timeout: 600
      })
    } else {
      axios.post( '/api/v1/logisticscenter/modify'
              , logisInfo.value
              , { headers : { Authorization : userStore.AccessToken } } )
      .then( res => {
        if( res.data.code == 0) {
          Notify.create({
            type: 'positive',
            message: '물류센터 정보가 수정되었습니다.',
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

  function logisReg() {
    if( !logisInfo.value.lcCd
      || !logisInfo.value.lcNm
      || !logisInfo.value.lcShortNm ) {
      Notify.create({
        type: 'negative',
        message: '필수항목을 입력해주세요',
        timeout: 600
      })
    } else {
      axios.post( '/api/v1/logisticscenter/registration'
              , logisInfo.value
              , { headers : { Authorization : userStore.AccessToken } } )
      .then( res => {
        if( res.data.code == 0) {
          Notify.create({
            type: 'positive',
            message: '물류센터 정보가 등록되었습니다.',
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

  function logisDel() {
    if( !logisInfo.value.lcCd ) {
      Notify.create({
        type: 'negative',
        message: '필수항목을 입력해주세요',
        timeout: 600
      })
    } else {
      axios.post( '/api/v1/logisticscenter/registration'
              , logisInfo.value
              , { headers : { Authorization : userStore.AccessToken } } )
      .then( res => {
        if( res.data.code == 0) {
          Notify.create({
            type: 'positive',
            message: '물류센터 정보가 등록되었습니다.',
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

  function logisInfoClear() {
    logisInfo.value = {
      lcCd: null,
      lcNm: null,
      lcShortNm: null,
      corpId: upperCorpId.value,
      bizRegNo: null,
      ceoNm: null,
      bizType: null,
      bizItem: null,
      postNo: null,
      lcAddr: null,
      lcAddrDtl: null,
      lcTelNo: null,
      lcFaxNo: null,
      lcEmail: null,
      displayAt: null,
      displayOrd: null,
      useAt: null
    }
  }

  watch( () => props.lcCd, () => {
    if( props.lcCd != null ) {
      upperCorpId.value = props.corpId;
      selectLcCd.value = props.lcCd;

      loadData( props.lcCd )
    } else if ( props.lcCd == null ) {
      upperCorpId.value = props.corpId;
      selectLcCd.value = props.lcCd;

      logisInfoClear()
    }
  })

  onMounted( () => {
    if( selectLcCd.value != null ) {
      loadData( selectLcCd.value )
    } else if ( selectLcCd.value == null ) {
      logisInfoClear()
    }
  })
</script>
