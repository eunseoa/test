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
          <q-breadcrumbs-el label="사원정보" icon="badge" class="text-blue-10"/>
      </q-breadcrumbs>
    </div>

    <div class="row q-py-lg">
      <div class="text-h5 text-weight-bolder">
        <q-icon name="badge" />
        &nbsp;<span>사원정보</span>
      </div>
    </div>

    <div>
      <q-card class="my-card shadow-3" style="height: 800px;">
        <q-toolbar class="shadow-2" style="height: 50px;">
          <div class="text-h6 q-pa-md text-weight-bold">
            사원정보
          </div>

          <q-space></q-space>

          <q-btn
            v-if="menuauth.modPermAt == true"
            flat stretch
            icon="add"
            @click="empRowAdd"
          >
            <q-tooltip>
              등록
            </q-tooltip>
          </q-btn>

          <q-btn
            v-if="menuauth.modPermAt == true"
            flat stretch
            icon="edit"
            @click="empMod"
          >
            <q-tooltip>
              수정
            </q-tooltip>
          </q-btn>

          <q-btn
            v-if="menuauth.regPermAt == true"
            flat stretch
            icon="save"
            @click="empReg"
          >
            <q-tooltip>
              저장
            </q-tooltip>
          </q-btn>

          <q-btn
            v-if="menuauth.delPermAt == true"
            flat stretch
            icon="delete"
            @click="empDel"
          >
            <q-tooltip>
              삭제
            </q-tooltip>
          </q-btn>
        </q-toolbar>

        <q-separator />

        <q-card-section class="q-pb-none">
          <div class="row q-col-gutter-sm">
            <div class="col-lg-2">
              <q-input
                dense square outlined
                v-model="empSearch"
                placeholder="검색 코드 또는 명칭"
                @keyup.enter="loadData"
              />
            </div>
            <div class="col-lg-2">
              <LogisticsselectBox
                :value="logisSearch"
                @update-value="updateLcValue"
              />
            </div>

            <div class="col-lg-2">
              <OrganizationSelectBox
                :value="orgSearch"
                :lc-cd="logisSearch"
              />
            </div>

            <div class="col-lg-2">
              <q-select
                dense square outlined
                v-model="empUseAt"
                :options="useAtList"
                option-value="value"
                option-label="text"
                emit-value
                map-options
                clearable
                clear-icon="clear"
              >
                <template v-if="empUseAt == ''" v-slot:selected>
                  <div class="text-grey-6">사용여부</div>
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
            ref="empTable"
            :columns="empOptions.columns"
            :data="empOptions.data"
          />
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
  import { useUserStore } from 'src/stores/example-store';
  import { TuiGrid } from "vue3-tui-grid";
  import { useRouter } from 'vue-router';
  import { ref, onMounted } from 'vue';
  import { Notify, Dialog } from 'quasar';
  import axios from 'axios';

  import LogisticsselectBox from 'src/component/SelectBox/LogisticsselectBox.vue';
  import OrganizationSelectBox from 'src/component/SelectBox/OrganizationSelectBox.vue';

  const userStore = useUserStore();
  const router = useRouter();

  const empSearch = ref('');
  const logisSearch = ref('');
  const orgSearch = ref('');
  const empUseAt = ref('Y');
  const useAtList = ref([ ]);
  const logisList = ref([]);
  const orgList = ref([]);
  const gridOrgList = ref([]);
  const empLvlList = ref([]);
  const empRepList = ref([]);
  const empRoleList = ref([]);
  const clickRow = ref(null);
  const dataTotalCount = ref(0);

  let empGrid = null;
  let empInstance = null;
  const empTable = ref('');
  const empOptions = ref({
    columns: [
      {
        header: '물류센터',
        name: 'lcCd',
        minWidth: 140,
        sortable: true,
        copyOptions: {
          useListItemText: true
        },
        formatter: 'listItemText',
        editor: {
          type: 'select',
          options: {
            listItems: logisList.value
          }
        }
      },
      {
        header: '부서',
        name: 'orgCd',
        minWidth: 140,
        sortable: true,
        copyOptions: {
          useListItemText: true
        },
        formatter: 'listItemText',
        editor: {
          type: 'select',
          options: {
            listItems: gridOrgList.value
          }
        },
      },
      {
        header: '사번 *',
        name: 'empNo',
        editor: 'text',
        minWidth: 100,
        align: 'center',
        sortable: true
      },
      {
        header: '사원명 *',
        name: 'empNm',
        editor: 'text',
        minWidth: 140,
        sortable: true
      },
      {
        header: '직위',
        name: 'empLvl',
        minWidth: 100,
        sortable: true,
        copyOptions: {
          useListItemText: true
        },
        formatter: 'listItemText',
        editor: {
          type: 'select',
          options: {
            listItems: empLvlList.value
          }
        },
      },
      {
        header: '직책',
        name: 'empRep',
        minWidth: 100,
        sortable: true,
        copyOptions: {
          useListItemText: true
        },
        formatter: 'listItemText',
        editor: {
          type: 'select',
          options: {
            listItems: empRepList.value
          }
        },
      },
      {
        header: '직무',
        name: 'empRole',
        minWidth: 100,
        sortable: true,
        copyOptions: {
          useListItemText: true
        },
        formatter: 'listItemText',
        editor: {
          type: 'select',
          options: {
            listItems: empRoleList.value
          }
        },
      },
      {
        header: '핸드폰',
        name: 'empMobile',
        minWidth: 140,
        editor: 'text'
      },
      {
        header: '우편번호',
        name: 'postNo',
        minWidth: 100,
        align: 'center'
      },
      {
        header: '주소',
        name: 'empAddr',
        editor: 'text',
        minWidth: 300,
      },
      {
        header: '상세주소',
        name: 'addrDtl',
        editor: 'text',
        minWidth: 300,
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
          type: 'radio',
          options: {
            listItems: [
              { text: '예', value: 'Y' },
              { text: '아니오', value: 'N' }
            ]
          }
        }
      },
      {
        header: '사용여부',
        name: 'useAt',
        minWidth: 100,
        sortable: true,
        copyOptions: {
          useListItemText: true
        },
        formatter: 'listItemText',
        editor: {
          type: 'radio',
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
    menu = menu.filter( menu => menu.menuNm === '사원정보관리' );

    menuauth.value.regPermAt = menu[0].regPermAt;
    menuauth.value.modPermAt = menu[0].modPermAt;
    menuauth.value.delPermAt = menu[0].delPermAt;
    menuauth.value.execPermAt = menu[0].execPermAt;
  }

  function selectBoxData() {
    let empLvl = ( userStore.commomCode ).filter( code => code.cgId === 'G24' );
    for( let i = 0; i<empLvl.length; i++ ) {
      let value = { 'text': empLvl[i].cdNm, 'value' : empLvl[i].cd }
      empLvlList.value.push( value )
    }

    let empRep = ( userStore.commomCode ).filter( code => code.cgId === 'G25' );
    for( let i = 0; i<empRep.length; i++ ) {
      let value = { 'text': empRep[i].cdNm, 'value' : empRep[i].cd }
      empRepList.value.push( value )
    }

    let empRole = ( userStore.commomCode ).filter( code => code.cgId === 'G26' );
    for( let i = 0; i<empRole.length; i++ ) {
      let value = { 'text': empRole[i].cdNm, 'value' : empRole[i].cd }
      empRoleList.value.push( value )
    }

    let C03Data = ( userStore.commomCode ).filter( code => code.cgId === 'C03' );
    for( let i = 0; i<C03Data.length; i++ ) {
      let value = { 'text': C03Data[i].cdNm, 'value' : C03Data[i].cd }
      useAtList.value.push( value )
    }

    axios.post( '/api/v1/logisticscenter/'
              , {}
              , { headers : { Authorization : userStore.AccessToken } } )
    .then( res => {
      if ( res.data.code == 0 ) {
        for( let i = 0; i<res.data.result.length; i++ ) {
          let value = { 'text': res.data.result[i].lcNm, 'value' : res.data.result[i].lcCd }
          logisList.value.push( value )
        }
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

    axios.post( '/api/v1/logisticscenter/organization'
              , {}
              , { headers : { Authorization : userStore.AccessToken } } )
    .then( res => {
      if ( res.data.code == 0 ) {
        for( let i = 0; i<res.data.result.length; i++ ) {
          let value = { 'text': res.data.result[i].orgNm, 'value' : res.data.result[i].orgCd }
          gridOrgList.value.push( value )
        }
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

  function updateLcValue( e ) {
    logisSearch.value = e
  }

  function loadData() {
    axios.post( '/api/v1/corporation/employee'
              , { empNm: empSearch.value, lcCd: logisSearch.value, orgCd: orgSearch.value, useAt: empUseAt.value }
              , { headers : { Authorization : userStore.AccessToken } } )
    .then( res => {
      if ( res.data.code == 0 ) {
        if ( res.data.count > 0 ) {
          empInstance.resetData( res.data.result );
        } else if ( res.data.count < 1 ) {
          empInstance.resetData( [] );
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

        empInstance.setValue( rowKey, 'postNo', postCode );
        empInstance.setValue( rowKey, 'empAddr', address );
      },
    }).open({
        popupKey: 'popup1'
    })
  }

  function empRowAdd() {
    // 사번 자동 등록 여부
    let empKeygenUse = ( userStore.sysconfig ).filter( sys => sys.category === '일반' && sys.envKey === 'keygen-use-emp' )[0].envValue;

    axios.get( `/api/v1/sysconfig/?category=일반`, { headers : { Authorization : userStore.AccessToken } } )
    .then( res => {
      if( res.data.code == 0 ) {
        empKeygenUse = ( res.data.result ).filter( env => env.envKey === 'keygen-use-emp' )[0].envValue;
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

    let rowData = {
      lcCd: '',
      orgCd: '',
      empNo: '',
      empNm: '',
      empLvl: '',
      empRep: '',
      empRole: '',
      empMobile: '',
      postNo: '',
      empAddr: '',
      addrDtl: '',
      displayAt: 'Y',
      useAt: 'Y'
    }

    let row = empInstance.getRowCount();

    empInstance.appendRow( rowData, {
      at: row,
      focus: true
    })

    empInstance.enableCell( row, 'empNo' );
    empInstance.disableCell( row, 'useAt' );

    console.log(empKeygenUse)

    if ( empKeygenUse == 'Y' ) {
      empInstance.disableCell( row, 'empNo' );
    }
  }

  function empReg() {
    let createdRows = empInstance.getModifiedRows().createdRows;

    if( createdRows.length < 1 ) {
      Notify.create({
        type: 'info',
        message: '추가된 데이터가 없습니다.',
        timeout: 600
      })
    } else {
      for( let i = 0; i<createdRows.length; i++ ) {
        axios.post( '/api/v1/corporation/employee/registration'
                  , createdRows[i]
                  , { headers : { Authorization : userStore.AccessToken } } )
        .then( res => {
          if( res.data.code == 0 ) {
            Notify.create({
              type: 'positive',
              message: '사원 정보가 추가되었습니다.',
              timeout: 600,
              position: 'center'
            })

            loadData()
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

  function empMod() {
    let updatedRows = empInstance.getModifiedRows().updatedRows;

    if( updatedRows.length < 1 ) {
      Notify.create({
        type: 'info',
        message: '수정된 데이터가 없습니다.',
        timeout: 600
      })
    } else {
      for( let i = 0; i<updatedRows.length; i++ ) {
        axios.post( '/api/v1/corporation/employee/modify'
                  , updatedRows[i]
                  , { headers : { Authorization : userStore.AccessToken } } )
        .then( res => {
          if( res.data.code == 0 ) {
            Notify.create({
              type: 'positive',
              message: '사원 정보가 수정되었습니다.',
              timeout: 600,
              position: 'center'
            })

            loadData()
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

  function empDel() {
    if( clickRow.value == null ) {
      Notify.create({
        type: 'info',
        message: '삭제할 사원을 선택해주세요.',
        timeout: 600,
        position: 'center'
      })
    } else {
      let empNm = empInstance.getValue( clickRow.value, 'empNm' );
      let empNo = empInstance.getValue( clickRow.value, 'empNo' );

      Dialog.create({
        title: '사원 삭제',
        message: '[ ' + empNm + ' ] 사원을 삭제하시겠습니까?',
        ok: {
            push: true,
            label: '삭제',
            color: 'accent'
        },
        cancel: {
        push: true,
        label: '취소',
        },
        persistent: true
      }).onOk(() => {
        axios.post( '/api/v1/corporation/employee/remove'
                , { empNo: empNo }
                , { headers : { Authorization : userStore.AccessToken } } )
        .then( res => {
          if( res.data.code == 0 ) {
            Notify.create({
              type: 'positive',
              message: '사원이 삭제되었습니다.',
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
            timeout: 600,
            position: 'center'
          })
        })
      })
    }
  }

  onMounted( () => {
    selectMenuAuth()
    selectBoxData()
    loadData()

    empGrid = empTable.value;
    empInstance = empGrid.gridInstance;

    empGrid.applyTheme( "clean", {
      cell: {
        header: {
          background: '#dee7f7'
        },
      }
    });
    empGrid.setLanguage('ko', {
      display: {
        noData: '데이터가 없습니다.',
        loadingData: '데이터가 로딩중입니다.'
      }
    });
    empInstance.setBodyHeight(600);
    empInstance.disableColumn( 'empNo' );

    empInstance.on( 'dblclick', ( ev ) => {
      if( ev.columnName == 'postNo') {
        postCode( ev.rowKey )
      }
    })

    empInstance.on( 'click', ( ev ) => {
      if ( ev.targetType == 'cell' ) {
        if( clickRow.value == ev.rowKey ) {
          empInstance.removeRowClassName( ev.rowKey, 'row-click-yellow' );
          clickRow.value = null;
          return;
        }

        clickRow.value = ev.rowKey;

        for( let i = 0; i<empInstance.getRowCount(); i++ ) {
          empInstance.removeRowClassName( i, 'row-click-yellow' )
        }

        empInstance.addRowClassName( ev.rowKey, 'row-click-yellow' );
      }
    })
  })
</script>
