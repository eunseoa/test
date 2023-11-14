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
          <q-breadcrumbs-el label="보안관리" icon="verified_user" class="text-grey-7"/>
          <q-breadcrumbs-el label="사용자그룹" icon="people" class="text-blue-10"/>
      </q-breadcrumbs>
    </div>

    <div class="row q-py-lg">
      <div class="text-h5 text-weight-bolder">
        <q-icon name="people" />
        &nbsp;<span>사용자그룹</span>
      </div>
    </div>

    <div class="row q-col-gutter-sm">
      <div class="col-lg-4">
        <q-card class="my-card shadow-3" style="height: 800px;">
          <q-toolbar class="shadow-2" style="height: 50px;">
            <div class="text-h6 q-pa-md text-weight-bold">
              사용자그룹
            </div>

            <q-space></q-space>

            <q-btn
              v-if="menuauth.regPermAt == true"
              flat stretch
              icon="add"
              @click="groupRowAdd"
            >
              <q-tooltip>
                등록
              </q-tooltip>
            </q-btn>

            <q-btn
              v-if="menuauth.modPermAt == true"
              flat stretch
              icon="edit"
              @click="groupMod"
            >
              <q-tooltip>
                수정
              </q-tooltip>
            </q-btn>

            <q-btn
              v-if="menuauth.regPermAt == true"
              flat stretch
              icon="save"
              @click="groupReg"
            >
              <q-tooltip>
                저장
              </q-tooltip>
            </q-btn>

            <q-btn
              v-if="menuauth.regPermAt == true"
              flat stretch
              icon="close"
              @click="groupTableClose"
            >
              <q-tooltip>
                취소
              </q-tooltip>
            </q-btn>
          </q-toolbar>

          <q-separator />

          <q-card-section>
            <div class="row q-col-gutter-sm">
              <div class="col-lg-5">
                <q-input
                  dense square outlined
                  v-model="groupSearch"
                  @keyup.enter="groupData"
                  placeholder="검색어"
                />
              </div>

              <div class="col-lg-5">
                <q-select
                  dense square outlined
                  v-model="groupUseAtSearch"
                  :options="useAtList"
                  option-label="text"
                  option-value="value"
                  emit-value
                  map-options
                  clearable
                  clear-icon="close"
                >
                  <template v-if="groupUseAtSearch == '' || groupUseAtSearch == null" v-slot:selected>
                    <div class="text-grey-6">사용여부 선택</div>
                  </template>
                </q-select>
              </div>

              <div class="col-lg-2">
                <q-btn
                  label="조회"
                  color="indigo-7"
                  @click="groupData"
                />
              </div>
            </div>
          </q-card-section>

          <div class="q-pb-sm q-pr-sm" align="right">
            총 데이터 : {{ dataTotalCount }} 개
          </div>

          <div>
            <TuiGrid
              ref="groupTable"
              :columns="groupOptions.columns"
              :data="groupOptions.data"
            />
          </div>
        </q-card>
      </div>

      <div class="col-lg-8">
        <q-card class="my-card shadow-3" style="height: 800px;">
          <q-tabs
            v-model="tab"
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            style="height:50px;"
            align="left"
          >
            <q-tab name="user" label="사용자"></q-tab>
            <q-tab name="userAuth" label="접근권한"></q-tab>
          </q-tabs>

          <q-separator></q-separator>

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="user" class="q-pa-none">
              <user
                :menuauth="menuauth"
                :groupUid="clickGrpUid"
              />
            </q-tab-panel>

            <q-tab-panel name="userAuth" class="q-pa-none">
              <GroupAuth
                :menuauth="menuauth"
                :groupUid="clickGrpUid"
              />
            </q-tab-panel>
          </q-tab-panels>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
  import { useUserStore } from 'src/stores/example-store';
  import { ref, onMounted, watch } from 'vue';
  import { TuiGrid } from "vue3-tui-grid";
  import { useRouter } from 'vue-router';
  import { Notify } from 'quasar';
  import axios from 'axios';

  import User from 'src/pages/Preferences/security/SystemSecurityGroupUser.vue';
  import GroupAuth from 'src/pages/Preferences/security/SystemSecurityGroupAuth.vue';

  const userStore = useUserStore();
  const router = useRouter();

  const tab = ref( 'user' );

  const groupSearch = ref('');
  const groupUseAtSearch = ref('');
  const useAtList = ref([]);
  const clickGrpUid = ref('');
  const clickRow = ref(null);
  const dataTotalCount = ref(0);

  const groupTable = ref('');
  let groupGrid = null;
  let groupInstance = null;
  const groupOptions = ref({
    columns: [
      {
        header: 'UID *',
        name: 'grpUid',
        minWidth: 70,
        align: 'right',
        sortable: true
      },
      {
        header: '그룹명 *',
        name: 'grpName',
        minWidth: 180,
        editor: 'text',
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
      },
      {
        header: '비고',
        name: 'grpRemark',
        minWidth: 250,
        editor: 'text'
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
    menu = menu.filter( menu => menu.menuNm === '사용자그룹관리' );

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
  }

  function groupData() {
    axios.post( '/api/v1/users/group'
              ,{ grpName: groupSearch.value, useAt: groupUseAtSearch.value }
              , { headers : { Authorization : userStore.AccessToken } } )
    .then( res => {
      if( res.data.code == 0 ) {
        if( res.data.count > 0 ) {
          groupInstance.resetData( res.data.result );
        } else if ( res.data.count < 1 ) {
          groupInstance.resetData( [] );
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

  function groupRowAdd() {
    let rowData = {
      grpUid: '',
      grpName: '',
      useAt: 'Y',
      grpRemark: ''
    }

    let row = groupInstance.getRowCount();

    groupInstance.appendRow( rowData, {
      at: row,
      focus: true
    });

    groupInstance.disableCell( row, 'grpUid' );
  }

  function groupReg() {
    let createdRows = groupInstance.getModifiedRows().createdRows;

    if( createdRows.length < 1 ) {
      Notify.create({
        type: 'negative',
        message: '추가된 데이터가 없습니다.',
        timeout: 600
      })
    } else {
      for( let i = 0; i<createdRows.length; i++ ) {
        let value = {
          grpName: createdRows[i].grpName,
          grpRemark: createdRows[i].grpRemark,
          useAt: createdRows[i].useAt
        }

        if( createdRows[i].grpName == null
          || createdRows[i].grpName == '' ) {
          Notify.create({
            type: 'negative',
            message: '필수항목을 입력해주세요.',
            timeout: 600
          })

          return;
        }

        axios.post( '/api/v1/users/group/registration'
                  , value
                  , { headers : { Authorization : userStore.AccessToken } } )
        .then( res => {
          if( res.data.code == 0 ) {
            Notify.create({
              type: 'positive',
              message: '사용자그룹 [ ' + res.data.result.grpName + '] 이(가) 추가되었습니다.',
              timeout: 600
            })

            setTimeout( () => {
              router.go(0)
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

  function groupMod() {
    let updatedRows = groupInstance.getModifiedRows().updatedRows;

    if( updatedRows.length < 1 ) {
      Notify.create({
        type: 'negative',
        message: '수정된 데이터가 없습니다.',
        timeout: 600
      })
    } else {
      for( let i = 0; i<updatedRows.length; i++ ) {
        let value = {
          grpUid: updatedRows[i].grpUid,
          grpName: updatedRows[i].grpName,
          grpRemark: updatedRows[i].grpRemark,
          useAt: updatedRows[i].useAt
        }

        if( updatedRows[i].grpName == null
          || updatedRows[i].grpName == '' ) {
          Notify.create({
            type: 'negative',
            message: '필수항목을 입력해주세요.',
            timeout: 600
          })

          return;
        }

        axios.post( '/api/v1/users/group/modify'
                  , value
                  , { headers : { Authorization : userStore.AccessToken } } )
        .then( res => {
          if( res.data.code == 0 ) {
            Notify.create({
              type: 'positive',
              message: '사용자그룹 [ ' + res.data.result.grpName + ' ] 이(가) 수정되었습니다.',
              timeout: 600
            })

            setTimeout( () => {
              router.go(0)
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

  function groupTableClose() {
    groupInstance.cancelEditing()
  }

  onMounted( () => {
    selectMenuAuth()
    selectBoxData()
    groupData()

    groupGrid = groupTable.value;
    groupInstance = groupGrid.gridInstance;

    groupGrid.applyTheme( 'clean', {
      cell: {
        header: {
          background: '#dee7f7'
        },
      }
    });
    groupGrid.setLanguage('ko', {
      display: {
        noData: '데이터가 없습니다.',
        loadingData: '데이터가 로딩중입니다.'
      }
    });
    groupInstance.setBodyHeight( 600 );

    groupInstance.on( 'click', ( ev ) => {
      if( ev.targetType == 'cell' ) {
        let value = groupInstance.getValue( ev.rowKey, 'grpUid' );

        if( value == null || value == '' ) {
          /*
            현재 선택한 row가 등록하기위한 row이면
            row를 클릭해도 색깔X
          */
          return;
        }

        if( clickRow.value == ev.rowKey ) {
          groupInstance.removeRowClassName( clickRow.value, 'row-click-yellow' );

          clickRow.value = null;
          clickGrpUid.value = '';

          return;
        }

        for( let i = 0; i<groupInstance.getRowCount(); i++ ) {
          groupInstance.removeRowClassName( i, 'row-click-yellow' )
        }

        groupInstance.addRowClassName( ev.rowKey, 'row-click-yellow' );

        clickGrpUid.value = groupInstance.getValue( ev.rowKey, 'grpUid' );
        clickRow.value = ev.rowKey;
      }
    })
  })
</script>
