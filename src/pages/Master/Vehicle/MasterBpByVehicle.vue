<template>
  <div class="row q-col-gutter-sm">
    <div class="col-lg-4">
      <q-card class="my-card shadow-3" style="height: 580px;">
        <q-toolbar class="shadow-2" style="height: 50px;">
          <div class="text-h6 q-pa-md text-weight-bold">
            배송차량
          </div>
        </q-toolbar>

        <div>
          <TuiGrid
            ref="vehicleTable"
            :columns="vehicleOptions.columns"
            :data="vehicleOptions.data"
          />
        </div>
        <q-separator />
      </q-card>
    </div>

    <div class="col-lg-4">
      <q-card class="my-card shadow-3" style="height: 580px;">
        <q-toolbar class="shadow-2" style="height: 50px;">
          <div class="text-h6 q-pa-md text-weight-bold">
            배송 납품처 ( 총 {{ partnerTotalCount }}건 )
          </div>

          <q-space />

          <q-btn
            v-if="menuauth.modPermAt == true"
            flat stretch
            icon="search"
            @click="partnerData"
          >
            <q-tooltip>
              검색
            </q-tooltip>
          </q-btn>

          <q-btn
            v-if="menuauth.regPermAt == true"
            flat stretch
            icon="save"
            @click="partnerMod"
          >
            <q-tooltip>
              저장
            </q-tooltip>
          </q-btn>

          <q-btn
            v-if="menuauth.regPermAt == true"
            flat stretch
            icon="east"
            @click="partnerRemove( clickPartnerRow )"
          >
            <q-tooltip>
              삭제
            </q-tooltip>
          </q-btn>
        </q-toolbar>

        <q-separator />

        <q-card-section class="q-pa-sm">
          <div class="row">
            <div class="col-lg-5">
              <q-select
                dense square outlined
                v-model="ptBrandSearch"
                :options="brandList"
                option-value="brdCd"
                option-label="brdNm"
                emit-value
                map-options
              >
                <template v-if="ptBrandSearch" v-slot:append>
                  <q-icon name="cancel" @click.stop.prevent="ptBrandSearch = ''" class="cursor-pointer"></q-icon>
                </template>
                <template v-if="ptBrandSearch == ''" v-slot:selected>
                  <div class="text-grey-6">브랜드 선택</div>
                </template>
              </q-select>
            </div>
          </div>
        </q-card-section>

        <div>
          <TuiGrid
            ref="partnerTable"
            :options="partnerOptions.options"
            :columns="partnerOptions.columns"
            :data="partnerOptions.data"
          />
        </div>
      </q-card>
    </div>

    <div class="col-lg-4">
      <q-card class="my-card shadow-3" style="height: 580px;">
        <q-toolbar class="shadow-2" style="height: 50px;">
          <div class="text-h6 q-pa-md text-weight-bold">
            미배송 납품처 ( 총 {{ ptOthersTotalCount }}건 )
          </div>

          <q-space />

          <q-btn
            v-if="menuauth.modPermAt == true"
            flat stretch
            icon="search"
            @click="ptOthersData"
          >
            <q-tooltip>
              검색
            </q-tooltip>
          </q-btn>

          <q-btn
            v-if="menuauth.modPermAt == true"
            flat stretch
            icon="keyboard_backspace"
            @click="partnerAppend( clickPtOthersRow )"
          >
            <q-tooltip>
              추가
            </q-tooltip>
          </q-btn>
        </q-toolbar>

        <q-separator />

        <q-card-section class="q-pa-sm">
          <div class="row q-col-gutter-sm">
            <div class="col-lg-4">
              <q-select
                dense square outlined
                v-model="ptOthBrandSearch"
                :options="brandList"
                option-value="brdCd"
                option-label="brdNm"
                emit-value
                map-options
              >
                <template v-if="ptOthBrandSearch" v-slot:append>
                  <q-icon name="cancel" @click.stop.prevent="ptOthBrandSearch = ''" class="cursor-pointer"></q-icon>
                </template>
                <template v-if="ptOthBrandSearch == ''" v-slot:selected>
                  <div class="text-grey-6">브랜드 선택</div>
                </template>
              </q-select>
            </div>

            <div class="col-lg-4">
              <q-select
                dense square outlined
                v-model="ptOthVehicleSearch"
                :options="vehicleList"
                option-value="dvCd"
                option-label="dvShortNm"
                emit-value
                map-options
              >
                <template v-if="ptOthVehicleSearch" v-slot:append>
                  <q-icon name="cancel" @click.stop.prevent="ptOthVehicleSearch = ''" class="cursor-pointer"></q-icon>
                </template>
                <template v-if="ptOthVehicleSearch == ''" v-slot:selected>
                  <div class="text-grey-6">배송차량 선택</div>
                </template>
              </q-select>
            </div>

            <div class="col-lg-4">
              <q-input
                dense square outlined
                v-model="ptOtherSearch"
                @keyup.enter="ptOthersData"
                placeholder="납품처 또는 코드"
              />
            </div>
          </div>
        </q-card-section>

        <div>
          <TuiGrid
            ref="ptOthersTable"
            :options="ptOthersOptions.options"
            :columns="ptOthersOptions.columns"
            :data="ptOthersOptions.data"
          />
        </div>

        <div class="flex flex-center">
          <q-pagination
            v-model="clickPage"
            :max="pageSize"
            input
            color="indigo-8"
            @update:model-value="ptOthersData"
          />
        </div>
      </q-card>
    </div>
  </div>
</template>

<script setup>
  import { useUserStore } from 'src/stores/example-store';
  import { Notify, Dialog } from 'quasar';
  import { TuiGrid } from "vue3-tui-grid";
  import { useRouter } from 'vue-router';
  import { ref, onMounted } from 'vue';
  import axios from 'axios';

  const userStore = useUserStore();
  const router = useRouter();

  const brandList = ref([]);
  const vehicleList = ref([]);
  const ptBrandSearch = ref('');
  const ptOthBrandSearch = ref('');
  const ptOthVehicleSearch = ref('');
  const ptOtherSearch = ref('');
  const clickPage = ref(1);
  const pageSize = ref(0);
  const rowcountPerPage = ref(0);

  const vehicleTable = ref('');
  const partnerTable = ref('');
  const ptOthersTable = ref('');
  let vehicleGrid = null;
  let partnerGrid = null;
  let ptOthersGrid = null;
  let vehicleInstance = null;
  let partnerInstance = null;
  let ptOthersInstance = null;

  const vehicleOptions = ref({
    columns: [
      {
        header: '코드',
        name: 'dvCd',
        minWidth: 100,
        align: 'center'
      },
      {
        header: '차량명',
        name: 'dvShortNm',
        minWidth: 180
      },
      {
        header: '운전자',
        name: 'dvDriver',
        minWidth: 100
      },
      {
        header: '종류',
        name: 'dvTypeNm',
        minWidth: 100
      },
      {
        header: '대분류',
        name: 'dv1stDivNm',
        minWidth: 100
      },
      {
        header: '운행여부',
        name: 'runAtNm',
        minWidth: 80
      }
    ],
    data: []
  })
  const partnerOptions = ref({
    options: {
      contextMenu: ( { rowKey } ) => (
        [
          [
            {
              name: 'menu1',
              label: '저장',
              action: () => {
                partnerMod()
              }
            },
            {
              name: 'menu2',
              label: '삭제',
              action: () => {
                partnerRemove( rowKey )
              }
            },
            {
              name: 'menu3',
              label: '지도보기',
              action: () => {
                goBizPartnerMaps( 'partner', rowKey )
              }
            },
            {
              name: 'menu4',
              label: '납품처 등록정보',
              action: () => {
                goBizPartnerInfo( 'partner', rowKey )
              }
            },
            {
              name: 'menu5',
              label: '새로고침',
              action: () => {
              }
            }
          ]
        ]
      ),
    },
    columns: [
      {
        header: '코드',
        name: 'bpCd',
        minWidth: 100,
        align: 'center'
      },
      {
        header: '납품처',
        name: 'bpShortNm',
        minWidth: 180
      },
      {
        header: '브랜드',
        name: 'brdNm',
        minWidth: 200
      },
      {
        header: '순번',
        name: 'dlvOrd',
        minWidth: 100,
        align: 'right',
        editor: 'text'
      },
      {
        header: '거래상태',
        name: 'transactionStatusNm',
        minWidth: 100
      }
    ],
    data: []
  })
  const ptOthersOptions = ref({
    options: {
      contextMenu: ( { rowKey } ) => (
        [
          [
            {
              name: 'menu1',
              label: '추가',
              action: () => {
                partnerAppend( rowKey )
              }
            },
            {
              name: 'menu2',
              label: '지도보기',
              action: () => {
                goBizPartnerMaps( 'others', rowKey )
              }
            },
            {
              name: 'menu3',
              label: '납품처 등록정보',
              action: () => {
                goBizPartnerInfo( 'others', rowKey )
              }
            },
            {
              name: 'menu4',
              label: '새로고침',
              action: () => {
              }
            }
          ]
        ]
      )
    },
    columns: [
      {
        header: '코드',
        name: 'bpCd',
        minWidth: 100,
        align: 'center'
      },
      {
        header: '납품처',
        name: 'bpShortNm',
        minWidth: 180
      },
      {
        header: '브랜드',
        name: 'brdNm',
        minWidth: 200
      },
      {
        header: '거래상태',
        name: 'transactionStatusNm',
        minWidth: 100
      },
      {
        header: '배송차량',
        name: 'dvNm',
        minWidth: 180
      }
    ],
    data: []
  })

  const partnerTotalCount = ref(0);
  const ptOthersTotalCount = ref(0);

  const clickVehicleRow = ref(null);
  const clickPartnerRow = ref(null);
  const clickPtOthersRow = ref(null);

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
    axios.post( '/api/v1/corporation/brand'
              , {}
              , { headers : { Authorization : userStore.AccessToken } } )
    .then( res => {
      if( res.data.code == 0 ) {
        brandList.value = res.data.result;
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

    // rowcountPerPage.value = ( ( data.value ).filter( data => data.envKey === 'rowcount-per-page' ) )[0];
  }

  function vehicleData( data ) {
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

    axios.post( `/api/v1/vehicle/findSimpleList`
              , params
              , { headers : { Authorization : userStore.AccessToken } } )
    .then( res => {
      if( res.data.code == 0 ) {
        vehicleList.value = res.data.result;
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
      Notify.create({
        type: 'negative',
        message: 'API를 호출하는 도중 에러가 발생했습니다.',
        timeout: 600
      })
    })
  }

  function partnerData() {
    let dvCd = vehicleInstance.getValue( clickVehicleRow.value, 'dvCd' )

    axios.get( `/api/v1/vehicle/partner/${dvCd}?brdCd=${ptBrandSearch.value}`
            , { headers : { Authorization : userStore.AccessToken } } )
    .then( res => {
      if( res.data.code == 0 ) {
        if( res.data.count > 0 ) {
          partnerInstance.resetData( res.data.result );
        } else if( res.data.count < 1 ) {
          partnerInstance.resetData( [] );
        }

        partnerTotalCount.value = res.data.count;
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

  function ptOthersData() {
    let dvCd = vehicleInstance.getValue( clickVehicleRow.value, 'dvCd' )
    axios.get( `/api/v1/vehicle/partner/others/${dvCd}?brdCd=${ptOthBrandSearch.value}&searchDvCd=${ptOthVehicleSearch.value}&searchWord=${ptOtherSearch.value}&pageNumber=${clickPage.value}&rowCountPerPage=${rowcountPerPage.value}`
            , { headers : { Authorization : userStore.AccessToken } } )
    .then( res => {
      if( res.data.code == 0 ) {
        if( res.data.count > 0 ) {
          ptOthersInstance.resetData( res.data.result );
        } else if( res.data.count < 1 ) {
          ptOthersInstance.resetData( [] );
        }

        pageSize.value = res.data.pageSize;
        ptOthersTotalCount.value = res.data.totalCount;
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

  function vehicleGridOnMount() {
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
    vehicleInstance.setBodyHeight( 480 );

    vehicleInstance.on( 'click', ( ev ) =>{
      if( ev.targetType == 'cell' ) {
        if( clickVehicleRow.value == ev.rowKey ) {
          vehicleInstance.removeRowClassName( ev.rowKey, 'row-click-yellow' );

          clickVehicleRow.value = null;
          return;
        }

        clickVehicleRow.value = ev.rowKey;
        clickPartnerRow.value = null;
        clickPtOthersRow.value = null;

        for( let i = 0; i<vehicleInstance.getRowCount(); i++ ) {
          vehicleInstance.removeRowClassName( i, 'row-click-yellow' )
        }

        vehicleInstance.addRowClassName( ev.rowKey, 'row-click-yellow' );
        partnerData()
        ptOthersData()
      }
    })
  }

  function partnerGridOnMount() {
    partnerGrid = partnerTable.value;
    partnerInstance = partnerGrid.gridInstance;

    partnerGrid.applyTheme( "clean", {
      cell: {
        header: {
          background: '#dee7f7'
        },
      }
    });
    partnerGrid.setLanguage('ko', {
      display: {
        noData: '데이터가 없습니다.',
        loadingData: '데이터가 로딩중입니다.'
      }
    });
    partnerInstance.setBodyHeight( 410 );

    partnerInstance.on( 'click', ( ev ) =>{
      if( ev.targetType == 'cell' ) {
        if( clickPartnerRow.value == ev.rowKey ) {
          partnerInstance.removeRowClassName( ev.rowKey, 'row-click-yellow' );

          clickPartnerRow.value = null;
          return;
        }

        clickPartnerRow.value = ev.rowKey;
        clickPtOthersRow.value = null;

        for( let i = 0; i<partnerInstance.getRowCount(); i++ ) {
          partnerInstance.removeRowClassName( i, 'row-click-yellow' )
        }

        partnerInstance.addRowClassName( ev.rowKey, 'row-click-yellow' );
      }
    })
  }

  function ptOthersGridOnMount() {
    ptOthersGrid = ptOthersTable.value;
    ptOthersInstance = ptOthersGrid.gridInstance;

    ptOthersGrid.applyTheme( "clean", {
      cell: {
        header: {
          background: '#dee7f7'
        },
      }
    });
    ptOthersGrid.setLanguage('ko', {
      display: {
        noData: '데이터가 없습니다.',
        loadingData: '데이터가 로딩중입니다.'
      }
    });
    ptOthersInstance.setBodyHeight( 390 );

    ptOthersInstance.on( 'click', ( ev ) =>{
      if( ev.targetType == 'cell' ) {
        if( clickPtOthersRow.value == ev.rowKey ) {
          ptOthersInstance.removeRowClassName( ev.rowKey, 'row-click-yellow' );

          clickPtOthersRow.value = null;
          return;
        }

        clickPtOthersRow.value = ev.rowKey;

        for( let i = 0; i<ptOthersInstance.getRowCount(); i++ ) {
          ptOthersInstance.removeRowClassName( i, 'row-click-yellow' )
        }

        ptOthersInstance.addRowClassName( ev.rowKey, 'row-click-yellow' );
      }
    })
  }

  function partnerMod() {
    let updatedRows = partnerInstance.getModifiedRows().updatedRows;

    if( updatedRows.length < 1 ) {
      Notify.create({
        type: 'info',
        message: '수정된 데이터가 없습니다.',
        timeout: 600,
        position: 'center'
      })
    } else {
      let dvCd = vehicleInstance.getValue( clickVehicleRow.value, 'dvCd' );

      for( let i = 0; i < updatedRows.length; i++) {
        axios.post( `/api/v1/vehicle/relation/modifyOrder?dvCd=${dvCd}&bpCd=${updatedRows[i].bpCd}&deliveryOrd=${updatedRows[i].dlvOrd}`
                    , {}
                    , { headers : { Authorization : userStore.AccessToken } } )
        .then( res => {
          if( res.data.code == 0 ) {
            Notify.create({
              type: 'positive',
              message: updatedRows[i].bpShortNm + '의 배송순번을 수정했습니다.',
              timeout: 600,
              position: 'center'
            })

            partnerData()
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
  }

  function partnerRemove( rowKey ) {
    if( rowKey == null ) {
      Notify.create({
        type: 'info',
        message: '삭제할 납품처를 선택해주세요',
        timeout: 600,
        position: 'center'
      })
    } else {
      let data = partnerInstance.getRow( rowKey )
      let dvCd = vehicleInstance.getValue( clickVehicleRow, 'dvCd' )

      Dialog.create({
        title: '배송 납품처 삭제',
        message: data.bpShortNm + '을(를) 삭제 하시겠습니까?',
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
        axios.post( `/api/v1/vehicle/relation/remove?dvCd=${dvCd}&bpCd=${bpCd}`
                    , {}
                    , { headers : { Authorization : userStore.AccessToken } } )
        .then( res => {
          if( res.data.code == 0 ) {
            Notify.create({
              type: 'positive',
              message: '배송 납품처가 삭제되었습니다.',
              timeout: 600,
              position: 'center'
            })

            setTimeout( () => {
              partnerData()
              ptOthersData()
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
      })
    }
  }

  function partnerAppend( rowKey ) {
    if( rowKey == null ) {
      Notify.create({
        type: 'info',
        message: '추가할 납품처를 선택해주세요',
        timeout: 600,
        position: 'center'
      })
    } else {
      let data = ptOthersInstance.getRow( rowKey )
      let dvCd = vehicleInstance.getValue( clickVehicleRow.value, 'dvCd' )

      Dialog.create({
        title: '배송 납품처 추가',
        message: data.bpShortNm + '을(를) 추가 하시겠습니까?',
        ok: {
            push: true,
            label: '추가',
            color: 'accent'
        },
        cancel: {
        push: true,
        label: '취소',
        },
        persistent: true
      }).onOk(() => {
        axios.post( `/api/v1/vehicle/relation/append?dvCd=${dvCd}&bpCd=${data.bpCd}`
                    , {}
                    , { headers : { Authorization : userStore.AccessToken } } )
        .then( res => {
          if( res.data.code == 0 ) {
            Notify.create({
              type: 'positive',
              message: '배송 납품처가 추가되었습니다.',
              timeout: 600,
              position: 'center'
            })

            setTimeout( () => {
              partnerData()
              ptOthersData()
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
      })
    }
  }

  function goBizPartnerInfo( type, rowKey ) {
    let bpCd = null;

    if( type == 'partner') {
      bpCd = partnerInstance.getValue( rowKey, 'bpCd' );
    } else if( type == 'others') {
      bpCd = ptOthersInstance.getValue( rowKey, 'bpCd' );
    }

    router.push( {
      path: "/master/info/vehicle/bizPartner",
      state: {
        data : {
          bpCd: bpCd
        }
      }
    })
  }

  function goBizPartnerMaps( type, rowKey ) {
    console.log(brandList.value)

    let bpCd = null;

    if( type == 'partner') {
      bpCd = partnerInstance.getValue( rowKey, 'bpCd' );
    } else if( type == 'others') {
      bpCd = ptOthersInstance.getValue( rowKey, 'bpCd' );
    }

    router.push( {
      path: "/master/info/vehicle/bizPartnerMap",
      state: {
        data : {
          bpCd: bpCd
        }
      }
    })
  }

  defineExpose({
    vehicleData
  });

  onMounted( () => {
    selectMenuAuth()
    selectBoxData()
    vehicleData()

    vehicleGridOnMount()
    partnerGridOnMount()
    ptOthersGridOnMount()
  })
</script>
