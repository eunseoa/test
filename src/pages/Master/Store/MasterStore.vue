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
          <q-breadcrumbs-el label="매출처(매장)" icon="storefront" class="text-blue-10"/>
      </q-breadcrumbs>
    </div>

    <div class="row q-py-lg">
      <div class="text-h5 text-weight-bolder">
        <q-icon name="storefront" />
        &nbsp;<span>매출처(매장) 관리</span>
      </div>
    </div>

    <div>
      <q-card class="my-card shadow-3" style="height: 800px;">
        <!-- <q-toolbar class="shadow-2" style="height: 50px;">
          <div class="text-h6 q-pa-md text-weight-bold">
            매입처 관리
          </div>
        </q-toolbar>

        <q-separator /> -->

        <q-card-section class="q-pb-none">
          <!-- 검색 -->
          <div class="row q-col-gutter-sm">
            <div class="col-lg-2">
              <q-input
                dense square outlined
                v-model="storeSearch"
                placeholder="검색할 코드 또는 명칭"
              />
            </div>

            <div class="col-lg-2">
              <logisticsselect-box
                :value="logisSearch"
                @update-value="updateLcValue"
              />
            </div>

            <div class="col-lg-2">
              <brand-select-box
                :value="brandSearch"
                @update-value="updateBrdValue"
              />
            </div>

            <div class="col-lg-2">
              <q-select
                dense square outlined
                v-model="useAtSearch"
                :options="useAtList"
                option-label="cdNm"
                option-value="cd"
                emit-value
                map-options
                clearable
                clear-icon="clear"
              >
                <template v-if="useAtSearch == '' || useAtSearch == null" v-slot:selected>
                  <div class="text-grey-6">사용여부 선택</div>
                </template>
              </q-select>
            </div>

            <div class="col-lg-2">
              <q-select
                dense square outlined
                v-model="bp1StDivSearch"
                :options="bp1StDivList"
                option-label="cdNm"
                option-value="cd"
                emit-value
                map-options
                clearable
                clear-icon="clear"
              >
                <template v-if="bp1StDivSearch == '' || bp1StDivSearch == null" v-slot:selected>
                  <div class="text-grey-6">대분류 선택</div>
                </template>
              </q-select>
            </div>

            <div class="col-lg-2">
              <q-btn
                label="조회"
                padding="8px 30px"
                color="indigo-8"
              />
            </div>
          </div>

          <!-- 기능 -->
          <div class="row q-pt-md">
            <div class="col-lg-12 q-gutter-sm">
              <q-btn
                v-if="menuauth.regPermAt == true"
                label="등록"
                padding="6px 35px"
                style="background-color: #253abb; color: #ffffff"
              />

              <q-btn
                v-if="menuauth.regPermAt == true"
                label="일괄등록"
                padding="6px 35px"
                style="background-color: #253abb; color: #ffffff"
              />

              <q-btn
                v-if="menuauth.modPermAt == true"
                label="수정"
                padding="6px 35px"
                style="background-color: #7483e3; color: #ffffff"
              />

              <q-btn
                v-if="menuauth.regPermAt == true"
                label="담당자 등록"
                padding="6px 35px"
                style="background-color: #253abb; color: #ffffff"
              />

              <q-btn
                label="엑셀 다운로드"
                padding="6px 35px"
                style="background-color: #44aa46; color: #ffffff"
              />

              <q-btn
                v-if="menuauth.delPermAt == true"
                color="red-9"
                padding="6px 35px"
                label="삭제"
              />
            </div>
          </div>
        </q-card-section>

        <div class="q-pb-sm q-pr-sm" align="right">
          총 데이터 : {{ totalCount }} 개
        </div>

        <div>
          <tui-grid
            ref="storeTable"
            :options="storeOptions.options"
            :columns="storeOptions.columns"
            :data="storeOptions.data"
          />
        </div>

        <div class="flex flex-center q-pt-sm">
          <q-pagination
            v-model="clickPage"
            :max="pageSize"
            input
            color="indigo-8"
            @update:model-value="loadData"
          />
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
  import { useUserStore } from 'src/stores/example-store';
  import fileDownLoad from 'js-file-download';
  import { Notify, Dialog } from 'quasar';
  import { TuiGrid } from "vue3-tui-grid";
  import { useRouter } from 'vue-router';
  import { ref, onMounted } from 'vue';
  import axios from 'axios';

  import LogisticsselectBox from 'src/component/SelectBox/LogisticsselectBox.vue';
  import BrandSelectBox from 'src/component/SelectBox/BrandSelectBox.vue';

  const userStore = useUserStore();

  let menu = null;
  const menuauth = ref({
    regPermAt: '', // 등록권한
    modPermAt: '', // 수정권한
    delPermAt: '', // 삭제권한
    execPermAt: '', // 실행권한
  });

  // 테이블
  const storeTable = ref('');
  let storeGrid = null;
  let storeInstance = null;
  const storeOptions = ref({
    options: {
      columnOptions: {
        frozenCount: 2,
        frozenBorderWidth: 0
      },
      contextMenu: ( { rowKey } ) => (
        [
          [
            {
              name: 'menu1',
              label: '등록',
              disabled: !menuauth.value.regPermAt,
              action: () => {
              }
            },
            {
              name: 'menu2',
              label: '수정',
              disabled: !menuauth.value.modPermAt,
              action: () => {
              }
            },
            {
              name: 'menu3',
              label: '삭제',
              disabled: !menuauth.value.delPermAt,
              action: () => {
              }
            },
            {
              name: 'menu4',
              label: '담당자 등록',
              disabled: !menuauth.value.regPermAt,
              action: () => {
              }
            },
            {
              name: 'menu5',
              label: '담당자 목록',
              action: () => {
              }
            }
          ]
        ]
      ),
      rowHeaders: ['rowNum'],
    },
    columns: [
      {
        header: '코드',
        name: 'bpCd',
        minWidth: 100,
        align: 'center',
        sortable: true
      },
      {
        header: '매입처명',
        name: 'bpNm',
        minWidth: 200,
        sortable: true
      },
      {
        header: '약식명',
        name: 'bpShortCd',
        minWidth: 200,
        sortable: true
      },
      {
        header: '물류센터',
        name: 'lcNm',
        minWidth: 160,
        sortable: true
      },
      {
        header: '브랜드',
        name: 'brdNm',
        minWidth: 160,
        sortable: true
      },
      {
        header: '대분류',
        name: 'bp1stDivNm',
        minWidth: 180,
        sortable: true
      },
      {
        header: '거래상태',
        name: 'transactionStatusNm',
        minWidth: 100,
        sortable: true
      },
      {
        header: '대표자',
        name: 'ceoNm',
        minWidth: 100,
        sortable: true
      },
      {
        header: '전화번호',
        name: 'bpTelNo',
        minWidth: 120,
        align: 'center'
      },
      {
        header: '핸드폰',
        name: 'bpMobile',
        minWidth: 120,
        align: 'center'
      },
      {
        header: '사업자번호',
        name: 'bizRegNo',
        minWidth: 120,
        align: 'center'
      },
      {
        header: '업태',
        name: 'bizType',
        minWidth: 100,
        sortable: true
      },
      {
        header: '종목',
        name: 'bizItem',
        minWidth: 100,
        sortable: true
      },
      {
        header: '이메일',
        name: 'bpEmail',
        minWidth: 180
      },
      {
        header: '우편번호',
        name: 'postNo',
        minWidth: 80,
        align: 'center'
      },
      {
        header: '주소',
        name: 'bpFullAddr',
        minWidth: 600,
        sortable: true
      },
      {
        header: '배송주소',
        name: 'dlvyFullAddr',
        minWidth: 600,
        sortable: true
      },
      {
        header: '팩스번호',
        name: 'faxNo',
        minWidth: 160
      },
      {
        header: '광역구분',
        name: 'wideRegionNm',
        minWidth: 80,
        sortable: true
      },
      {
        header: '권역구분',
        name: 'limitedRegionNm',
        minWidth: 110,
        sortable: true
      },
      {
        header: '중분류',
        name: 'bp2ndDivNm',
        minWidth: 180,
        sortable: true
      },
      {
        header: '소분류',
        name: 'bp3rdDivNm',
        minWidth: 180,
        sortable: true
      },
      {
        header: '사용여부',
        name: 'useAtNm',
        minWidth: 90,
        sortable: true
      },
      {
        header: '거래게시일',
        name: 'transStartDay',
        minWidth: 120,
        align: 'center',
        sortable: true
      },
      {
        header: '거래종료일',
        name: 'transEndDay',
        minWidth: 120,
        align: 'center',
        sortable: true
      },
      {
        header: '비고',
        name: 'bpRemark1',
        minWidth: 180
      }
    ],
    data: []
  })

  // 검색
  const storeSearch = ref( '' );
  const logisSearch = ref( '' );
  const brandSearch = ref( '' );
  const useAtSearch = ref( '' );
  const useAtList = ref( [] );
  const bp1StDivSearch = ref( '' );
  const bp1StDivList = ref( [] );

  const totalCount = ref( 0 );
  const clickPage = ref( 1 );
  const pageSize = ref( 0 );
  const rowPerPage = ref( 0 );

  // 물류센터 selectbox @v-model:update-value
  function updateLcValue( e ) {
    logisSearch.value = e
  }

  // 브랜드 selectbox @v-model:update-value
  function updateBrdValue( e ) {
    brandSearch.value = e
  }

  // 권한 가져오기
  function selectMenuAuth() {
    menu = userStore.MenuAuthority;
    menu = menu.filter( menu => menu.menuNm === '매출처(매장)관리' );

    menuauth.value.regPermAt = menu[0].regPermAt;
    menuauth.value.modPermAt = menu[0].modPermAt;
    menuauth.value.delPermAt = menu[0].delPermAt;
    menuauth.value.execPermAt = menu[0].execPermAt;
  }

  function selectboxData() {
    useAtList.value = ( userStore.commomCode ).filter( code => code.cgId === 'C03');
    bp1StDivList.value = ( userStore.commomCode ).filter( code => code.cgId === 'G11' );

    // 페이지당 조회건수
    rowPerPage.value = ( userStore.sysconfig ).filter( sys => sys.category === '일반' && sys.envKey === 'rowcount-per-page' )[0].envValue;
  }

  // 매출처 데이터
  function loadData() {
    axios.post( `/api/v1/partner/store`
              + `?searchWord=${storeSearch.value}`
              + `&lcCd=${logisSearch.value}`
              + `&brdCd=${brandSearch.value}`
              + `&useAt=${useAtSearch.value}`
              + `&bp1StDiv=${bp1StDivSearch.value}`
              + `&pageNumber=${clickPage.value}`,
              + `&rowCountPerPage=${rowPerPage.value}`
              , { headers : { Authorization : userStore.AccessToken } } )
    .then( res => {
      if( res.data.code == 0 ) {
        if( res.data.count > 0 ) {
          storeInstance.resetData( res.data.result )
        } else if( res.data.count < 1 ) {
          storeInstance.resetData( [] )
        }

        totalCount.value = res.data.totalCount;
        pageSize.value = res.data.pageSize;
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

  onMounted( () => {
    selectMenuAuth()
    selectboxData()
    loadData()

    storeGrid = storeTable.value;
    storeInstance = storeGrid.gridInstance;

    console.log(storeTable.value)

    storeGrid.applyTheme( "clean", {
      cell: {
        header: {
          background: '#dee7f7'
        },
      }
    });
    storeGrid.setLanguage('ko', {
      display: {
        noData: '데이터가 없습니다.',
        loadingData: '데이터가 로딩중입니다.'
      }
    });
    storeInstance.setBodyHeight( 560 );
  })
</script>
