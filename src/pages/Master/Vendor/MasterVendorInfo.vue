<template>
  <div>
    <q-form ref="vendorForm">
      <q-card class="my-card shadow-3">
        <q-card-section>
          <div class="q-pa-md">
            <div class="text-h6 text-bold text-indigo-10 q-pb-sm">
              일반정보
            </div>

            <div>
              <q-separator color="indigo-10"/>
            </div>

            <div class="q-pt-md">
              <div class="row q-col-gutter-lg q-pt-sm">
                <div class="col-lg-4">
                  코드 <span style="color: red;"> * </span>
                  <q-input
                    dense square outlined
                    v-model="bpInfo.bpCd"
                    v-bind:disable="keyfenUseBp == 'Y'"
                    v-bind:readonly="type == 'mod'"
                    @keyup.enter="bpCodeCheck"
                    :rules="[ valid_rules, val => val.length > 5 || '코드는 6자리이상이어야합니다.' ]"
                    lazy-rules
                    class="q-pt-sm"
                    placeholder="6자리 이상"
                  >
                    <template v-if="keyfenUseBp == 'N'" v-slot:after>
                      <div v-if="type == 'add'">
                        <q-btn
                          square unelevated
                          padding="8px 20px"
                          label="중복확인"
                          color="red"
                          @click="bpCodeCheck"
                        />
                      </div>
                    </template>
                  </q-input>
                </div>

                <div class="col-lg-4">
                  거래처명 <span style="color: red;"> * </span>
                  <q-input
                    dense square outlined
                    v-model="bpInfo.bpShortNm"
                    @blur="bpNmSetting"
                    :rules="[ valid_rules ]"
                    lazy-rules
                    class="q-pt-sm"
                    placeholder="시스템에서 사용"
                  />
                </div>

                <div class="col-lg-4">
                  인쇄용 거래처명 <span style="color: red;"> * </span>
                  <q-input
                    dense square outlined
                    v-model="bpInfo.bpPrintNm"
                    :rules="[ valid_rules ]"
                    lazy-rules
                    class="q-pt-sm"
                    placeholder="인쇄시 사용"
                  />
                </div>
              </div>

              <div class="row q-col-gutter-lg q-pt-md q-pb-md">
                <div class="col-lg-4">
                  거래처 유형 <span style="color: red;"> * </span>
                  <div class="q-pt-sm">
                    <q-radio v-model="bpInfo.bpType" val="B" label="매입처" />
                    <q-radio v-model="bpInfo.bpType" val="C" label="매입매출처" />
                  </div>
                </div>

                <div class="col-lg-4">
                  물류센터 <span style="color: red;"> * </span>
                  <logisSelectBox
                    :value="bpInfo.lcCd"
                    class="q-pt-sm"
                    @update-value="updateLcValue"
                  />
                </div>

                <div class="col-lg-4">
                  브랜드
                  <BrandSelectBox
                    :value="bpInfo.brdCd"
                    class="q-pt-sm"
                    @update-value="updateBrdValue"
                  />
                </div>
              </div>

              <div class="row q-col-gutter-lg q-pt-md">
                <div class="col-lg-4">
                  전화번호
                  <q-input
                    dense square outlined
                    v-model="bpInfo.bpTelNo"
                    :rules="[ telNo_rules ]"
                    lazy-rules
                    class="q-pt-sm"
                    placeholder="000-0000-0000 형식으로 입력"
                  />
                </div>

                <div class="col-lg-4">
                  핸드폰
                  <q-input
                    dense square outlined
                    v-model="bpInfo.bpMobile"
                    :rules="[ telNo_rules ]"
                    lazy-rules
                    class="q-pt-sm"
                    placeholder="000-0000-0000 형식으로 입력"
                  />
                </div>

                <div class="col-lg-4">
                  Fax
                  <q-input
                    dense square outlined
                    v-model="bpInfo.faxNo"
                    :rules="[ telNo_rules ]"
                    lazy-rules
                    class="q-pt-sm"
                    placeholder="000-0000-0000 형식으로 입력"
                  />
                </div>
              </div>

              <div class="row q-col-gutter-lg q-pt-md">
                <div class="col-lg-3">
                  배송지 주소
                  <q-input
                    dense square outlined
                    v-model="dlvyAddrSearch"
                    @keyup.enter="dlvyPostCode"
                    class="q-pt-sm"
                    placeholder="검색할 주소"
                  >
                    <template v-slot:append>
                      <q-btn
                        round dense flat
                        icon="search"
                        @click="dlvyPostCode"
                      />
                    </template>
                  </q-input>
                </div>

                <div class="col-lg-6">
                  &nbsp;
                  <q-input
                    dense square outlined disable
                    v-model="bpInfo.dlvyAddr"
                    class="q-pt-sm"
                    placeholder="선택시 자동 입력"
                  />
                </div>

                <div class="col-lg-3">
                  &nbsp;
                  <q-input
                    dense square outlined
                    v-model="bpInfo.dlvyAddrDtl"
                    class="q-pt-sm"
                    placeholder="상세주소 입력"
                  />
                </div>
              </div>

              <div class="row q-pt-lg">
                <div class="col-lg-12">
                  Memo
                  <q-input
                    dense square outlined
                    v-model="bpInfo.bpRemark1"
                    class="q-pt-sm"
                    placeholder="특이사항을 입력"
                  />
                  <q-input
                    dense square outlined
                    v-model="bpInfo.bpRemark2"
                    class="q-pt-sm"
                    placeholder="특이사항을 입력"
                  />
                  <q-input
                    dense square outlined
                    v-model="bpInfo.bpRemark3"
                    class="q-pt-sm"
                    placeholder="특이사항을 입력"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="q-pa-md">
            <div class="text-h6 text-bold text-indigo-10 q-pb-sm">
              세금계산서 정보
            </div>

            <div>
              <q-separator color="indigo-10"/>
            </div>

            <div class="q-pt-md">
              <div class="row q-col-gutter-lg q-pt-sm">
                <div class="col-lg-4">
                  사업자 번호 <span style="color: red;"> * </span>
                  <q-input
                    dense square outlined
                    v-model="bpInfo.bizRegNo"
                    :rules="[ valid_rules, regNo_rules ]"
                    lazy-rules
                    class="q-pt-sm"
                    placeholder="000-00-00000 형식으로 입력"
                  />
                </div>

                <div class="col-lg-4">
                  거래처명 <span style="color: red;"> * </span>
                  <q-input
                    dense square outlined
                    v-model="bpInfo.bpNm"
                    :rules="[ valid_rules ]"
                    lazy-rules
                    class="q-pt-sm"
                    placeholder="계산서, 거래명세서에서 사용"
                  />
                </div>

                <div class="col-lg-4">
                  대표자 <span style="color: red;"> * </span>
                  <q-input
                    dense square outlined
                    v-model="bpInfo.ceoNm"
                    :rules="[ valid_rules ]"
                    lazy-rules
                    class="q-pt-sm"
                  />
                </div>
              </div>

              <div class="row q-col-gutter-lg q-pt-md">
                <div class="col-lg-4">
                  업태 <span style="color: red;"> * </span>
                  <q-input
                    dense square outlined
                    v-model="bpInfo.bizType"
                    :rules="[ valid_rules ]"
                    lazy-rules
                    class="q-pt-sm"
                  />
                </div>

                <div class="col-lg-4">
                  종목 <span style="color: red;"> * </span>
                  <q-input
                    dense square outlined
                    v-model="bpInfo.bizItem"
                    :rules="[ valid_rules ]"
                    lazy-rules
                    class="q-pt-sm"
                  />
                </div>

                <div class="col-lg-4">
                  이메일
                  <q-input
                    dense square outlined
                    v-model="bpInfo.bpEmail"
                    :rules="[ email_rules ]"
                    lazy-rules
                    class="q-pt-sm"
                    placeholder="username@gmail.com 형식으로 입력"
                  />
                </div>
              </div>

              <div class="row q-col-gutter-lg q-pt-md">
                <div class="col-lg-3">
                  배송지 주소 <span style="color: red;"> * </span>
                  <q-input
                    dense square outlined readonly
                    v-model="bpInfo.postNo"
                    @keyup.enter="bpPostCode"
                    :rules="[ valid_rules ]"
                    lazy-rules
                    class="q-pt-sm"
                    placeholder="우편번호"
                  >
                    <template v-slot:append>
                      <q-btn
                        round dense flat
                        icon="search"
                        @click="bpPostCode"
                      />
                    </template>
                  </q-input>
                </div>

                <div class="col-lg-6">
                  &nbsp;
                  <q-input
                    dense square outlined disable
                    v-model="bpInfo.bpAddr"
                    :rules="[ valid_rules ]"
                    lazy-rules
                    class="q-pt-sm"
                    placeholder="선택시 자동 입력"
                  />
                </div>

                <div class="col-lg-3">
                  &nbsp;
                  <q-input
                    dense square outlined
                    v-model="bpInfo.bpAddrDtl"
                    class="q-pt-sm"
                    placeholder="상세주소 입력"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="q-pa-md">
            <div class="text-h6 text-bold text-indigo-10 q-pb-sm">
              분류 및 기타 정보
            </div>

            <div>
              <q-separator color="indigo-10"/>
            </div>

            <div class="q-pt-md">
              <div class="row q-col-gutter-lg q-pt-sm q-pb-md">
                <div class="col-lg-4">
                  대분류
                  <q-select
                    dense square outlined
                    v-model="bpInfo.bp1stDiv"
                    :options="bp1stDivList"
                    option-label="cdNm"
                    option-value="cd"
                    emit-value
                    map-options
                    class="q-pt-sm"
                  >
                    <template v-if="bpInfo.bp1stDiv == '' || bpInfo.bp1stDiv == null" v-slot:selected>
                      <div class="text-grey-6">선택안됨</div>
                    </template>
                  </q-select>
                </div>

                <div class="col-lg-4">
                  중분류
                  <q-select
                    dense square outlined
                    v-model="bpInfo.bp2ndDiv"
                    :options="bp2ndDivList"
                    option-label="cdNm"
                    option-value="cd"
                    emit-value
                    map-options
                    clearable
                    clear-icon="close"
                    class="q-pt-sm"
                  >
                    <template v-if="bpInfo.bp2ndDiv == '' || bpInfo.bp2ndDiv == null" v-slot:selected>
                      <div class="text-grey-6">선택안됨</div>
                    </template>
                  </q-select>
                </div>

                <div class="col-lg-4">
                  소분류
                  <q-select
                    dense square outlined
                    v-model="bpInfo.bp3rdDiv"
                    :options="bp3rdDivList"
                    option-label="cdNm"
                    option-value="cd"
                    emit-value
                    map-options
                    clearable
                    clear-icon="close"
                    class="q-pt-sm"
                  >
                    <template v-if="bpInfo.bp3rdDiv == '' || bpInfo.bp3rdDiv == null" v-slot:selected>
                      <div class="text-grey-6">선택안됨</div>
                    </template>
                  </q-select>
                </div>
              </div>

              <div class="row q-col-gutter-lg q-pt-lg q-pb-md">
                <div class="col-lg-4">
                  광역구분
                  <q-select
                    dense square outlined
                    v-model="bpInfo.wideRegion"
                    :options="wideRegionList"
                    option-label="cdNm"
                    option-value="cd"
                    emit-value
                    map-options
                    class="q-pt-sm"
                  >
                    <template v-if="bpInfo.wideRegion == '' || bpInfo.wideRegion == null" v-slot:selected>
                      <div class="text-grey-6">선택안됨</div>
                    </template>
                  </q-select>
                </div>

                <div class="col-lg-4">
                  권역구분
                  <q-select
                    dense square outlined
                    v-model="bpInfo.limitedRegion"
                    :options="limitedRegionList"
                    option-label="cdNm"
                    option-value="cd"
                    emit-value
                    map-options
                    clearable
                    clear-icon="close"
                    class="q-pt-sm"
                  >
                    <template v-if="bpInfo.limitedRegion == '' || bpInfo.limitedRegion == null" v-slot:selected>
                      <div class="text-grey-6">선택안됨</div>
                    </template>
                  </q-select>
                </div>
              </div>

              <div class="row q-col-gutter-lg q-pt-lg">
                <div class="col-lg-4">
                  사용여부 <span style="color: red;"> * </span>
                  <q-select
                    dense square outlined
                    v-model="bpInfo.useAt"
                    :options="useAtList"
                    option-label="cdNm"
                    option-value="cd"
                    emit-value
                    map-options
                    :rules="[ valid_rules ]"
                    lazy-rules
                    class="q-pt-sm"
                  />
                </div>

                <div class="col-lg-4">
                  노출상태 <span style="color: red;"> * </span>
                  <q-select
                    dense square outlined
                    v-model="bpInfo.displayAt"
                    :options="displayAtList"
                    option-label="cdNm"
                    option-value="cd"
                    emit-value
                    map-options
                    :rules="[ valid_rules ]"
                    lazy-rules
                    class="q-pt-sm"
                  />
                </div>
              </div>

              <div class="row q-col-gutter-lg q-pt-lg">
                <div class="col-lg-4">
                  거래상태 <span style="color: red;"> * </span>
                  <q-select
                    dense square outlined
                    v-model="bpInfo.transactionStatus"
                    :options="tranStatusList"
                    option-label="cdNm"
                    option-value="cd"
                    emit-value
                    map-options
                    :rules="[ valid_rules ]"
                    lazy-rules
                    class="q-pt-sm"
                  />
                </div>

                <div class="col-lg-4">
                  거래 게시일
                  <q-input dense square outlined v-model="bpInfo.transStartDay" class="q-pt-sm">
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-date v-model="bpInfo.transStartDay" mask="YYYY-MM-DD" minimal>
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="선택" color="primary" flat></q-btn>
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>

                <div class="col-lg-4">
                  거래 종료일
                  <q-input dense square outlined v-model="bpInfo.transEndDay" v-bind:disable="bpInfo.transactionStatus != 'F'" class="q-pt-sm">
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-date v-model="bpInfo.transEndDay" :options="dateOptions" mask="YYYY-MM-DD" minimal>
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="선택" color="primary" flat></q-btn>
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-section class="flex flex-center q-gutter-lg">
          <q-btn
            v-if="type == 'add'"
            square
            label="등록"
            color="green-7"
            @click="bpRegistation"
          />

          <q-btn
            v-if="type == 'mod'"
            square
            label="수정"
            color="green-7"
            @click="bpModify"
          />

          <q-btn
            square
            label="목록"
            color="grey-7"
            @click="goVendorList"
          />
        </q-card-section>
      </q-card>
    </q-form>
  </div>
</template>

<script setup>
  import { useUserStore } from 'src/stores/example-store';
  import { useRouter } from 'vue-router';
  import { Notify, date } from 'quasar';
  import { ref, onMounted, watch } from 'vue';
  import axios from 'axios';

  import logisSelectBox from 'src/component/SelectBox/LogisticsselectBox.vue';
  import BrandSelectBox from 'src/component/SelectBox/BrandSelectBox.vue';

  const userStore = useUserStore();
  const router = useRouter();

  const props = defineProps([
    'type',
    'bpcd'
  ])

  const type = ref(props.type);
  const bpCd = ref('');

  const keyfenUseBp = ref('');
  const bpInfo = ref({
    // 일반정보
    bpCd: null,
    bpNm: null,
    bpShortNm: null, // 시스템명
    bpPrintNm: null, // 인쇄명
    bpType: 'B',
    lcCd: null,
    brdCd: null,
    bpTelNo: null,
    bpMobile: null,
    faxNo: null,
    dlvyAddr: null,
    dlvyAddrDtl: null,
    dlvyFullAddr: null,
    bpRemark1: null,
    bpRemark2: null,
    bpRemark3: null,
    // 세금계산서 정보
    bizRegNo: null,
    bpNm: null, // 계산서, 거래명세서
    ceoNm: null,
    bizType: null,
    bizItem: null,
    bpEmail: null,
    postNo: null,
    bpAddr: null,
    bpAddrDtl: null,
    bpFullAddr: null,
    sido: null,
    gugun: null,
    lcLat: null,
    lcLong: null,
    // 분류 및 기타 정보
    bp1stDiv: null,
    bp2ndDiv: null,
    bp3rdDiv: null,
    wideRegion: null,
    limitedRegion: null,
    useAt: 'Y',
    displayAt: 'Y',
    transactionStatus: 'O',
    transStartDay: null,
    transEndDay: null
  })
  const dlvyAddrSearch = ref('');
  const vendorForm = ref('');
  const bpCdCheckAt = ref(true);

  const bp1stDivList = ref([]);
  const bp2ndDivList = ref([]);
  const bp3rdDivList = ref([]);
  const wideRegionList = ref([]);
  const limitedRegionList = ref([]);
  const useAtList = ref([])
  const displayAtList = ref([]);
  const tranStatusList = ref([]);

  const valid_rules = ( v ) => {
    if( !v || v == '' ) {
      return '필수항목입니다.';
    }
  }

  const email_rules = ( v ) => {
    const email = v.match(/[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]/g);
    if( v ) {
      if( !email ) {
        return '이메일 형식에 맞춰 입력해주세요.';
      }
    }
  }

  const regNo_rules = ( v ) => {
    const regNo = v.match(/\d{3}-\d{2}-\d{5}/g);
    if( !regNo ) {
      return '사업자 번호 형식에 맞춰 입력해주세요.';
    }
  }

  const telNo_rules = ( v ) => {
    const tel = v.match(/\d{2,3}-\d{3,4}-\d{4}/g);
    if( v ) {
      if( !tel ) {
        return '전화번호 형식에 맞춰 입력해주세요.';
      }
    }
  }

  function dateOptions( data ) {
    let value = date.formatDate( bpInfo.value.transStartDay, 'YYYY/MM/DD' );

    return data >= value;
  }

  function selectBoxData() {
    // 거래처코드 자동 등록 여부
    keyfenUseBp.value = ( userStore.sysconfig ).filter( sys => sys.category === '일반' && sys.envKey === 'keygen-use-bp' )[0].envValue;

    bp1stDivList.value = ( userStore.commomCode ).filter( code => code.cgId === 'G11');
    bp2ndDivList.value = ( userStore.commomCode ).filter( code => code.cgId === 'G12');
    bp3rdDivList.value = ( userStore.commomCode ).filter( code => code.cgId === 'G13');
    wideRegionList.value = ( userStore.commomCode ).filter( code => code.cgId === 'G15');
    limitedRegionList.value = ( userStore.commomCode ).filter( code => code.cgId === 'G16');
    useAtList.value = ( userStore.commomCode ).filter( code => code.cgId === 'C03');
    displayAtList.value = ( userStore.commomCode ).filter( code => code.cgId === 'C02');
    tranStatusList.value = ( userStore.commomCode ).filter( code => code.cgId === 'G14');
  }

  function loadData() {
    axios.get( `/api/v1/partner/${bpCd.value}`
            , { headers : { Authorization : userStore.AccessToken } } )
    .then( res => {
      if( res.data.code == 0 ) {
        bpInfo.value = res.data.result;
      } else if( res.data.code < 0 ) {
        Notify.create({
          type: 'negative',
          message: res.data.message,
          timeout: 600,
          position: 'center'
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

    return bpInfo.value;
  }

  function updateLcValue( e ) {
    if( e == null ) {
      bpInfo.value.lcCd = null;
    } else {
      bpInfo.value.lcCd = e;
    }
  }

  function updateBrdValue( e ) {
    if( e == null ) {
      bpInfo.value.brdCd = null;
    } else {
      bpInfo.value.brdCd = e;
    }
  }

  function bpCodeCheck() {
    if( bpInfo.value.bpCd.length < 6 ) {
      return;
    }
    if( bpInfo.value.bpCd != null ) {
      axios.get( `/api/v1/partner/checkCode/${bpInfo.value.bpCd}`
              , { headers : { Authorization : userStore.AccessToken } } )
      .then( res => {
        if( res.data.code == 0 ) {
          bpCdCheckAt.value = res.data.result.isExist;
          if( bpCdCheckAt.value == true ) {
            Notify.create({
              type: 'negative',
              message: '이미 존재하는 코드입니다.',
              timeout: 600,
              position: 'center'
            })
          } else if( bpCdCheckAt.value == false ) {
            Notify.create({
              type: 'positive',
              message: '사용가능한 코드입니다..',
              timeout: 600,
              position: 'center'
            })
          }
        }
      })
    }
  }

  function bpNmSetting() {

    if( bpInfo.value.bpNm == null ) {
      bpInfo.value.bpNm = bpInfo.value.bpShortNm;
    }

    if( bpInfo.value.bpPrintNm == null ) {
      bpInfo.value.bpPrintNm = bpInfo.value.bpShortNm;
    }
  }

  function dlvyPostCode() {
    let address = null;
    let extraAddress = null;

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

        bpInfo.value.dlvyAddr = address;
        bpInfo.value.dlvyAddrDtl = extraAddress;
      },
    }).open({
        q: dlvyAddrSearch.value,
        popupKey: 'popup1'
    })
  }

  function bpPostCode() {
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

        // 위도 경도 구하기
        const geocoder = new daum.maps.services.Geocoder();

        geocoder.addressSearch( address, ( result, status ) =>{
          if( status === daum.maps.services.Status.OK ) {
            bpInfo.value.lcLat = result[0].y;
            bpInfo.value.lcLong = result[0].x;
          }
        })

        // 우편번호를 입력한다.
        postCode = data.zonecode;

        bpInfo.value.bpAddr = address;
        bpInfo.value.bpAddrDtl = extraAddress;
        bpInfo.value.postNo = postCode;
        bpInfo.value.sido = data.sido;
        bpInfo.value.gugun = data.sigungu;
      },
    }).open({
        popupKey: 'popup1'
    })
  }

  async function bpRegistation() {
    let valid = await vendorForm.value.validate();

    if( valid == false ) {
      Notify.create({
        type: 'negative',
        message: '입력내용을 확인해주세요.',
        timeout: 600,
        position: 'center'
      })
      return;
    }

    if( bpCdCheckAt.value == true ) {
      Notify.create({
        type: 'negative',
        message: '코드를 사용할 수 없습니다. 다시 확인해주세요.',
        timeout: 600,
        position: 'center'
      })
      return;
    }

    bpInfo.value.dlvyFullAddr = bpInfo.value.dlvyAddr + " " + bpInfo.value.dlvyAddrDtl;
    bpInfo.value.bpFullAddr = bpInfo.value.bpAddr + " " + bpInfo.value.bpAddrDtl;

    axios.post( '/api/v1/partner/registration'
              , bpInfo.value
              , { headers : { Authorization : userStore.AccessToken } } )
    .then( res => {
      if( res.data.code == 0 ) {
        Notify.create({
          type: 'positive',
          message: '매입처가 등록되었습니다.',
          timeout: 600,
          position: 'center'
        })

        loadData()
      } else if( res.data.code < 0 ) {
        Notify.create({
          type: 'negative',
          message: res.data.message,
          timeout: 600,
          position: 'center'
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

  async function bpModify() {
    let valid = await vendorForm.value.validate();

    if( valid == false ) {
      Notify.create({
        type: 'negative',
        message: '입력내용을 확인해주세요.',
        timeout: 600,
        position: 'center'
      })
      return;
    }

    bpInfo.value.dlvyFullAddr = bpInfo.value.dlvyAddr + " " + bpInfo.value.dlvyAddrDtl;
    bpInfo.value.bpFullAddr = bpInfo.value.bpAddr + " " + bpInfo.value.bpAddrDtl;

    axios.post( '/api/v1/partner/modify'
              , bpInfo.value
              , { headers : { Authorization : userStore.AccessToken } } )
    .then( res => {
      console.log(res)

      if( res.data.code == 0 ) {
        Notify.create({
          type: 'positive',
          message: '매입처 정보가 수정되었습니다.',
          timeout: 600,
          position: 'center'
        })

        loadData()
      } else if( res.data.code < 0 ) {
        Notify.create({
          type: 'negative',
          message: res.data.message,
          timeout: 600,
          position: 'center'
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

  function goVendorList() {
    router.push( {
      path: "/master/info/vendor",
      state: {
        data : history.state.data
      }
    })
  }

  watch( () => props.bpcd, () => {
    bpCd.value = props.bpcd;

    loadData()
  })

  onMounted( () => {
    selectBoxData()
  })
</script>
