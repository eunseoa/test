<template>
  <q-card-section>
    <div class="row q-gutter-sm">
      <q-btn
        v-if="menuauth.modPermAt == true"
        label="저장"
        color="green-7"
        @click="groupAuthModify"
      />

      <q-btn
        label="취소"
        color="red-6"
        @click="groupAuthTableClose"
      />

      <q-btn
        v-if="menuauth.modPermAt == true"
        label="권한복사"
        color="blue-6"
        @click="userGroupHelperDialog"
      />
    </div>
  </q-card-section>

  <div class="q-pb-sm q-pr-sm" align="right">
    총 데이터 : {{ dataTotalCount }} 개
  </div>

  <div>
    <TuiGrid
      ref="groupAuthTable"
      :columns="groupAuthOptions.columns"
      :data="groupAuthOptions.data"
      :options="groupAuthOptions.options"
    />
  </div>

  <q-dialog v-model="userGroupHelper" persistent>
    <q-card style="width: 750px; max-width: 70vw;">
      <q-card-section class="row items-center">
        <div class="text-h6 text-weight-bold">사용자그룹 검색</div>

        <q-space />

        <q-btn icon="close" flat round dense v-close-popup></q-btn>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="row q-col-gutter-sm">
          <div class="col-lg-4">
            <q-input
              dense square outlined
              v-model="userGroupHelperSearch"
              @keyup.enter="userGroupData"
              placeholder="코드 또는 명칭"
            />
          </div>

          <div class="col-lg-2">
            <q-btn
              label="조회"
              color="indigo-7"
              @click="userGroupData"
            />
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <TuiGrid
          ref="userGroupHelperTable"
          :columns="userGroupHelperOptions.columns"
          :data="userGroupHelperOptions.data"
          :options="userGroupHelperOptions.options"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="추가" @click="groupAuthCopy"></q-btn>
        <q-btn flat label="취소" v-close-popup></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
  import { useUserStore } from 'src/stores/example-store';
  import { ref, onMounted, watch } from 'vue';
  import { TuiGrid } from "vue3-tui-grid";
  import { Notify } from 'quasar';
  import axios from 'axios';

  const userStore = useUserStore();

  const props = defineProps([
    'menuauth',
    'groupUid'
  ])

  const menuauth = ref( props.menuauth );

  class useAt {
    constructor(props) {
      const el = document.createElement('sapn');

      this.el = el;
      this.render(props);
    }

    getElement() {
      return this.el;
    }

    render(props) {
      if( props.value == 'Y' ) {
        this.el.innerHTML = '예';
      } else if( props.value == 'N' ) {
        this.el.innerHTML = '아니오';
      }
    }
  }

  const YNList = ref([]);
  const dataTotalCount = ref(0);
  const groupUid = ref('');
  const groupAuthTable = ref('');
  let groupAuthGrid = null;
  let groupAuthInstance = null;
  const groupAuthOptions = ref({
    options: {
      treeColumnOptions: {
        name: 'menuNm',
        useIcon: false
      },
    },
    columns: [
      {
        header: '코드',
        name: 'menuUid',
        minWidth: 80,
        align: 'right'
      },
      {
        header: '메뉴',
        name: 'menuNm',
        minWidth: 300
      },
      {
        header: '접근권한',
        name: 'viewPermAt',
        minWidth: 100,
        formatter: 'listItemText',
        editor: {
          type: 'radio',
          options: {
            listItems: YNList.value
          }
        }
      },
      {
        header: '등록권한',
        name: 'regPermAt',
        minWidth: 80,
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
        header: '수정권한',
        name: 'modPermAt',
        minWidth: 80,
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
        header: '삭제권한',
        name: 'delPermAt',
        minWidth: 80,
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
        header: '실행권한',
        name: 'execPermAt',
        minWidth: 80,
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
      }
    ],
    data: []
  })

  const userGroupHelperSearch = ref('');
  const userGroupHelper = ref(false);
  const userGroupHelperTable = ref('');
  let userGroupHelperGrid = null;
  let userGroupHelperInstance = null;
  const clickUserGroup = ref('');

  const userGroupHelperOptions= ref({
    columns: [
      {
        header: '그룹 ID',
        name: 'grpUid',
        minWidth: 80,
        align: 'right'
      },
      {
        header: '그룹명',
        name: 'grpName',
        minWidth: 200
      },
      {
        header: '사용여부',
        name: 'useAt',
        minWidth: 80,
        renderer: {
          type: useAt
        }
      },
      {
        header: '비고',
        name: 'grpRemark',
        minWidth: 300
      }
    ],
    data: []
  })

  function selectBoxData() {
    let C02Data = ( userStore.commomCode ).filter( code => code.cgId === 'C02');
    for( let i = 0; i<C02Data.length; i++ ) {
      let value = { 'text': C02Data[i].cdNm, 'value' : C02Data[i].cd }
      YNList.value.push( value )
    }
  }

  function groupAuthData() {
    if( groupUid == null || groupUid == '' ) {
      return;
    }

    axios.get( `/api/v1/users/group/authority/findGroupAuthorityAll/${groupUid.value}`
            , { headers : { Authorization : userStore.AccessToken } } )
    .then( res => {
      if( res.data.code == 0 ) {
        if( res.data.count > 0 ) {
          groupAuthInstance.resetData( res.data.result );
        } else if ( res.data.count < 1 ) {
          groupAuthInstance.resetData( [] );
        }

        dataTotalCount.value = res.data.count;
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

  function groupAuthCopy() {
    if( groupUid.value == null
      || groupUid.value == '' ) {
      Notify.create({
        type: 'negative',
        message: '사용자그룹을 선택해주세요.',
        timeout: 600
      })
    } else {
      axios.post( `/api/v1/users/group/authority/copyFrom?sourceGrpUid=${clickUserGroup.value}&targetGrpUid=${groupUid.value}`
                , {}
                , { headers : { Authorization : userStore.AccessToken } } )
      .then( res => {
        if( res.data.code == 0 ) {
          Notify.create({
            type: 'positive',
            message: '권한이 복사되었습니다.',
            timeout: 600
          })

          userGroupHelper.value = false;

          groupAuthData()
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

  function groupAuthModify() {
    let updatedRows = groupAuthInstance.getModifiedRows().updatedRows;

    if( updatedRows.length < 1 ) {
      Notify.create({
        type: 'negative',
        message: '수정된 데이터가 없습니다.',
        timeout: 600
      })
    } else {
      for( let i = 0; i<updatedRows.length; i++ ) {
        let value = {
          grpUid: groupUid.value,
          menuUid: updatedRows[i].menuUid,
          viewPermAt: updatedRows[i].viewPermAt,
          regPermAt: updatedRows[i].regPermAt,
          modPermAt: updatedRows[i].modPermAt,
          delPermAt: updatedRows[i].delPermAt,
          execPermAt: updatedRows[i].execPermAt
        }

        axios.post( '/api/v1/users/group/authority/modify'
                  , value
                  , { headers : { Authorization : userStore.AccessToken } } )
        .then( res => {
          if( res.data.code == 0 ) {
            Notify.create({
              type: 'positive',
              message: '권한이 수정되었습니다.',
              timeout: 600
            })

            groupAuthData()
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

  function groupAuthTableClose() {
    groupAuthInstance.cancelEditing()
  }

  function userGroupHelperDialog() {
    if( groupUid.value == null
      || groupUid.value == '' ) {
      Notify.create({
        type: 'negative',
        message: '권한을 복사할 그룹을 선택해주세요.',
        timeout: 600
      })

      return;
    }

    userGroupHelper.value = true;

    watch( () => userGroupHelperTable.value, () => {
      if( userGroupHelperTable.value != null ) {
        userGroupHelperGrid = userGroupHelperTable.value;
        userGroupHelperInstance = userGroupHelperGrid.gridInstance;

        userGroupHelperGrid.applyTheme( 'clean' );
        userGroupHelperGrid.setLanguage('ko', {
          display: {
            noData: '데이터가 없습니다.',
            loadingData: '데이터가 로딩중입니다.'
          }
        });
        userGroupHelperInstance.setBodyHeight( 520 );

        userGroupData()

        let clickRow = null;

        userGroupHelperInstance.on( 'click', ( ev ) => {
          if( ev.targetType == 'cell' ) {
            if( clickRow == ev.rowKey ) {
              userGroupHelperInstance.removeRowClassName( clickRow, 'row-click-yellow' );

              clickRow = null;
              clickUserGroup.value = null;

              return;
            }

            for( let i = 0; i<userGroupHelperInstance.getRowCount(); i++ ) {
              userGroupHelperInstance.removeRowClassName( i, 'row-click-yellow' )
            }

            userGroupHelperInstance.addRowClassName( ev.rowKey, 'row-click-yellow' );

            clickUserGroup.value = userGroupHelperInstance.getValue( ev.rowKey, 'grpUid' );
            clickRow = ev.rowKey;
          }
        })
      }
    })
  }

  function userGroupData() {
    axios.post( `/api/v1/users/group/helper`
              , { grpName: userGroupHelperSearch.value }
              , { headers : { Authorization : userStore.AccessToken } } )
    .then( res => {
      if( res.data.code == 0 ) {
        if( res.data.count > 0 ) {
          userGroupHelperInstance.resetData( res.data.result );
        } else if( res.data.count < 1 ) {
          userGroupHelperInstance.resetData( [] );
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

  watch( () => props.groupUid, () => {
    if( props.groupUid != '' ) {
      groupUid.value = props.groupUid;
      groupAuthData()
    }
  })

  onMounted( () => {
    selectBoxData()

    groupAuthGrid = groupAuthTable.value;
    groupAuthInstance = groupAuthGrid.gridInstance;

    groupAuthGrid.applyTheme( 'clean', {
      cell: {
        header: {
          background: '#dee7f7'
        },
      }
    });
    groupAuthGrid.setLanguage('ko', {
      display: {
        noData: '데이터가 없습니다.',
        loadingData: '데이터가 로딩중입니다.'
      }
    });
    groupAuthInstance.setBodyHeight( 600 );

    if( props.groupUid != '' ) {
      groupUid.value = props.groupUid;
      groupAuthData()
    }
  })
</script>
