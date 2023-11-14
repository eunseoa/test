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
          <q-breadcrumbs-el label="매출처정보" class="text-blue-10"/>
      </q-breadcrumbs>
    </div>

    <div class="row q-py-lg">
      <div class="text-h5 text-weight-bolder">
        <q-icon name="local_shipping" />
        &nbsp;<span>매출처정보</span>
      </div>
    </div>

    <div class="q-col-gutter-sm">
      <div class="row">
        <div class="col-lg-12">
          <q-card class="my-card shadow-3">
            <q-toolbar class="shadow-2">
              <div class="text-h6 q-pa-md text-weight-bold">
                일반 정보
              </div>
            </q-toolbar>

            <q-separator />

            <q-card-section>
              <table border="1" class="bizPartnerTbl">
                <tr>
                  <td class="key-col1">
                    코 드
                  </td>
                  <td class="key-col2">
                    <span>
                      {{ partnerInfo.bpCd }}
                    </span>
                  </td>

                  <td class="key-col1">
                    거 래 처 명
                  </td>
                  <td class="key-col2">
                    <span>
                      {{ partnerInfo.bpNm }}
                    </span>
                  </td>
                </tr>

                <tr>
                  <td class="key-col1">
                    거 래 처 유 형
                  </td>
                  <td class="key-col2">
                    <span>
                      {{ partnerInfo.bpTypeNm }}
                    </span>
                  </td>

                  <td class="key-col1">
                    인 쇄 명
                  </td>
                  <td class="key-col2">
                    <span>
                      {{ partnerInfo.bpPrintNm }}
                    </span>
                  </td>
                </tr>

                <tr>
                  <td class="key-col1">
                    브 랜 드
                  </td>
                  <td class="key-col2">
                    <span>
                      {{ partnerInfo.brdNm }}
                    </span>
                  </td>

                  <td class="key-col1">
                    상 위 거 래 처
                  </td>
                  <td class="key-col2">
                    <span v-if="partnerInfo.parentBpNm != '' || partnerInfo.parentBpNm != null">
                      {{ partnerInfo.parentBpNm }}
                    </span>
                    <span v-if="partnerInfo.parentBpNm == '' || partnerInfo.parentBpNm == null" class="text-grey-5">
                      ( 등록안됨 )
                    </span>
                  </td>
                </tr>

                <tr>
                  <td class="key-col1">
                    전 화 번 호
                  </td>
                  <td class="key-col2">
                    <span>
                      {{ partnerInfo.bpTelNo }}
                    </span>
                  </td>

                  <td class="key-col1">
                    핸 드 폰
                  </td>
                  <td class="key-col2">
                    <span>
                      {{ partnerInfo.bpMobile }}
                    </span>
                  </td>
                </tr>

                <tr>
                  <td class="key-col1">
                    납 품 주 소
                  </td>
                  <td colspan="3" class="key-col2">
                    <span v-if="partnerInfo.postNo != null">
                     ( {{ partnerInfo.postNo }} )
                    </span>
                    <span>
                      {{ partnerInfo.dlvyFullAddr }}
                    </span>
                  </td>
                </tr>

                <tr>
                  <td class="key-col1">
                    M e m o 1
                  </td>
                  <td colspan="3" class="key-col2">
                    <span>
                      {{ partnerInfo.bpRemark1 }}
                    </span>
                  </td>
                </tr>

                <tr>
                  <td class="key-col1">
                    M e m o 2
                  </td>
                  <td colspan="3" class="key-col2">
                    <span>
                      {{ partnerInfo.bpRemark2 }}
                    </span>
                  </td>
                </tr>

                <tr>
                  <td class="key-col1">
                    M e m o 3
                  </td>
                  <td colspan="3" class="key-col2">
                    <span>
                      {{ partnerInfo.bpRemark3 }}
                    </span>
                  </td>
                </tr>
              </table>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-12">
          <q-card class="my-card shadow-3">
            <q-toolbar class="shadow-2">
              <div class="text-h6 q-pa-md text-weight-bold">
                사업장 등록 정보
              </div>
            </q-toolbar>

            <q-separator />

            <q-card-section>
              <table border="1" class="bizPartnerTbl">
                <tr>
                  <td class="key-col1">
                    사 업 자 번 호
                  </td>
                  <td class="key-col2">
                    <span>
                      {{ partnerInfo.bizRegNo }}
                    </span>
                  </td>

                  <td class="key-col1">
                    거 래 처 명
                  </td>
                  <td class="key-col2">
                    <span>
                      {{ partnerInfo.bpNm }}
                    </span>
                  </td>
                </tr>

                <tr>
                  <td class="key-col1">
                    대 표 자
                  </td>
                  <td class="key-col2">
                    <span>
                      {{ partnerInfo.ceoNm }}
                    </span>
                  </td>

                  <td class="key-col1">
                    업 태
                  </td>
                  <td class="key-col2">
                    <span>
                      {{ partnerInfo.bizType }}
                    </span>
                  </td>
                </tr>

                <tr>
                  <td class="key-col1">
                    이 메 일
                  </td>
                  <td class="key-col2">
                    <span>
                      {{ partnerInfo.bpEmail }}
                    </span>
                  </td>

                  <td class="key-col1">
                    종 목
                  </td>
                  <td class="key-col2">
                    <span v-if="partnerInfo.bizItem != null || partnerInfo.bizItem != ''">
                      {{ partnerInfo.bizItem }}
                    </span>
                    <span v-if="partnerInfo.bizItem == null || partnerInfo.bizItem == ''" class="text-grey-5">
                      ( 등록안됨 )
                    </span>
                  </td>
                </tr>

                <tr>
                  <td class="key-col1">
                    청 구 주 소
                  </td>
                  <td colspan="3" class="key-col2">
                    <span v-if="partnerInfo.postNo != null">
                     ( {{ partnerInfo.postNo }} )
                    </span>
                    <span>
                      {{ partnerInfo.bpFullAddr }}
                    </span>
                  </td>
                </tr>
              </table>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <div class="row">
        <div class="col-lg-12">
          <q-card class="my-card shadow-3">
            <q-toolbar class="shadow-2">
              <div class="text-h6 q-pa-md text-weight-bold">
                분류 및 상태 정보
              </div>
            </q-toolbar>

            <q-separator />

            <q-card-section>
              <table border="1" class="bizPartnerTbl">
                <tr>
                  <td class="key-col1">
                    사 용 여 부
                  </td>
                  <td class="key-col2">
                    <span>
                      {{ partnerInfo.useAtNm }}
                    </span>
                  </td>

                  <td class="key-col1">
                    대 분 류
                  </td>
                  <td class="key-col2">
                    <span>
                      {{ partnerInfo.bp1stDivNm }}
                    </span>
                  </td>
                </tr>

                <tr>
                  <td class="key-col1">
                    거 래 여 부
                  </td>
                  <td class="key-col2">
                    <span>
                      {{ partnerInfo.transactionStatusNm }}
                    </span>
                  </td>

                  <td class="key-col1">
                    중 분 류
                  </td>
                  <td class="key-col2">
                    <span v-if="partnerInfo.bp2ndDivNm != null || partnerInfo.bp2ndDivNm != ''">
                      {{ partnerInfo.bp2ndDivNm }}
                    </span>
                    <span v-if="partnerInfo.bp2ndDivNm == null || partnerInfo.bp2ndDivNm == ''" class="text-grey-5">
                      ( 등록안됨 )
                    </span>
                  </td>
                </tr>

                <tr>
                  <td class="key-col1">
                    노 출 상 태
                  </td>
                  <td class="key-col2">
                    <span>
                      {{ partnerInfo.displayAtNm }}
                    </span>
                  </td>

                  <td class="key-col1">
                    소 분 류
                  </td>
                  <td class="key-col2">
                    <span v-if="partnerInfo.bp3rdDivNm != null || partnerInfo.bp3rdDivNm != ''">
                      {{ partnerInfo.bp3rdDivNm }}
                    </span>
                    <span v-if="partnerInfo.bp3rdDivNm == null || partnerInfo.bp3rdDivNm == ''" class="text-grey-5">
                      ( 등록안됨 )
                    </span>
                  </td>
                </tr>

                <tr>
                  <td class="key-col1">
                    거 래 게 시 일
                  </td>
                  <td class="key-col2">
                    <span>
                      {{ partnerInfo.transStartDay }}
                    </span>
                  </td>

                  <td class="key-col1">
                    광 역 구 분
                  </td>
                  <td class="key-col2">
                    <span>
                      {{ partnerInfo.wideRegionNm }}
                    </span>
                  </td>
                </tr>

                <tr>
                  <td class="key-col1">
                    거 래 종 료 일
                  </td>
                  <td class="key-col2">
                    <span>
                      {{ partnerInfo.transEndDay }}
                    </span>
                  </td>

                  <td class="key-col1">
                    권 역 구 분
                  </td>
                  <td class="key-col2">
                    <span>
                      {{ partnerInfo.limitedRegionNm }}
                    </span>
                  </td>
                </tr>
              </table>
            </q-card-section>

            <q-card-section>
              <div class="flex flex-center">
                <q-btn
                  label="목록"
                  @click="goBizPartVehicleList"
                />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
  import { useUserStore } from 'src/stores/example-store';
  import { Notify, Dialog } from 'quasar';
  import { useRouter } from 'vue-router';
  import { ref, onMounted } from 'vue';
  import axios from 'axios';

  const userStore = useUserStore();
  const router = useRouter();

  const bpCd = ref('');
  const partnerInfo = ref({});

  function loadData() {
    axios.get( `/api/v1/partner/${bpCd.value}`
            , { headers : { Authorization : userStore.AccessToken } } )
    .then( res => {
      if( res.data.code == 0 ) {
        partnerInfo.value = res.data.result;
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

  function goBizPartVehicleList() {
    router.push( {
      path: "/master/info/vehicle",
      state: {
        data : {
          tab : 'vehicleBizPartner'
        }
      }
    })
  }

  onMounted( () => {
    if( history.state.data == null ) {
      return;
    }

    bpCd.value = history.state.data.bpCd;

    loadData()
  })
</script>

<style lang="css">
  .bizPartnerTbl {
    width: 100%;
    border: 1px solid rgba(0, 0, 0, .5);
    border-collapse: collapse;
  }

  .bizPartnerTbl tr td {
    border: 1px solid rgba(0, 0, 0, .5);
    height: 50px;
  }

  .key-col1 {
    width: 200px;
    text-align: justify;
    line-height: 0;
    font-size: 18px;
    font-weight: bold;
    background-color: #e8eaf6;
    padding: 15px
  }

  .bizPartnerTbl .key-col1:after {
    content: "";
    display: inline-block;
    width: 100%;
  }

  .bizPartnerTbl .key-col1:before {
    content: "";
    display: inline-block;
    width: 100%;
  }

  .key-col2 {
    width: 650px;
    font-size: 17px;
    padding: 10px
  }
</style>
