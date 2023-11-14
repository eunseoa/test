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
          <q-breadcrumbs-el label="브랜드정보" icon="store" class="text-blue-10"/>
      </q-breadcrumbs>
    </div>

    <div class="row q-py-lg">
      <div class="text-h5 text-weight-bolder">
        <q-icon name="store" />
        &nbsp;<span>브랜드정보</span>
      </div>
    </div>

    <div>
      <q-card class="my-card shadow-3" style="height: 800px;">
        <q-toolbar class="shadow-2" style="height: 50px;">
          <div class="text-h6 q-pa-md text-weight-bold">
            브랜드정보
          </div>

          <q-space></q-space>

          <q-btn
            v-if="menuauth.modPermAt == true"
            flat stretch
            icon="add"
            @click="brandRowAdd"
          >
            <q-tooltip>
              등록
            </q-tooltip>
          </q-btn>

          <q-btn
            v-if="menuauth.modPermAt == true"
            flat stretch
            icon="edit"
            @click="brandMod"
          >
            <q-tooltip>
              수정
            </q-tooltip>
          </q-btn>

          <q-btn
            v-if="menuauth.regPermAt == true"
            flat stretch
            icon="save"
            @click="brandReg"
          >
            <q-tooltip>
              저장
            </q-tooltip>
          </q-btn>
        </q-toolbar>

        <q-separator />

        <q-card-section class="q-pb-none">
          <div class="row q-col-gutter-sm">
            <div class="col-lg-2">
              <q-input
                dense square outlined
                v-model="brandSearch"
                @keyup.enter="loadData"
                placeholder="검색 코드 또는 명칭"
              />
            </div>
            <div class="col-lg-2">
              <q-select
                dense square outlined
                v-model="brandUseAt"
                :options="useAtList"
                option-label="text"
                option-value="value"
                emit-value
                map-options
                clearable
                clear-icon="close"
              >
                <template v-if="brandUseAt == '' || brandUseAt == null" v-slot:selected>
                  <div class="text-grey-6">사용여부 선택</div>
                </template>
              </q-select>
            </div>

            <div class="col-lg-1">
              <q-btn
                label="조회"
                color="indigo-7"
                @click="loadData"
              />
            </div>
          </div>
        </q-card-section>

        <div class="q-pb-sm q-pr-sm" align="right">
          총 데이터 : {{ dataTotalCount }} 개
        </div>

        <div>
          <TuiGrid
            ref="brandTable"
            :columns="brandOptions.columns"
            :data="brandOptions.data"
          />
        </div>
      </q-card>
    </div>

    <q-dialog v-model="bizPartDialogAt" persistent>
      <biz-part-dialog
        @bizpart-value="bizPartvalue"
      />
    </q-dialog>
  </q-page>
</template>

<script setup>
  import { useUserStore } from 'src/stores/example-store';
  import { ref, onMounted } from 'vue';
  import { TuiGrid } from "vue3-tui-grid";
  import { Notify } from 'quasar';
  import axios from 'axios';

  import bizPartDialog from 'src/component/Dialog/BizPartnerDialog.vue';

  const userStore = useUserStore();

  const bizPartDialogAt = ref(false);
  const brandSearch = ref('');
  const brandUseAt = ref('Y');
  const useAtList = ref([]);
  const YNList = ref([]);
  let brandClickRow = null; // 현재선택된 브랜드
  const dataTotalCount = ref(0);

  const brandTable = ref('');
  let brandGrid = null;
  let brandInstance = null;
  const brandOptions = ref({
    columns: [
      {
        header: '코드 *',
        name: 'brdCd',
        editor: 'text',
        minWidth: 100,
        align: 'center',
        sortable: true
      },
      {
        header: '브랜드 *',
        name: 'brdNm',
        editor: 'text',
        minWidth: 160,
        sortable: true
      },
      {
        header: '약식명',
        name: 'brdShortNm',
        editor: 'text',
        minWidth: 160,
        sortable: true
      },
      {
        header: '본사코드',
        name: 'bpCd',
        minWidth: 100,
        align: 'center',
        sortable: true
      },
      {
        header: '프랜차이즈',
        name: 'bpNm',
        minWidth: 270
      },
      {
        header: '표시여부',
        name: 'displayAt',
        minWidth: 100,
        sortable: true,
        copyOptions: {
          useListItemText: true
        },
        formatter: 'listItemText',
        editor: {
          type: 'select',
          options: {
            listItems: YNList.value
          }
        }
      },
      {
        header: '표시순서',
        name: 'displayOrd',
        editor: 'text',
        minWidth: 100,
        align: 'right',
        sortable: true
      },
      {
        header: '사용여부 *',
        name: 'useAt',
        minWidth: 100,
        sortable: true,
        copyOptions: {
          useListItemText: true
        },
        formatter: 'listItemText',
        editor: {
          type: 'select',
          options: {
            listItems: useAtList.value
          }
        }
      }
    ],
    data: []
  })


  // 현재 메뉴에 대한 권한
  let menu = null;
  const menuauth = ref({
    regPermAt: '', // 등록권한
    modPermAt: '', // 수정권한
    delPermAt: '', // 삭제권한
    execPermAt: '', // 실행권한
  });

  // 권한 가져오기
  function selectMenuAuth() {
    menu = userStore.MenuAuthority;
    menu = menu.filter( menu => menu.menuNm === '브랜드정보관리' );

    menuauth.value.regPermAt = menu[0].regPermAt;
    menuauth.value.modPermAt = menu[0].modPermAt;
    menuauth.value.delPermAt = menu[0].delPermAt;
    menuauth.value.execPermAt = menu[0].execPermAt;
  }

  function selectBoxData() {
    let C03Data = ( userStore.commomCode ).filter( code => code.cgId === 'C03');
    for( let i = 0; i<C03Data.length; i++ ) {
      let value = { 'text': C03Data[i].cdNm, 'value' : C03Data[i].cd }
      useAtList.value.push( value )
    }

    let C02Data = ( userStore.commomCode ).filter( code => code.cgId === 'C02');
    for( let i = 0; i<C02Data.length; i++ ) {
      let value = { 'text': C02Data[i].cdNm, 'value' : C02Data[i].cd }
      YNList.value.push( value )
    }
  }

  function loadData() {
    axios.post( '/api/v1/corporation/brand'
              , { brdNm : brandSearch.value, useAt: brandUseAt.value }
              , { headers : { Authorization : userStore.AccessToken } } )
    .then( res => {
      if ( res.data.code == 0 ) {
        if ( res.data.count > 0 ) {
          brandInstance.resetData( res.data.result );
        } else if ( res.data.count < 1 ) {
          brandInstance.resetData( [] );
        }

        dataTotalCount.value = res.data.count;
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

  function bizPartvalue( e ) {
    bizPartDialogAt.value = false;

    if( e != null ) {
      brandInstance.setValue( brandClickRow, 'bpCd', e.bpCd );
      brandInstance.setValue( brandClickRow, 'bpNm', e.bpNm );
    }

  }

  function brandRowAdd() {
    let rowData = {
      brdCd: '',
      brdNm: '',
      brdShortNm: '',
      bpCd: '',
      bpNm: '',
      displayAt: 'Y',
      displayOrd: '9999',
      useAt: 'Y'
    }

    let row = brandInstance.getRowCount();

    brandInstance.appendRow( rowData, {
      at: row,
      focus: true
    });

    brandInstance.enableCell( row, 'brdCd');
    brandInstance.disableCell( row, 'useAt' );
  }

  function brandReg() {
    let createdRows = brandInstance.getModifiedRows().createdRows;

    if( createdRows.length < 1 ) {
      Notify.create({
        type: 'negative',
        message: '추가된 데이터가 없습니다.',
        timeout: 600
      })
    } else {
      for( let i = 0; i<createdRows.length; i++ ) {
        axios.post( '/api/v1/corporation/brand/registration'
                  , createdRows[i]
                  , { headers : { Authorization : userStore.AccessToken } } )
        .then( res => {
          if( res.data.code == 0 ) {
            Notify.create({
              type: 'positive',
              message: '브랜드가 추가되었습니다.',
              timeout: 600
            })

            loadData()
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
    }
  }

  function brandMod() {
    let updatedRows = brandInstance.getModifiedRows().updatedRows;

    if( updatedRows.length < 1 ) {
      Notify.create({
        type: 'negative',
        message: '수정된 데이터가 없습니다.',
        timeout: 600
      })
    } else {
      for( let i = 0; i<updatedRows.length; i++ ) {
        axios.post( '/api/v1/corporation/brand/modify'
                  , updatedRows[i]
                  , { headers : { Authorization : userStore.AccessToken } } )
        .then( res => {
          if( res.data.code == 0 ) {
            Notify.create({
              type: 'positive',
              message: '브랜드 정보가 수정되었습니다.',
              timeout: 600
            })

            loadData
          } else if ( res.data.code < 0 ) {
            Notify.create({
              type: 'negative',
              message: resizeBy.data.message,
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
  }

  onMounted( () => {
    selectMenuAuth()
    selectBoxData()
    loadData()

    brandGrid = brandTable.value;
    brandInstance = brandGrid.gridInstance;

    brandGrid.applyTheme( "clean", {
      cell: {
        header: {
          background: '#dee7f7'
        },
      }
    });
    brandGrid.setLanguage('ko', {
      display: {
        noData: '데이터가 없습니다.',
        loadingData: '데이터가 로딩중입니다.'
      }
    });
    brandInstance.setBodyHeight(600);
    brandInstance.disableColumn( 'brdCd' );

    brandInstance.on( 'dblclick', ( ev ) => {
      if( ev.columnName == 'bpCd') {
        bizPartDialogAt.value = true;
        brandClickRow = ev.rowKey;
      }
    })
  })
</script>
