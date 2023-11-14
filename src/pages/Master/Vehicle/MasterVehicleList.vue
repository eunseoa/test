<template>
  <q-card class="my-card shadow-3" style="height: 560px;">
    <q-card-section>
      <div class="row">
        <div class="col-lg-12 q-gutter-sm">
          <q-btn
            label="등록"
            padding="6px 35px"
            style="background-color: #253abb; color: #ffffff"
            @click="vehicleRowAdd"
          />

          <q-btn
            label="저장"
            padding="6px 35px"
            style="background-color: #253abb; color: #ffffff"
            @click="vehicleReg"
          />

          <q-btn
            label="수정"
            padding="6px 35px"
            style="background-color: #7483e3; color: #ffffff"
            @click="vehicleMod"
          />

          <q-btn
            label="삭제"
            padding="6px 35px"
            color="red-9"
            @click="vehicleDisable"
          />

          <q-btn
            label="영구삭제"
            padding="6px 35px"
            color="red-9"
            @click="vehicleRemove"
          />
        </div>
      </div>
    </q-card-section>

    <div>
      <TuiGrid
        ref="vehicleTable"
        :options="vehicleOptions.options"
        :columns="vehicleOptions.columns"
        :data="vehicleOptions.data"
      />
    </div>
  </q-card>
</template>

<script setup>
  import { useUserStore } from 'src/stores/example-store';
  import { ref, onMounted, watch } from 'vue';
  import { Notify, Dialog } from 'quasar';
  import { TuiGrid } from "vue3-tui-grid";
  import axios from 'axios';

  const userStore = useUserStore();

  const props = defineProps([
    'searchvalue',
    'logislist'
  ])

  const logisList = ref([]);
  const employeeList = ref([]);
  const gridEmployeeList = ref([]);
  const runAtList = ref([]);
  const dv1stDivList = ref([]);
  const dv12ndDivList = ref([]);
  const dbTypeList = ref([]);
  const useAtList = ref([ ])
  const clickRow = ref(null);

  const vehicleTable = ref('');
  let vehicleGrid = null;
  let vehicleInstance = null;
  const vehicleOptions = ref({
    options: {
      header: {
        height: 70,
        complexColumns: [
          {
            header: '배송차량',
            name: 'dvInfo',
            childNames: [ 'dvCd', 'dvNm', 'dvShortNm', 'dvNum' ]
          },
          {
            header: '운전자',
            name: 'driver',
            childNames: [ 'empNo', 'dvDriver', 'dvDriverMobile' ]
          }
        ]
      }
    },
    columns: [
      {
        header: '코드',
        name: 'dvCd',
        minWidth: 100,
        align: 'center',
        sortable: true
      },
      {
        header: '차량명 *',
        name: 'dvNm',
        minWidth: 180,
        editor: 'text',
        sortable: true,
        onAfterChange( ev ) {
          dvNmSeetting( ev )
        }
      },
      {
        header: '약식명',
        name: 'dvShortNm',
        minWidth: 180,
        editor: 'text',
        sortable: true
      },
      {
        header: '차량번호',
        name: 'dvNum',
        minWidth: 180,
        editor: 'text',
        sortable: true
      },
      {
        header: '물류센터',
        name: 'lcCd',
        minWidth: 150,
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
        header: '사번',
        name: 'empNo',
        minWidth: 100,
        align: 'center',
        sortable: true,
        copyOptions: {
          useListItemText: true
        },
        formatter: 'listItemText',
        editor: {
          type: 'select',
          options: {
            listItems: gridEmployeeList.value
          }
        },
        onAfterChange( ev ) {
          empSetting( ev )
        }
      },
      {
        header: '이름',
        name: 'dvDriver',
        minWidth: 120,
        editor: 'text',
        sortable: true
      },
      {
        header: '연락처',
        name: 'dvDriverMobile',
        minWidth: 120,
        editor: 'text',
        align: 'center',
        sortable: true
      },
      {
        header: '종류',
        name: 'dvType',
        minWidth: 100,
        editor: 'text',
        sortable: true,
        copyOptions: {
          useListItemText: true
        },
        formatter: 'listItemText',
        editor: {
          type: 'select',
          options: {
            listItems: dbTypeList.value
          }
        },
      },
      {
        header: '대분류',
        name: 'dv1stDiv',
        minWidth: 100,
        editor: 'text',
        sortable: true,
        copyOptions: {
          useListItemText: true
        },
        formatter: 'listItemText',
        editor: {
          type: 'select',
          options: {
            listItems: dv1stDivList.value
          }
        },
      },
      {
        header: '소분류',
        name: 'dv2ndDiv',
        minWidth: 100,
        editor: 'text',
        sortable: true,
        copyOptions: {
          useListItemText: true
        },
        formatter: 'listItemText',
        editor: {
          type: 'select',
          options: {
            listItems: dv12ndDivList.value
          }
        },
      },
      {
        header: '운행여부 *',
        name: 'runAt',
        minWidth: 100,
        editor: 'text',
        sortable: true,
        copyOptions: {
          useListItemText: true
        },
        formatter: 'listItemText',
        editor: {
          type: 'select',
          options: {
            listItems: runAtList.value
          }
        },
      },
      {
        header: '사용여부',
        name: 'useAt',
        minWidth: 100,
        editor: 'text',
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
        },
      },
      {
        header: '정렬순서',
        name: 'displayOrd',
        minWidth: 150,
        editor: 'text',
        align: 'right',
        sortable: true
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
    menu = menu.filter( menu => menu.menuNm === '배송차량정보관리' );

    menuauth.value.regPermAt = menu[0].regPermAt;
    menuauth.value.modPermAt = menu[0].modPermAt;
    menuauth.value.delPermAt = menu[0].delPermAt;
    menuauth.value.execPermAt = menu[0].execPermAt;
  }

  function selectBoxData() {
    axios.post( '/api/v1/corporation/employee'
              , {}
              , { headers : { Authorization : userStore.AccessToken } } )
    .then( res => {
      if( res.data.code == 0 ) {
        employeeList.value = res.data.result;

        for( let i = 0; i<res.data.result.length; i++ ) {
          let value = { 'text': res.data.result[i].empNo, 'value' : res.data.result[i].empNo }
          gridEmployeeList.value.push( value )
        }
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

    let C04Data = ( userStore.commomCode ).filter( code => code.cgId === 'C04' );
    for( let i = 0; i<C04Data.length; i++ ) {
      let value = { 'text': C04Data[i].cdNm, 'value' : C04Data[i].cd }
      runAtList.value.push( value )
    }

    let G22Data = ( userStore.commomCode ).filter( code => code.cgId === 'G22' );
    for( let i = 0; i<G22Data.length; i++ ) {
      let value = { 'text': G22Data[i].cdNm, 'value' : G22Data[i].cd }
      dv1stDivList.value.push( value )
    }

    let G23Data = ( userStore.commomCode ).filter( code => code.cgId === 'G23' );
    for( let i = 0; i<G23Data.length; i++ ) {
      let value = { 'text': G23Data[i].cdNm, 'value' : G23Data[i].cd }
      dv12ndDivList.value.push( value )
    }

    let G21Data = ( userStore.commomCode ).filter( code => code.cgId === 'G21' );
    for( let i = 0; i<G21Data.length; i++ ) {
      let value = { 'text': G21Data[i].cdNm, 'value' : G21Data[i].cd }
      dbTypeList.value.push( value )
    }

    let C03Data = ( userStore.commomCode ).filter( code => code.cgId === 'C03');
    for( let i = 0; i<C03Data.length; i++ ) {
      let value = { 'text': C03Data[i].cdNm, 'value' : C03Data[i].cd }
      useAtList.value.push( value )
    }
  }

  function loadData( data ) {
    let params = {};

    if( data != null ) {

      params = {
        dvNm: data.vehicleSearch,
        lcCd: data.logisSearch,
        runAt: data.runAtSearch,
        useAt: data.useAtSearch,
        dvType: data.dbTypeSearch,
        dv1stDiv: data.dv1stDivSearch,
        dv2ndDiv: data.dv12ndDivSearch
      }
    }

    axios.post( '/api/v1/vehicle/'
              , params
              , { headers : { Authorization : userStore.AccessToken } } )
    .then( res => {
      if( res.data.code == 0 ) {
        if( res.data.count > 0 ) {
          vehicleInstance.resetData( res.data.result );
        } else if( res.data.count < 1 ) {
          vehicleInstance.resetData( [] );
        }
      } else if( res.data.code < 0 ) {
        Notify.create({
          type: 'negative',
          message: res.data.message,
          timeout: 600
        })
      }
    })
    .catch( error => {
      console.log(error)
      Notify.create({
        type: 'negative',
        message: 'API를 호출하는 도중 에러가 발생했습니다.',
        timeout: 600
      })
    })
  }

  function dvNmSeetting( ev ) {
    let data = vehicleInstance.getRow( ev.rowKey );

    if( data.dvShortNm == null
    || data.dvShortNm == '' ) {
      vehicleInstance.setValue( ev.rowKey, 'dvShortNm', ev.value );
    }

    if( data.dvNum == null
    || data.dvNum == '' ) {
      vehicleInstance.setValue( ev.rowKey, 'dvNum', ev.value );
    }
  }

  function empSetting( ev ) {
    let empData = ( employeeList.value ).filter( emp => emp.empNo === ev.value );

    vehicleInstance.setValue( ev.rowKey, 'dvDriver', empData[0].empNm );
    vehicleInstance.setValue( ev.rowKey, 'dvDriverMobile', empData[0].empMobile );
  }

  function vehicleRowAdd() {
    let rowData = {
      dvNm: '',
      dvShortNm: '',
      dvNum: '',
      lcCd: '',
      empNo: '',
      dvDriver: '',
      dvDriverMobile: '',
      dvType: '',
      dv1stDiv: '',
      dv2ndDiv: '',
      runAt: '',
      useAt: 'Y',
      displayOrd: ''
    }

    let row = vehicleInstance.getRowCount();

    vehicleInstance.appendRow( rowData, {
      at: row,
      focus: true
    });
  }

  function vehicleReg() {
    let createdRows = vehicleInstance.getModifiedRows().createdRows;

    if( createdRows.length < 1 ) {
      Notify.create({
        type: 'negative',
        message: '추가된 데이터가 없습니다.',
        timeout: 600,
        position: 'center'
      })
    } else {
      for( let i = 0; i<createdRows.length; i++ ) {
        axios.post( '/api/v1/vehicle/registration'
                  , createdRows[i]
                  , { headers : { Authorization : userStore.AccessToken } } )
        .then( res => {
          if( res.data.code == 0 ) {
            Notify.create({
              type: 'positive',
              message: '배송차량이 추가되었습니다.',
              timeout: 600,
              position: 'center'
            })

            setTimeout( () => {
              loadData()
            }, 1000 )
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

  function vehicleMod() {
    let updatedRows = vehicleInstance.getModifiedRows().updatedRows;

    if( updatedRows.length < 1 ) {
      Notify.create({
        type: 'negative',
        message: '수정된 데이터가 없습니다.',
        timeout: 600,
        position: 'center'
      })
    } else {
      for( let i = 0; i<updatedRows.length; i++ ) {
        let value = {
          dvCd: updatedRows[i].dvCd,
          dvNm: updatedRows[i].dvNm,
          dvShortNm: updatedRows[i].dvShortNm,
          dvNum: updatedRows[i].dvNum,
          lcCd: updatedRows[i].lcCd,
          empNo: updatedRows[i].empNo,
          dvDriver: updatedRows[i].dvDriver,
          dvDriverMobile: updatedRows[i].dvDriverMobile,
          dvType: updatedRows[i].dvType,
          dv1stDiv: updatedRows[i].dv1stDiv,
          dv2ndDiv: updatedRows[i].dv2ndDiv,
          runAt: updatedRows[i].runAt,
          useAt: updatedRows[i].useAt,
          displayOrd: updatedRows[i].displayOrd
        }

        axios.post( '/api/v1/vehicle/modify'
                  , value
                  , { headers : { Authorization : userStore.AccessToken } } )
        .then( res => {
          if( res.data.code == 0 ) {
            Notify.create({
              type: 'positive',
              message: '배송차량이 수정되었습니다.',
              timeout: 600,
              position: 'center'
            })

            setTimeout( () => {
              loadData()
            }, 1000 )
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

  function vehicleDisable() {
    if( clickRow.value == null ) {
      Notify.create({
        type: 'info',
        message: '선택된 배송차량이 없습니다.',
        timeout: 600,
        position: 'center'
      })
    } else {
      let dvCd = vehicleInstance.getValue( clickRow.value, 'dvCd');
      let dvNm = vehicleInstance.getValue( clickRow.value, 'dvNm');

      Dialog.create({
        title: '삭제',
        message: '[ ' + dvCd + ' ] ' + dvNm + '을 삭제 하시겠습니까?',
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
        axios.post( `/api/v1/vehicle/disable?dvCd=${dvCd}`
                  , {  }
                  , { headers : { Authorization : userStore.AccessToken } } )
        .then( res => {
          if( res.data.code == 0 ) {
            Notify.create({
              type: 'positive',
              message: '배송차량이 삭제되었습니다.',
              timeout: 600,
              position: 'center'
            })

            setTimeout( () => {
              loadData()
            }, 1000 )
          } else if ( res.data.code < 0 ) {
            Notify.create({
              type: 'negative',
              message: res.data.message,
              timeout: 600
            })
          }
        })
        .catch( res => {
          Notify.create({
            type: 'negative',
            message: 'API를 호출하는 도중 에러가 발생했습니다.',
            timeout: 600
          })
        })
      })
    }
  }

  function vehicleRemove() {
    if( clickRow.value == null ) {
      Notify.create({
        type: 'info',
        message: '선택된 배송차량이 없습니다.',
        timeout: 600,
        position: 'center'
      })
    } else {
      let dvCd = vehicleInstance.getValue( clickRow.value, 'dvCd');
      let dvNm = vehicleInstance.getValue( clickRow.value, 'dvNm');

      Dialog.create({
        title: '영구삭제',
        message: '[ ' + dvCd + ' ] ' + dvNm + '을 영구삭제 하시겠습니까?',
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
        axios.post( `/api/v1/vehicle/remove?dvCd=${dvCd}`
                  , {  }
                  , { headers : { Authorization : userStore.AccessToken } } )
        .then( res => {
          if( res.data.code == 0 ) {
            Notify.create({
              type: 'positive',
              message: '배송차량이 영구삭제되었습니다.',
              timeout: 600,
              position: 'center'
            })

            setTimeout( () => {
              loadData()
            }, 1000 )
          } else if ( res.data.code < 0 ) {
            Notify.create({
              type: 'negative',
              message: res.data.message,
              timeout: 600
            })
          }
        })
        .catch( res => {
          Notify.create({
            type: 'negative',
            message: 'API를 호출하는 도중 에러가 발생했습니다.',
            timeout: 600
          })
        })
      })
    }
  }

  watch( () => props.logislist, () => {
    for( let i = 0; i<props.logislist.length; i++ ) {
      let value = { 'text': props.logislist[i].lcNm, 'value' : props.logislist[i].lcCd }
      logisList.value.push( value )
    }
  })

  defineExpose({
    loadData
  });

  onMounted( () => {
    selectMenuAuth()
    selectBoxData()
    loadData()

    vehicleGrid = vehicleTable.value;
    vehicleInstance = vehicleGrid.gridInstance;

    vehicleGrid.applyTheme( "clean", {
      cell: {
        header: {
          background: '#dee7f7'
        },
      }
    });
    vehicleGrid.setLanguage('ko', {
      display: {
        noData: '데이터가 없습니다.',
        loadingData: '데이터가 로딩중입니다.'
      }
    });
    vehicleInstance.setBodyHeight(410);
    vehicleInstance.disableColumn( 'dvCd' );

    vehicleInstance.on( 'click', ( ev ) =>{
      if( ev.targetType == 'cell' ) {
        if( clickRow.value == ev.rowKey ) {
          vehicleInstance.removeRowClassName( ev.rowKey, 'row-click-yellow' );

          clickRow.value = null;
          return;
        }

        clickRow.value = ev.rowKey;

        for( let i = 0; i<vehicleInstance.getRowCount(); i++ ) {
          vehicleInstance.removeRowClassName( i, 'row-click-yellow' )
        }

        vehicleInstance.addRowClassName( ev.rowKey, 'row-click-yellow' );
      }
    })
  })
</script>
