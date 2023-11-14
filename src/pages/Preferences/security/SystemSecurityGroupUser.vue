<template>
  <q-card-section>
    <div class="row q-col-gutter-sm">
      <div class="col-lg-3">
        <q-input
          dense square outlined
          v-model="userSearch"
          @keyup.enter="userData()"
          placeholder="검색할 계정ID 또는 계정명"
        />
      </div>

      <div class="col-lg-5 q-gutter-sm">
        <q-btn
          color="indigo-7"
          label="조회"
          @click="userData()"
        />

        <q-btn
          v-if="menuauth.regPermAt == true"
          color="green-7"
          label="사용자추가"
          @click="addUserHelperDialog"
        />

        <q-btn
          v-if="menuauth.delPermAt == true"
          label="사용자삭제"
          color="red-6"
          @click="groupDelUser"
        />
      </div>
    </div>
  </q-card-section>

  <div class="q-pb-sm q-pr-sm" align="right">
    총 데이터 : {{ dataTotalCount }} 개
  </div>

  <div>
    <TuiGrid
      ref="userTable"
      :columns="userOptions.columns"
      :data="userOptions.data"
      :options="userOptions.options"
    />
  </div>

  <q-dialog v-model="addUserHelper" persistent>
    <q-card style="width: 1450px; max-width: 80vw;">
      <q-card-section class="row items-center">
        <div class="text-h6 text-weight-bold">사용자 추가</div>

        <q-space />

        <q-btn icon="close" flat round dense v-close-popup></q-btn>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="row q-col-gutter-sm">
          <div class="col-lg-4">
            <q-input
              dense square outlined
              v-model="addUserHelperSearch"
              @keyup.enter="addUserHelperData"
              placeholder="코드 또는 명칭"
            />
          </div>

          <div class="col-lg-2">
            <q-btn
              label="조회"
              color="indigo-7"
              @click="addUserHelperData"
            />
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <TuiGrid
          ref="userHelperTable"
          :columns="userHelperOptions.columns"
          :data="userHelperOptions.data"
          :options="userHelperOptions.options"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="추가" @click="groupAddUser"></q-btn>
        <q-btn flat label="취소" v-close-popup></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
  import { useUserStore } from 'src/stores/example-store';
  import { ref, onMounted, watch } from 'vue';
  import { TuiGrid } from "vue3-tui-grid";
  import { Notify, Dialog } from 'quasar';
  import axios from 'axios';

  const userStore = useUserStore();

  const props = defineProps([
    'menuauth',
    'groupUid'
  ])

  const menuauth = ref( props.menuauth );

  const dataTotalCount = ref(0);
  const groupUid = ref('');
  const userSearch = ref('');
  const userTable = ref('');
  let userGrid = null;
  let userInstance = null;
  const userOptions = ref({
    options: {
      rowHeaders: [ 'checkbox' ]
    },
    columns: [
      {
        header: 'UID',
        name: 'userUid',
        minWidth: 70,
        align: 'right',
        sortable: true
      },
      {
        header: '계정',
        name: 'accountId',
        minWidth: 150,
        sortable: true
      },
      {
        header: '사용자명',
        name: 'accountName',
        minWidth: 180,
        sortable: true
      },
      {
        header: '계정 유형',
        name: 'accountTypeNm',
        minWidth: 100,
        sortable: true
      },
      {
        header: '사용자 구분',
        name: 'extUserNm',
        minWidth: 140,
        sortable: true
      },
      {
        header: '이메일',
        name: 'email',
        minWidth: 180
      },
      {
        header: '핸드폰',
        name: 'mobile',
        minWidth: 150,
        align: 'center'
      },
      {
        header: '물류센터',
        name: 'lcNm',
        minWidth: 130,
        sortable: true
      },
      {
        header: '부서',
        name: 'orgNm',
        minWidth: 130,
        sortable: true
      },
      {
        header: '사번',
        name: 'empNo',
        minWidth: 100,
        sortable: true
      },
      {
        header: '거래처',
        name: 'bpNm',
        minWidth: 150,
        sortable: true
      }
    ],
    data: []
  })

  const addUserHelper = ref(false);
  const addUserHelperSearch = ref('');
  const addUserHelperList = ref([]);
  const userHelperTable = ref('');
  let userHelperGrid = null;
  let userHelperInstance = null;
  const userHelperOptions = ref({
    options: {
      rowHeaders: [ 'checkbox' ]
    },
    columns: [
      {
        header: '코드',
        name: 'userUid',
        minWidth: 100,
        align: 'right',
        sortable: true
      },
      {
        header: '계정',
        name: 'accountId',
        minWidth: 150,
        sortable: true
      },
      {
        header: '사용자명',
        name: 'accountName',
        minWidth: 150,
        sortable: true
      },
      {
        header: '계정 유형',
        name: 'accountTypeNm',
        minWidth: 150,
        sortable: true
      },
      {
        header: '사용자 구분',
        name: 'extUserNm',
        minWidth: 150,
        sortable: true
      },
      {
        header: '물류센터',
        name: 'lcNm',
        minWidth: 150,
        sortable: true
      },
      {
        header: '부서',
        name: 'orgNm',
        minWidth: 100,
        sortable: true
      },
      {
        header: '사번',
        name: 'empNo',
        minWidth: 100,
        sortable: true
      },
      {
        header: '거래처',
        name: 'bpNm',
        minWidth: 250,
        sortable: true
      }
    ],
    data: []
  })

  function userData() {
    axios.post( '/api/v1/users/group/member'
              , { grpUid: groupUid.value, accountName: userSearch.value }
              , { headers : { Authorization : userStore.AccessToken } } )
    .then( res => {
      if( res.data.code == 0 ) {
        if( res.data.count > 0 ) {
          userInstance.resetData( res.data.result );
        } else if ( res.data.code < 1 ) {
          userInstance.resetData( [] );
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

  function addUserHelperDialog() {
    if( groupUid.value == null
      || groupUid.value == '' ) {
      Notify.create({
        type: 'info',
        message: '사용자를 추가할 그룹을 선택해주세요.',
        timeout: 600
      })

      return;
    }

    addUserHelper.value = true;

    watch( () => userHelperTable.value, () => {
      if( userHelperTable.value != null ) {
        userHelperGrid = userHelperTable.value;
        userHelperInstance = userHelperGrid.gridInstance;

        userHelperGrid.applyTheme( 'clean' );
        userHelperGrid.setLanguage('ko', {
          display: {
            noData: '데이터가 없습니다.',
            loadingData: '데이터가 로딩중입니다.'
          }
        });
        userHelperInstance.setBodyHeight( 520 );

        axios.get( `/api/v1/users/group/member/findGroupNonMembers/${groupUid.value}`
                  , { headers : { Authorization : userStore.AccessToken } } )
        .then( res => {
          if( res.data.code == 0 ) {
            if( res.data.count > 0 ) {
              addUserHelperList.value = res.data.result;
              userHelperInstance.resetData( res.data.result );
            } else if( res.data.count < 1 ) {
              userHelperInstance.resetData( [] );
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
    })
  }

  function addUserHelperData() {
    let searchData = [];

    for( let i = 0; i<addUserHelperList.value.length; i++ ) {
      let value = addUserHelperList.value[i].userUid.toString() + addUserHelperList.value[i].accountId;

      const a = value.match( addUserHelperSearch.value );

      if( a ) {
        searchData.push( addUserHelperList.value[i] )
      }
    }

    userHelperInstance.resetData( searchData )
  }

  function groupAddUser() {
    let userRow = userHelperInstance.getCheckedRows()

    if( userRow.length < 1 ) {
      Notify.create({
        type: 'info',
        message: '추가할 사용자를 선택해주세요.',
        timeout: 600,
        position: 'center'
      })
    } else {
      let userUid = userRow.map( row => row.userUid );

      axios.post( `/api/v1/users/group/member/registration/batch/${groupUid.value}`
                , userUid
                , { headers : { Authorization : userStore.AccessToken } } )
      .then( res => {
        if( res.data.code == 0 ) {
          Notify.create({
            type: 'positive',
            message: '사용자가 추가되었습니다.',
            timeout: 600,
            position: 'center'
          })

          addUserHelper.value = false;

          userData()
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
  }

  function groupDelUser() {
    let userRow = userInstance.getCheckedRows()

    if( userRow.length < 1 ) {
      Notify.create({
        type: 'info',
        message: '삭제할 사용자를 선택해주세요.',
        timeout: 600,
        position: 'center'
      })
    } else {
      let userUid = userRow.map( row => row.userUid );
      let userNm = userRow.map( row => row.accountName );

      Dialog.create({
        title: '사용자 삭제',
        message: `[ ` + userNm + ` ]을(를) 그룹에서 삭제하시겠습니까? `,
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
        axios.post( `/api/v1/users/group/member/remove/batch/${groupUid.value}`
                , userUid
                , { headers : { Authorization : userStore.AccessToken } } )
        .then( res => {
          if( res.data.code == 0 ) {
            Notify.create({
              type: 'positive',
              message: '사용자가 삭제되었습니다.',
              timeout: 600,
              position: 'center'
            })

            addUserHelper.value = false;

            userData()
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
      })
    }
  }

  watch( () => props.groupUid, () => {
    if( props.groupUid != '') {
      groupUid.value = props.groupUid;
      userData()
    }
  })

  onMounted( () => {
    userGrid = userTable.value;
    userInstance = userGrid.gridInstance;

    userGrid.applyTheme( 'clean', {
      cell: {
        header: {
          background: '#dee7f7'
        },
      }
    });
    userGrid.setLanguage('ko', {
      display: {
        noData: '데이터가 없습니다.',
        loadingData: '데이터가 로딩중입니다.'
      }
    });
    userInstance.setBodyHeight( 600 );

    if( props.groupUid != '' ) {
      groupUid.value = props.groupUid;
      userData()
    }
  })
</script>
