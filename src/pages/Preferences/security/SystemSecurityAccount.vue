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
          <q-breadcrumbs-el label="사용자" icon="person" class="text-blue-10"/>
      </q-breadcrumbs>
    </div>

    <div class="row q-py-lg">
      <div class="text-h5 text-weight-bolder">
        <q-icon name="person" />
        &nbsp;<span>사용자</span>
      </div>
    </div>

    <div>
      <q-card class="my-card shadow-3" style="height: 800px;">
        <q-toolbar class="shadow-2">
          <div class="text-h6 q-pa-md text-weight-bold">
            사용자
          </div>

          <q-space></q-space>

          <q-btn
            v-if="menuauth.regPermAt == true"
            flat stretch
            icon="save"
            @click="userReg"
          >
            <q-tooltip>
              등록
            </q-tooltip>
          </q-btn>

          <q-btn
            v-if="menuauth.modPermAt == true"
            flat stretch
            icon="edit"
            @click="userInfoDtl( clickRow )"
          >
            <q-tooltip>
              수정
            </q-tooltip>
          </q-btn>

          <q-btn
            v-if="menuauth.modPermAt == true"
            flat stretch
            icon="person_off"
            @click="userInactive"
          >
            <q-tooltip>
              사용중지
            </q-tooltip>
          </q-btn>

          <q-btn
            v-if="menuauth.delPermAt == true"
            flat stretch
            icon="delete"
            @click="userDisable"
          >
            <q-tooltip>
              삭제
            </q-tooltip>
          </q-btn>

          <q-btn
            v-if="menuauth.delPermAt == true"
            flat stretch
            icon="delete_forever"
            @click="userRemove"
          >
            <q-tooltip>
              영구삭제
            </q-tooltip>
          </q-btn>
        </q-toolbar>

        <q-separator />

        <q-card-section class="q-pb-none">
          <div class="row q-col-gutter-sm">
            <div class="col-lg-2">
              <q-input
                dense square outlined
                v-model="userNmSearch"
                placeholder="ID 또는 계정명"
                @keyup.enter="userData"
              />
            </div>
            <div class="col-lg-2">
              <q-select
                dense square outlined
                v-model="userActiveSearch"
                :options="userActiveList"
                emit-value
                map-options
                clearable
                clear-icon="close"
              >
                <template v-if="userActiveSearch == '' || userActiveSearch == null" v-slot:selected>
                  <div class="text-grey-6">계정상태 선택</div>
                </template>
              </q-select>
            </div>

            <div class="col-lg-2">
              <q-select
                dense square outlined
                v-model="userTypeSearch"
                :options="userTypeList"
                option-value="cd"
                option-label="cdNm"
                emit-value
                map-options
                clearable
                clear-icon="close"
              >
                <template v-if="userTypeSearch == '' || userTypeSearch == null" v-slot:selected>
                  <div class="text-grey-6">계정유형 선택</div>
                </template>
              </q-select>
            </div>

            <div class="col-lg-2">
              <q-select
                dense square outlined
                v-model="userExtUserAtSearch"
                :options="userExtUserAtList"
                option-value="cd"
                option-label="cdNm"
                emit-value
                map-options
                clearable
                clear-icon="close"
              >
                <template v-if="userExtUserAtSearch == '' || userExtUserAtSearch == null" v-slot:selected>
                  <div class="text-grey-6">계정구분 선택</div>
                </template>
              </q-select>
            </div>

            <div class="col-lg-1">
              <q-btn
                label="조회"
                color="indigo-7"
                @click="userData"
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
          />
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
  import { useUserStore } from 'src/stores/example-store';
  import { TuiGrid } from "vue3-tui-grid";
  import { Notify, Dialog } from 'quasar';
  import { useRouter } from 'vue-router';
  import { ref, onMounted } from 'vue';
  import axios from 'axios';

  const userStore = useUserStore();
  const router = useRouter();

  class LockAt {
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
        this.el.innerHTML = '잠금';
      } else if( props.value == 'N' ) {
        this.el.innerHTML = '잠금해제';
      }
    }
  }

  class UseAt {
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
        this.el.innerHTML = '사용';
      } else if( props.value == 'N' ) {
        this.el.innerHTML = '사용안함';
      }
    }
  }

  class Active {
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
        this.el.innerHTML = '활성화';
      } else if( props.value == 'N' ) {
        this.el.innerHTML = '비활성화';
      }
    }
  }

  class ExtUserAt {
    constructor(props) {
      const el = document.createElement('sapn');

      this.el = el;
      this.render(props);
    }

    getElement() {
      return this.el;
    }

    render(props) {
      let data = ( userStore.commomCode ).filter( code => code.cgId === 'S02' );

      for( let i = 0; i<data.length; i++ ) {
        if( data[i].cd == props.value ) {
          this.el.innerHTML = data[i].cdNm;
        }
      }
    }
  }

  const userNmSearch = ref('');
  const userActiveSearch = ref('');
  const userActiveList = ref([
    {
      label: '활성화',
      value: 'Y'
    },
    {
      label: '비활성화',
      value: 'N'
    }
  ]);
  const userTypeSearch = ref('');
  const userTypeList = ref([]);
  const userExtUserAtSearch = ref('');
  const userExtUserAtList = ref([]);
  const clickRow = ref(null);
  const dataTotalCount = ref(0);

  const userTable = ref('');
  let userGrid = null;
  let userInstance = null;
  const userOptions = ref({
    columns: [
      {
        header: 'UID',
        name: 'userUid',
        minWidth: 80,
        align: 'right',
        sortable: true
      },
      {
        header: '계정ID',
        name: 'accountId',
        minWidth: 130,
        sortable: true
      },
      {
        header: '계정명',
        name: 'accountName',
        minWidth: 150,
        sortable: true
      },
      {
        header: '별명',
        name: 'accountNickname',
        minWidth: 150,
        sortable: true
      },
      {
        header: '사용자구분',
        name: 'extUserAt',
        minWidth: 120,
        sortable: true,
        renderer: {
          type: ExtUserAt
        }
      },
      {
        header: '암호만료일',
        name: 'pwdExpiredDt',
        minWidth: 150,
        align: 'center',
        sortable: true
      },
      {
        header: '상태',
        name: 'active',
        minWidth: 100,
        sortable: true,
        renderer: {
          type: Active
        }
      },
      {
        header: '이메일',
        name: 'email',
        minWidth: 150
      },
      {
        header: '핸드폰',
        name: 'mobile',
        minWidth: 150
      },
      {
        header: '계정잠금여부',
        name: 'accountLocked',
        sortable: true,
        minWidth: 100,
        renderer: {
          type: LockAt
        }
      },
      {
        header: '계정만료일시',
        name: 'accountExpiredDt',
        minWidth: 150,
        align: 'center',
        sortable: true
      },
      {
        header: '최근 로그인ID',
        name: 'lastLoginIp',
        minWidth: 120
      },
      {
        header: '최근 로그인일시',
        name: 'lastLoginDt',
        minWidth: 150,
        align: 'center',
        sortable: true
      },
      {
        header: '사용여부',
        name: 'useAt',
        minWidth: 120,
        sortable: true,
        renderer: {
          type: UseAt
        }
      },
      {
        header: '회사',
        name: 'corpNm',
        minWidth: 120,
        sortable: true
      },
      {
        header: '물류센터',
        name: 'lcNm',
        minWidth: 120,
        sortable: true
      },
      {
        header: '부서',
        name: 'orgNm',
        minWidth: 120,
        sortable: true
      },
      {
        header: '사번',
        name: 'empNo',
        minWidth: 120,
        sortable: true
      },
      {
        header: '거래처',
        name: 'bpNm',
        minWidth: 120,
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
    menu = menu.filter( menu => menu.menuNm === '사용자관리' );

    menuauth.value.regPermAt = menu[0].regPermAt;
    menuauth.value.modPermAt = menu[0].modPermAt;
    menuauth.value.delPermAt = menu[0].delPermAt;
    menuauth.value.execPermAt = menu[0].execPermAt;
  }

  function selectBoxData() {
    userTypeList.value = ( userStore.commomCode ).filter( code => code.cgId === 'S01' );
    userExtUserAtList.value = ( userStore.commomCode ).filter( code => code.cgId === 'S02' );
  }

  function userData() {
    axios.post( '/api/v1/users/'
              , { accountName: userNmSearch.value, active: userActiveSearch.value, accountType: userTypeSearch.value, extUserAt: userExtUserAtSearch.value }
              , { headers : { Authorization : userStore.AccessToken } } )
    .then( res => {
      if( res.data.code == 0 ) {
        if( res.data.count > 0 ) {
          userInstance.resetData( res.data.result );
        } else  {
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

  function userInactive() {
    if( clickRow.value == null ) {
      Notify.create({
        type: 'info',
        message: '비활성화할 사용자를 선택해주세요',
        timeout: 600,
        position: 'center'
      })
    } else {
      let userId = userInstance.getValue( clickRow.value, 'accountId');

      Dialog.create({
        title: '비활성화',
        message: userId + '을 비활성화 하시겠습니까?',
        ok: {
            push: true,
            label: '비활성화',
            color: 'accent'
        },
        cancel: {
        push: true,
        label: '취소',
        },
        persistent: true
      }).onOk(() => {
        let userUid = userInstance.getValue( clickRow, 'userUid');

        axios.post( '/api/v1/users/inactive'
                  , { userUid: userUid }
                  , { headers : { Authorization : userStore.AccessToken } } )
        .then( res => {
          if( res.data.code == 0 ) {
            Notify.create({
              type: 'positive',
              message: '사용자가 비활성화 되었습니다.',
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

  function userDisable() {
    if( clickRow.value == null ) {
      Notify.create({
        type: 'negative',
        message: '선택된 사용자가 없습니다.',
        timeout: 600
      })
    } else {
      let userId = userInstance.getValue( clickRow.value, 'accountId');

      Dialog.create({
        title: '사용중지',
        message: userId + '을 사용중지 시키시겠습니까?',
        ok: {
            push: true,
            label: '사용중지',
            color: 'accent'
        },
        cancel: {
        push: true,
        label: '취소',
        },
        persistent: true
      }).onOk(() => {
        let userUid = userInstance.getValue( clickRow, 'userUid');

        axios.post( '/api/v1/users/disable'
                  , { userUid: userUid }
                  , { headers : { Authorization : userStore.AccessToken } } )
        .then( res => {
          if( res.data.code == 0 ) {
            Notify.create({
              type: 'positive',
              message: '사용중지 처리되었습니다.',
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

  function userRemove() {
    if( clickRow.value == null ) {
      Notify.create({
        type: 'negative',
        message: '선택된 사용자가 없습니다.',
        timeout: 600
      })
    } else {
      let userId = userInstance.getValue( clickRow.value, 'accountId');

      Dialog.create({
        title: '영구삭제',
        message: userId + '을 영구삭제 하시겠습니까?',
        ok: {
            push: true,
            label: '영구삭제',
            color: 'accent'
        },
        cancel: {
        push: true,
        label: '취소',
        },
        persistent: true
      }).onOk(() => {
        let userUid = userInstance.getValue( clickRow.value, 'userUid');

        axios.post( '/api/v1/users/remove'
                  , { userUid: userUid }
                  , { headers : { Authorization : userStore.AccessToken } } )
        .then( res => {
          if( res.data.code == 0 ) {
            Notify.create({
              type: 'positive',
              message: '사용자가 영구삭제되었습니다.',
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

  function userReg() {
    router.push( {
      path: "/system/security/accountDtl",
      state: {
        data : {
          userUid: null,
          userNm: userNmSearch.value,
          userActive: userActiveSearch.value,
          userType: userTypeSearch.value,
          userExtUserAt: userExtUserAtSearch.value
        }
      }
    })
  }

  function userInfoDtl( row ) {

    if( row == null ) {
      Notify.create({
        type: 'negative',
        message: '선택된 사용자가 없습니다.',
        timeout: 600
      })
    } else {
      let uid = userInstance.getValue( row, 'userUid' );

      router.push( {
        path: "/system/security/accountDtl",
        state: {
          data : {
            userUid: uid,
            userNm: userNmSearch.value,
            userActive: userActiveSearch.value,
            userType: userTypeSearch.value,
            userExtUserAt: userExtUserAtSearch.value
          }
        }
      })
    }
  }

  onMounted( () => {
    if( history.state.data ) {
      userNmSearch.value = history.state.data.userNm;
      userActiveSearch.value = history.state.data.userActive;
      userTypeSearch.value = history.state.data.userType;
      userExtUserAtSearch.value = history.state.data.userExtUserAt;
    }

    selectMenuAuth()
    selectBoxData()
    userData()

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

    userInstance.on( 'dblclick', ( ev ) => {
      userInfoDtl( ev.rowKey )
      if ( ev.targetType == 'cell' ) {
        userInfoDtl( ev.rowKey )
      }
    })

    userInstance.on( 'click', ( ev ) => {
      if ( ev.targetType == 'cell' ) {
        if( clickRow.value == ev.rowKey ) {
          userInstance.removeRowClassName( ev.rowKey, 'row-click-yellow' );
          clickRow.value = null;
          return;
        }

        clickRow.value = ev.rowKey;

        for( let i = 0; i<userInstance.getRowCount(); i++ ) {
          userInstance.removeRowClassName( i, 'row-click-yellow' )
        }

        userInstance.addRowClassName( ev.rowKey, 'row-click-yellow' );
      }
    })
  })
</script>
