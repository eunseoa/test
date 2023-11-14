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
          <q-breadcrumbs-el label="시스템공통코드" icon="pin" class="text-blue-10"/>
      </q-breadcrumbs>
    </div>

    <div class="row q-py-lg">
      <div class="text-h5 text-weight-bolder">
        <q-icon name="pin" />
        &nbsp;<span>시스템 공통코드</span>
      </div>
    </div>

    <div class="row q-col-gutter-sm">
      <div class="col-lg-4">
        <q-card class="my-card shadow-3" style="height: 800px;">
          <q-toolbar class="shadow-2" style="height: 50px;">
            <div class="text-h6 q-pa-md text-weight-bold">
              코드분류
            </div>

            <q-space></q-space>

            <q-btn
              v-if="menuauth.regPermAt == true"
              flat stretch
              icon="add"
              @click="grpCodeAddRow"
            >
              <q-tooltip>
                등록
              </q-tooltip>
            </q-btn>

            <q-btn
              v-if="menuauth.modPermAt == true"
              flat stretch
              icon="edit"
              @click="grpCodeMod"
            >
              <q-tooltip>
                수정
              </q-tooltip>
            </q-btn>

            <q-btn
              v-if="menuauth.regPermAt == true"
              flat stretch
              icon="save"
              @click="grpCodeReg"
            >
              <q-tooltip>
                저장
              </q-tooltip>
            </q-btn>
          </q-toolbar>

          <q-separator />

          <q-card-section>
            <div class="row q-col-gutter-sm">
              <div class="col-lg-6">
                <q-input
                  dense square outlined
                  v-model="grpCodeSearch"
                  @keyup.enter="grpCodeData"
                  placeholder="검색어"
                />
              </div>

              <div class="col-lg-4">
                <q-select
                  dense square outlined
                  v-model="grpCodeUseAt"
                  :options="useAtList"
                  option-label="text"
                  option-value="value"
                  emit-value
                  map-options
                  clearable
                  clear-icon="close"
                >
                  <template v-if="grpCodeUseAt == '' || grpCodeUseAt == null" v-slot:selected>
                    <div class="text-grey-6">사용여부 선택</div>
                  </template>
                </q-select>
              </div>

              <div class="col-lg-2">
                <q-btn
                  label="조회"
                  class="full-width"
                  color="indigo-7"
                  @click="grpCodeData"
                />
              </div>
            </div>
          </q-card-section>

          <div class="q-pb-sm q-pr-sm" align="right">
            총 데이터 : {{ grpDataTotalCount }} 개
          </div>

          <div>
            <TuiGrid
              ref="grpCodeTable"
              :columns="grpCodeOptions.columns"
              :data="grpCodeOptions.data"
            />
          </div>
        </q-card>
      </div>

      <div class="col-lg-8">
        <q-card class="my-card shadow-3" style="height: 800px;">
          <q-toolbar class="shadow-2" style="height: 50px;">
            <div class="text-h6 q-pa-md text-weight-bold">
              코드목록
            </div>

            <q-space></q-space>

            <q-btn
              v-if="menuauth.modPermAt == true"
              flat stretch
              icon="add"
              @click="codeAddRow"
            >
              <q-tooltip>
                등록
              </q-tooltip>
            </q-btn>

            <q-btn
              v-if="menuauth.modPermAt == true"
              flat stretch
              icon="edit"
              @click="codeMod"
            >
              <q-tooltip>
                수정
              </q-tooltip>
            </q-btn>

            <q-btn
              v-if="menuauth.regPermAt == true"
              flat stretch
              icon="save"
              @click="codeReg"
            >
              <q-tooltip>
                저장
              </q-tooltip>
            </q-btn>
          </q-toolbar>

          <q-separator />

          <q-card-section>
            <div class="row q-col-gutter-sm">
              <div class="col-lg-3">
                <q-input
                  dense square outlined
                  v-model="codeSearch"
                  @keyup.enter="codeData(selectCgId)"
                  placeholder="검색 코드 또는 명칭"
                />
              </div>

              <div class="col-lg-2">
                <q-select
                  dense square outlined
                  v-model="codeUseAt"
                  :options="useAtList"
                  option-label="text"
                  option-value="value"
                  emit-value
                  map-options
                  clearable
                  clear-icon="close"
                >
                  <template v-if="codeUseAt == '' || codeUseAt == null" v-slot:selected>
                    <div class="text-grey-6">사용여부 선택</div>
                  </template>
                </q-select>
              </div>

              <div class="col-lg-1">
                <q-btn
                  label="조회"
                  class="full-width"
                  color="indigo-7"
                  @click="codeData(selectCgId)"
                />
              </div>
            </div>
          </q-card-section>

          <div class="q-pb-sm q-pr-sm" align="right">
            총 데이터 : {{ codeDataTotalCount }} 개
          </div>

          <div>
            <TuiGrid
              ref="codeTable"
              :columns="codeOptions.columns"
              :data="codeOptions.data"
            />
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
  import { useUserStore } from 'src/stores/example-store';
  import { TuiGrid } from "vue3-tui-grid";
  import { useRouter } from 'vue-router';
  import { ref, onMounted } from 'vue';
  import { Notify } from 'quasar';
  import axios from 'axios';

  const userStore = useUserStore();
  const router = useRouter();

  let grpCodeGrid = null;
  let codeGrid = null;
  let grpCodeInstance = null;
  let codeInstance = null;
  const grpCodeTable = ref();
  const codeTable = ref();

  const grpCodeSearch = ref('');
  const codeSearch = ref('');
  const grpCodeUseAt = ref('Y');
  const codeUseAt = ref('Y');
  const useAtList = ref([]);
  const YNList = ref([]);
  const selectCgId = ref('');
  const grpDataTotalCount = ref(0);
  const codeDataTotalCount = ref(0);

  // 현재 메뉴에 대한 권한
  let menu = null;
  const menuauth = ref({
    regPermAt: '', // 등록권한
    modPermAt: '', // 수정권한
    delPermAt: '', // 삭제권한
    execPermAt: '', // 실행권한
  });

  const grpCodeOptions = ref({
    columns: [
      {
        header: '코드 *',
        name: 'cgId',
        align: 'center',
        editor: 'text',
        sortable: true
      },
      {
        header: '분류명 *',
        name: 'cgNm',
        minWidth: 180,
        editor: 'text',
        sortable: true
      },
      {
        header: '표시여부',
        name: 'displayAt',
        sortable: true,
        copyOptions: {
          useListItemText: true
        },
        formatter: 'listItemText',
        editor: {
          type: 'radio',
          options: {
            listItems: YNList.value
          }
        }
      },
      {
        header: '사용여부',
        name: 'useAt',
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
      },
      {
        header: '비고',
        name: 'cgRemark',
        editor: 'text'
      }
    ],
    data: []
  })

  const codeOptions = ref({
    columns: [
      {
        header: '코드 *',
        name: 'cd',
        minWidth: 70,
        editor: 'text',
        sortable: true
      },
      {
        header: '명칭 *',
        name: 'cdNm',
        minWidth: 180,
        editor: 'text',
        sortable: true
      },
      {
        header: '추가값1',
        name: 'addData1',
        minWidth: 120,
        editor: 'text'
      },
      {
        header: '추가값2',
        name: 'addData2',
        minWidth: 120,
        editor: 'text'
      },
      {
        header: '추가값3',
        name: 'addData3',
        minWidth: 120,
        editor: 'text'
      },
      {
        header: '디폴트값여부',
        name: 'defaultAt',
        sortable: true,
        minWidth: 120,
        copyOptions: {
          useListItemText: true
        },
        formatter: 'listItemText',
        editor: {
          type: 'radio',
          options: {
            listItems: YNList.value
          }
        }
      },
      {
        header: '노출여부',
        name: 'displayAt',
        sortable: true,
        minWidth: 100,
        copyOptions: {
          useListItemText: true
        },
        formatter: 'listItemText',
        editor: {
          type: 'radio',
          options: {
            listItems: YNList.value
          }
        }
      },
      {
        header: '사용여부',
        name: 'useAt',
        sortable: true,
        minWidth: 100,
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
      },
      {
        header: '정렬순서',
        name: 'displayOrd',
        minWidth: 100,
        align: 'right',
        editor: 'text',
        sortable: true
      },
      {
        header: '비고',
        name: 'cdRemark',
        minWidth: 100,
        editor: 'text'
      },
      {
        header: '상위코드',
        name: 'upperCd',
        minWidth: 100,
        editor: 'text',
        sortable: true
      },
      {
        header: '분류코드 *',
        minWidth: 100,
        align: 'center',
        name: 'cgId'
      }
    ],
    data: []
  })

  // 권한 가져오기
  function selectMenuAuth() {
    menu = userStore.MenuAuthority;
    menu = menu.filter( menu => menu.menuNm === '시스템공통코드관리' );

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

  function grpCodeData() {
    axios.post( '/api/v1/code/group'
              , { 'cgNm' : grpCodeSearch.value, 'useAt': grpCodeUseAt.value }
              , { headers : { Authorization : userStore.AccessToken } } )
    .then( res => {
      if( res.data.code == 0 ) {
        if( res.data.count > 0 ) {
          grpCodeInstance.resetData( res.data.result );
        } else if ( res.data.count == 0 ) {
          grpCodeInstance.resetData( [] )
        }

        grpDataTotalCount.value = res.data.count;
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

  function codeData( cgId ) {
    selectCgId.value = cgId;

    axios.post( '/api/v1/code/'
              , { 'cgId': cgId, 'cdNm': codeSearch.value, 'useAt': codeUseAt.value }
              , { headers : { Authorization : userStore.AccessToken } } )
    .then( res => {
      if( res.data.code == 0 ) {
        if( res.data.count > 0 ) {
          codeInstance.resetData( res.data.result );
        } else if ( res.data.count == 0 ) {
          codeInstance.resetData( [] );
        }

        codeDataTotalCount.value = res.data.count;
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

  function grpCodeAddRow() {
    let rowData = {
      cgId: '',
      cgNm: '',
      displayAt: 'Y',
      useAt: 'Y',
      cgRemark : ''
    };

    let row = grpCodeInstance.getRowCount();

    grpCodeInstance.appendRow(rowData, {
      at: row,
      focus: true
    });

    grpCodeInstance.enableCell( row, 'cgId' );
    grpCodeInstance.disableCell( row, 'useAt' );
  }

  function codeAddRow() {
    let rowData = {
      cd : '',
      cdNm: '',
      addData1: '',
      addData2: '',
      addData3: '',
      defaultAt: 'N',
      displayAt: 'Y',
      useAt: 'Y',
      displayOrd: '9999',
      cdRemark: '',
      upperCd: '',
      cgId: selectCgId.value
    }

    let row = codeInstance.getRowCount();

    codeInstance.appendRow(rowData, {
      at: row,
      focus: true
    });

    codeInstance.enableCell( row, 'cd' );
    codeInstance.disableCell( row, 'useAt' );
  }

  function grpCodeReg() {
    let createdRows = grpCodeInstance.getModifiedRows().createdRows;

    if( createdRows.length < 1 ) {
      Notify.create({
        type: 'info',
        message: '추가된 데이터가 없습니다.',
        timeout: 600,
        position: 'center'
      })
    } else {
      for( let i = 0; i<createdRows.length; i++ ) {
        axios.post( '/api/v1/code/group/registration'
                  , createdRows[i]
                  , { headers : { Authorization : userStore.AccessToken } } )
        .then( res => {
          if( res.data.code == 0 ) {
            Notify.create({
              type: 'positive',
              message: '분류코드가 추가되었습니다.',
              timeout: 600,
              position: 'center'
            })

            grpCodeData()
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

  function codeReg() {
    let createdRows = codeInstance.getModifiedRows().createdRows;

    if( createdRows.length < 1 ) {
      Notify.create({
        type: 'info',
        message: '추가된 데이터가 없습니다.',
        timeout: 600,
        position: 'center'
      })
    } else {
      for( let i = 0; i<createdRows.length; i++ ) {
        axios.post( '/api/v1/code/registration'
                  , createdRows[i]
                  , { headers : { Authorization : userStore.AccessToken } } )
        .then( res => {
          if( res.data.code == 0 ) {
            Notify.create({
              type: 'positive',
              message: '코드가 추가되었습니다.',
              timeout: 600,
              position: 'center'
            })

            codeData( selectCgId.value )
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

  function grpCodeMod() {
    let updatedRows = grpCodeInstance.getModifiedRows().updatedRows;

    if( updatedRows.length < 1 ) {
      Notify.create({
        type: 'info',
        message: '수정된 데이터가 없습니다.',
        timeout: 600,
        position: 'center'
      })
    } else {
      for( let i = 0; i<updatedRows.length; i++ ) {
        axios.post( '/api/v1/code/group/modify'
                  , updatedRows[i]
                  , { headers : { Authorization : userStore.AccessToken } } )
        .then( res => {
          if( res.data.code == 0 ) {
            Notify.create({
              type: 'positive',
              message: '데이터가 수정되었습니다.',
              timeout: 600,
              position: 'center'
            })

            grpCodeData()
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

  function codeMod() {
    let updatedRows = codeInstance.getModifiedRows().updatedRows;

    if( updatedRows.length < 1 ) {
      Notify.create({
        type: 'info',
        message: '수정된 데이터가 없습니다.',
        timeout: 600,
        position: 'center'
      })
    } else {
      for( let i = 0; i<updatedRows.length; i++ ) {
        axios.post( '/api/v1/code/modify'
                  , updatedRows[i]
                  , { headers : { Authorization : userStore.AccessToken } } )
        .then( res => {
          if( res.data.code == 0 ) {
            Notify.create({
              type: 'positive',
              message: '데이터가 수정되었습니다.',
              timeout: 600,
              position: 'center'
            })

            codeData( selectCgId.value )
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
    selectMenuAuth()
    selectBoxData()
    grpCodeData()

    grpCodeGrid = grpCodeTable.value;
    codeGrid = codeTable.value;
    grpCodeInstance = grpCodeGrid.gridInstance;
    codeInstance = codeGrid.gridInstance;

    grpCodeGrid.applyTheme( "clean", {
      cell: {
        header: {
          background: '#dee7f7'
        },
      }
    });
    grpCodeGrid.setLanguage('ko', {
      display: {
        noData: '데이터가 없습니다.',
        loadingData: '데이터가 로딩중입니다.'
      }
    });
    grpCodeInstance.setBodyHeight(600);
    grpCodeInstance.disableColumn( 'cgId' );

    codeGrid.applyTheme( "clean", {
      cell: {
        header: {
          background: '#dee7f7'
        },
      }
    });
    codeGrid.setLanguage('ko', {
      display: {
        noData: '데이터가 없습니다.',
        loadingData: '데이터가 로딩중입니다.'
      }
    });
    codeInstance.setBodyHeight(600);
    codeInstance.disableColumn( 'cd' );

    grpCodeInstance.on( 'click', ( ev ) => {
      if( ev.targetType == 'cell' ) {
        for( let i = 0; i<grpCodeInstance.getRowCount(); i++ ) {
          grpCodeInstance.removeRowClassName( i, 'row-click-yellow' )
        }

        grpCodeInstance.addRowClassName( ev.rowKey, 'row-click-yellow' );

        let cgId = ( grpCodeInstance.getRow( ev.rowKey ) ).cgId;

        codeData( cgId );
      }
    });
  })
</script>
