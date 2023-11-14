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
          <q-breadcrumbs-el label="매입처" icon="shopping_cart_checkout" class="text-blue-10"/>
      </q-breadcrumbs>
    </div>

    <div class="row q-py-lg">
      <div class="text-h5 text-weight-bolder">
        <q-icon name="shopping_cart_checkout" />
        &nbsp;<span>매입처 수정</span>
      </div>
    </div>

    <div class="q-pt-sm">
      <div class="q-pa-xs">
        <q-card class="my-card">
          <q-tabs
            v-model="tab"
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="left"
            narrow-indicator
          >
            <q-tab name="info" label="등록정보"></q-tab>
            <q-tab name="bpManager" label="담당자"></q-tab>
          </q-tabs>
        </q-card>
      </div>

      <q-tab-panels v-model="tab" animated class="bg-grey-2 q-pa-none">
        <q-tab-panel name="info" class="q-pa-xs">
          <vendorInfo
            :bpcd="bpCd"
            :type="type"
          />
        </q-tab-panel>

        <q-tab-panel name="bpManager" class="q-pa-xs">
          <q-card class="my-card" style="height: 700px;">
            <q-card-section>
              <div class="q-gutter-md">
                <q-btn
                  padding="xs xl"
                  label="등록"
                  style="background-color: #253abb; color: #ffffff"
                  @click="bmAddRow"
                />

                <q-btn
                  padding="xs xl"
                  label="저장"
                  style="background-color: #253abb; color: #ffffff"
                  @click="bmReg"
                />

                <q-btn
                  padding="xs xl"
                  label="수정"
                  style="background-color: #7483e3; color: #ffffff"
                  @click="bmModify"
                />

                <q-btn
                  padding="xs xl"
                  label="삭제"
                  color="red-9"
                  @click="bmRemove"
                />

                <q-btn
                  padding="xs xl"
                  label="목록"
                  color="grey-8"
                  @click="goVendorList"
                />
              </div>
            </q-card-section>

            <div>
              <TuiGrid
                ref="bmTable"
                :columns="bmOptions.columns"
                :data="bmOptions.data"
              />
            </div>
          </q-card>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </q-page>
</template>

<script setup>
  import { useUserStore } from 'src/stores/example-store';
  import { TuiGrid } from 'vue3-tui-grid';
  import { ref, onMounted, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { Notify, Dialog } from 'quasar';
  import axios from 'axios';

  import vendorInfo from 'src/pages/Master/Vendor/MasterVendorInfo.vue';

  const userStore = useUserStore();
  const router = useRouter();

  const type = ref('mod');
  const bpCd = ref('');
  const tab = ref('info');
  const clickRow = ref(null);
  const bmCategoryList = ref([]);

  const bmTable = ref('');
  let bmGrid = null;
  let bmInstance = null;
  const bmOptions = ref({
    columns: [
      {
        header: '담당자 ID',
        name: 'bmUid',
        hidden: true
      },
      {
        header: '담당자',
        name: 'bmNm',
        editor: 'text',
        sortable: true
      },
      {
        header: '핸드폰',
        name: 'bmMobileNo',
        editor: 'text'
      },
      {
        header: '전화번호',
        name: 'bmTelNo',
        editor: 'text'
      },
      {
        header: '이메일',
        name: 'bmEmail',
        editor: 'text'
      },
      {
        header: '구분',
        name: 'bmCategory',
        copyOptions: {
          useListItemText: true
        },
        formatter: 'listItemText',
        editor: {
          type: 'select',
          options: {
            listItems: bmCategoryList.value
          }
        },
        sortable: true
      },
      {
        header: '거래처코드',
        name: 'bpCd',
        hidden: true
      }
    ],
    data: []
  })

  function selectBoxData() {
    let G20Data = ( userStore.commomCode ).filter( code => code.cgId === 'G20' );
    for( let i = 0; i<G20Data.length; i++ ) {
      let value = { 'text': G20Data[i].cdNm, 'value' : G20Data[i].cd }
      bmCategoryList.value.push( value )
    }
  }

  function loadData() {
    axios.get( `/api/v1/partner/manager/${bpCd.value}`
            , { headers : { Authorization : userStore.AccessToken } } )
    .then( res => {
      if( res.data.code == 0 ) {
        if( res.data.count > 0 ) {
          bmInstance.resetData( res.data.result );
        } else if( res.data.count < 1 ) {
          bmInstance.resetData( [] );
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
  }

  function bmAddRow() {
    let rowData = {
      bmNm: '',
      bmMobileNo: '',
      bmTelNo: '',
      bmCategory: '10',
      bpCd: bpCd.value
    }

    let row = bmInstance.getRowCount();

    bmInstance.appendRow( rowData, {
      at: row,
      focus: true
    });
  }

  function bmReg() {
    let createdRows = bmInstance.getModifiedRows().createdRows;

    if( createdRows.length < 1 ) {
      Notify.create({
        type: 'negative',
        message: '추가된 데이터가 없습니다.',
        timeout: 600
      })
    } else {
      for( let i = 0; i<createdRows.length; i++ ) {
        axios.post( '/api/v1/partner/manager/registration'
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

  function bmModify() {
    let updatedRows = bmInstance.getModifiedRows().updatedRows;

    if( updatedRows.length < 1 ) {
      Notify.create({
        type: 'info',
        message: '수정된 데이터가 없습니다.',
        timeout: 600,
        position: 'center'
      })
    } else {
      for( let i = 0; i < updatedRows.length; i++) {
        axios.post( `/api/v1/partner/manager/modify`
                    , updatedRows[i]
                    , { headers : { Authorization : userStore.AccessToken } } )
        .then( res => {
          if( res.data.code == 0 ) {
            Notify.create({
              type: 'positive',
              message: '담당자의 정보가 수정되었습니다.',
              timeout: 600,
              position: 'center'
            })

            loadData()
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

  function bmRemove() {
    if( clickRow.value == null ) {
      Notify.create({
        type: 'info',
        message: '삭제할 담당자를 선택해주세요.',
        timeout: 600,
        position: 'center'
      })
    } else {
      let bmUid = bmInstance.getValue( clickRow.value, 'bmUid' );
      let bmNm = bmInstance.getValue( clickRow.value, 'bmNm' );

      Dialog.create({
        title: '담당자 삭제',
        message: '담당자  [ ' + bmNm + ' ]  를 삭제하시겠습니까?',
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
        axios.post( `/api/v1/partner/manager/remove`
                + `?bmUid=${bmUid}`
                , {}
                , { headers : { Authorization : userStore.AccessToken } } )
        .then( res => {
          if( res.data.code == 0 ) {
            Notify.create({
              type: 'positive',
              message: '담당자가 삭제되었습니다.',
              timeout: 600
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
      })
    }
  }

  function goVendorList() {
    router.push( {
      path: "/master/info/vendor",
      state: {
        data : history.state.data
      }
    })
  }

  watch( () => bmTable.value, () => {
    bmGrid = bmTable.value;
    bmInstance = bmGrid.gridInstance;

    bmGrid.applyTheme( "clean" );
    bmGrid.setLanguage('ko', {
      display: {
        noData: '데이터가 없습니다.',
        loadingData: '데이터가 로딩중입니다.'
      }
    });
    bmInstance.setBodyHeight( 580 );

    bmInstance.on( 'click', ( ev ) => {
      if( ev.targetType == 'cell' ) {
        if( clickRow.value == ev.rowKey ) {
          bmInstance.removeRowClassName( ev.rowKey, 'row-click-yellow' );

          clickRow.value = null;
          return;
        }

        clickRow.value = ev.rowKey;

        for( let i = 0; i<bmInstance.getRowCount(); i++ ) {
          bmInstance.removeRowClassName( i, 'row-click-yellow' )
        }

        bmInstance.addRowClassName( ev.rowKey, 'row-click-yellow' );
      }
    })

    loadData()
  })

  onMounted( () => {
    bpCd.value = history.state.data.bpcd;

    selectBoxData()
  })
</script>
