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
          <q-breadcrumbs-el label="물류센터정보" icon="pallet" class="text-blue-10"/>
      </q-breadcrumbs>
    </div>

    <div class="row q-py-lg">
      <div class="text-h5 text-weight-bolder">
        <q-icon name="pallet" />
        &nbsp;<span>물류센터정보</span>
      </div>
    </div>

    <div>
      <q-card class="my-card shadow-3" style="height: 800px;">
        <q-toolbar class="shadow-2" style="height: 50px;">
          <div class="text-h6 q-pa-md text-weight-bold">
            물류센터정보
          </div>

          <q-space></q-space>

          <q-btn
            v-if="menuauth.modPermAt == true"
            flat stretch
            icon="add"
            @click="logisRowAdd"
          >
            <q-tooltip>
              등록
            </q-tooltip>
          </q-btn>

          <q-btn
            v-if="menuauth.modPermAt == true"
            flat stretch
            icon="edit"
            @click="logisMod"
          >
            <q-tooltip>
              수정
            </q-tooltip>
          </q-btn>

          <q-btn
            v-if="menuauth.regPermAt == true"
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

        <q-card-section class="q-pb-none">
          <div class="row q-col-gutter-sm">
            <div class="col-lg-2">
              <q-input
                dense square outlined
                v-model="logisSearch"
                placeholder="검색 코드 또는 명칭"
                @keyup.enter="logisData"
              />
            </div>
            <div class="col-lg-2">
              <q-select
                dense square outlined
                v-model="logisUseAt"
                :options="useAtList"
                option-label="text"
                option-value="value"
                emit-value
                map-options
                clearable
                clear-icon="close"
              >
                <template v-if="logisUseAt == '' || logisUseAt == null" v-slot:selected>
                  <div class="text-grey-6">사용여부</div>
                </template>
              </q-select>
            </div>

            <div class="col-lg-1">
              <q-btn
                label="조회"
                color="indigo-7"
                @click="logisData"
              />
            </div>
          </div>
        </q-card-section>

        <div class="q-pb-sm q-pr-sm" align="right">
          총 데이터 : {{ dataTotalCount }} 개
        </div>

        <div>
          <TuiGrid
            ref="logisTable"
            :columns="logisOptions.columns"
            :data="logisOptions.data"
          />
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
  import { useUserStore } from 'src/stores/example-store';
  import { TuiGrid } from "vue3-tui-grid";
  import { ref, onMounted } from 'vue';
  import { Notify } from 'quasar';
  import axios from 'axios';

  const userStore = useUserStore();

  const corpList = ref([]);
  const logisSearch = ref('');
  const logisUseAt = ref('Y');
  const useAtList = ref([]);
  const dataTotalCount = ref('');

  let logisGrid = null;
  let logisInstance = null;
  const logisTable = ref('');
  const logisOptions = ref({
    columns: [
      {
        header: '코드 *',
        name: 'lcCd',
        editor: 'text',
        minWidth: 80,
        align: 'center',
        sortable: true
      },
      {
        header: '물류센터명 *',
        name: 'lcNm',
        editor: 'text',
        minWidth: 160,
        sortable: true
      },
      {
        header: '약식명',
        name: 'lcShortNm',
        editor: 'text',
        minWidth: 160,
        sortable: true
      },
      {
        header: '회사',
        name: 'corpId',
        minWidth: 160,
        sortable: true,
        copyOptions: {
          useListItemText: true
        },
        formatter: 'listItemText',
        editor: {
          type: 'select',
          options: {
            listItems: corpList.value
          }
        },
      },
      {
        header: '우편번호',
        name: 'postNo',
        minWidth: 100,
        align: 'center'
      },
      {
        header: '주소',
        name: 'lcAddr',
        minWidth: 500
      },
      {
        header: '상세주소',
        name: 'lcAddrDtl',
        editor: 'text',
        minWidth: 300
      },
      {
        header: '대표자',
        name: 'ceoNm',
        editor: 'text',
        minWidth: 120,
        sortable: true
      },
      {
        header: '사업자번호',
        name: 'bizRegNo',
        editor: 'text',
        minWidth: 160,
        align: 'center',
        sortable: true
      },
      {
        header: '업태',
        name: 'bizType',
        editor: 'text',
        minWidth: 120,
        sortable: true
      },
      {
        header: '종목',
        name: 'bizItem',
        editor: 'text',
        minWidth: 120,
        sortable: true
      },
      {
        header: '메일',
        name: 'lcEmail',
        editor: 'text',
        minWidth: 160
      },
      {
        header: '전화번호',
        name: 'lcTelNo',
        editor: 'text',
        minWidth: 160,
        align: 'center'
      },
      {
        header: '팩스번호',
        name: 'lcFaxNo',
        editor: 'text',
        minWidth: 160,
        align: 'center'
      },
      {
        header: '표시여부',
        name: 'displayAt',
        minWidth: 100,
        sortable: true,
        formatter: 'listItemText',
        editor: {
          type: 'radio',
          options: {
            listItems: useAtList.value
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
    menu = menu.filter( menu => menu.menuNm === '물류센터정보관리' );

    menuauth.value.regPermAt = menu[0].regPermAt;
    menuauth.value.modPermAt = menu[0].modPermAt;
    menuauth.value.delPermAt = menu[0].delPermAt;
    menuauth.value.execPermAt = menu[0].execPermAt;
  }

  async function selectBoxData() {
    await axios.post( '/api/v1/corporation/'
              , {}
              , { headers : { Authorization : userStore.AccessToken } } )
    .then( res => {
      if( res.data.code == 0 ) {
        for( let i = 0; i<res.data.count; i++ ) {
          let value = { 'text': res.data.result[i].corpNm, 'value' : res.data.result[i].corpId }
          corpList.value.push( value )
        }
      } else if ( res.data.code < 0 ) {
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

    let C03Data = ( userStore.commomCode ).filter( code => code.cgId === 'C03');
    for( let i = 0; i<C03Data.length; i++ ) {
      let value = { 'text': C03Data[i].cdNm, 'value' : C03Data[i].cd }
      useAtList.value.push( value )
    }
  }

  function logisData() {
    axios.post( '/api/v1/logisticscenter/'
              , { 'lcNm': logisSearch.value, 'useAt': logisUseAt.value }
              , { headers : { Authorization : userStore.AccessToken } } )
    .then( res => {
      if( res.data.code == 0 ) {
        if( res.data.count > 0 ) {
          logisInstance.resetData( res.data.result );
        } else if ( res.data.count == 0 ) {
          logisInstance.resetData( [] )
        }

        dataTotalCount.value = res.data.count;
      } else if ( res.data.code < 0 ) {
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

  function postCode( rowKey ) {
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

        logisInstance.setValue( rowKey, 'postNo', postCode );
        logisInstance.setValue( rowKey, 'lcAddr', address );
      },
    }).open({
        popupKey: 'popup1'
    })
  }

  function logisRowAdd() {
    let rowData = {
      lcCd: '',
      lcNm: '',
      lcShortNm: '',
      corpId: '',
      postNo: '',
      lcAddr: '',
      lcAddrDtl: '',
      ceoNm: '',
      bizRegNo: '',
      bizType: '',
      bizItem: '',
      lcEmail: '',
      lcTelNo: '',
      lcFaxNo: '',
      displayAt: 'Y',
      displayOrd: '',
      useAt: 'Y'
    }

    let row = logisInstance.getRowCount();

    logisInstance.appendRow( rowData, {
      at: row,
      focus: true
    });

    logisInstance.enableCell( row, 'lcCd' );
    logisInstance.disableCell( row, 'useAt' );
  }

  function logisReg() {
    let createdRows = logisInstance.getModifiedRows().createdRows;

    if( createdRows.length < 1 ) {
      Notify.create({
        type: 'info',
        message: '추가된 데이터가 없습니다.',
        timeout: 600,
          position: 'center'
      })
    } else {
      for( let i = 0; i<createdRows.length; i++ ) {
        axios.post( '/api/v1/logisticscenter/registration'
                  , createdRows[i]
                  , { headers : { Authorization : userStore.AccessToken } } )
        .then( res => {
          if( res.data.code == 0 ) {
            Notify.create({
              type: 'positive',
              message: '물류센터가 추가되었습니다.',
              timeout: 600,
              position: 'center'
            })

            logisData()
          } else if ( res.data.code < 0 ) {
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
    }
  }

  function logisMod() {
    let updatedRows = logisInstance.getModifiedRows().updatedRows;

    if( updatedRows.length < 1 ) {
      Notify.create({
        type: 'info',
        message: '수정된 데이터가 없습니다.',
        timeout: 600,
          position: 'center'
      })
    } else {
      for( let i = 0; i<updatedRows.length; i++ ) {
        axios.post( '/api/v1/logisticscenter/modify'
                  , updatedRows[i]
                  , { headers : { Authorization : userStore.AccessToken } } )
        .then( res => {
          if( res.data.code == 0 ) {
            Notify.create({
              type: 'positive',
              message: '물류센터정보가 수정되었습니다.',
              timeout: 600,
              position: 'center'
            })

            logisData
          } else if ( res.data.code < 0 ) {
            Notify.create({
              type: 'negative',
              message: resizeBy.data.message,
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
    }
  }

  onMounted( () => {
    selectBoxData()
    selectMenuAuth()
    logisData()

    logisGrid = logisTable.value;
    logisInstance = logisGrid.gridInstance;

    logisGrid.applyTheme( "clean", {
      cell: {
        header: {
          background: '#dee7f7'
        },
      }
    });
    logisGrid.setLanguage('ko', {
      display: {
        noData: '데이터가 없습니다.',
        loadingData: '데이터가 로딩중입니다.'
      }
    });
    logisInstance.setBodyHeight(610);
    logisInstance.disableColumn( 'lcCd' );

    logisInstance.on( 'dblclick', ( ev ) => {
      if( ev.columnName == 'postNo') {
        postCode( ev.rowKey )
      }
    })
  })
</script>
