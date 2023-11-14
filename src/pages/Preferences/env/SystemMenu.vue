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
          <q-breadcrumbs-el label="시스템설정" icon="settings_suggest" class="text-grey-7"/>
          <q-breadcrumbs-el label="메뉴관리" icon="widgets" class="text-blue-10"/>
      </q-breadcrumbs>
    </div>

    <div class="row q-py-lg">
      <div class="text-h5 text-weight-bolder">
        <q-icon name="widgets"></q-icon>
        &nbsp;<span>시스템메뉴관리</span>
      </div>
    </div>

    <div>
      <q-card class="my-card shadow-3">
        <q-card-section>
          <div class="row q-gutter-sm">
            <div>
              <q-input dense class="input" placeholder="메뉴명 검색">
                <template v-slot:append>
                  <q-btn round dense flat icon="search"></q-btn>
                </template>
              </q-input>
            </div>
          </div>

          <div class="row q-pt-md">
            <div>
              <q-btn outline color="indigo-5" label="페이지 정보 추가" @click="pageRouterDialog = true"/>
              <q-btn outline color="deep-purple-3" label="메뉴 추가" @click="menuDialog = true"/>
            </div>
          </div>
        </q-card-section>
        <div class="q-pb-sm">
          <TuiGrid ref="menuTable" :options="menuOptions.options" :columns="menuOptions.columns" :data="menuOptions.data" />
        </div>
      </q-card>
    </div>

    <q-dialog v-model="pageRouterDialog" persistent>
      <q-card style="width: 800px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6 text-weight-bold">페이지 정보 추가</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <table class="pageRouterTbl" cellspacing="20">
            <tr>
              <td><span style="color: red;">* &nbsp;</span>경로 이름</td>
              <td>
                <q-input dense square outlined />
              </td>

              <td><span style="color: red;">* &nbsp;</span>URL 경로</td>
              <td>
                <q-input dense square outlined />
              </td>
            </tr>

            <tr>
              <td><span style="color: red;">* &nbsp;</span>페이지명</td>
              <td>
                <q-input dense square outlined />
              </td>

              <td><span style="color: red;">* &nbsp;</span>페이지 경로</td>
              <td>
                <q-input dense square outlined />
              </td>
            </tr>

            <tr>
              <td>리다이렉트 사용여부</td>
              <td>
                <div class="q-gutter-sm">
                  <q-radio v-model="redirectYn" val="Y" label="사용함" color="blue-8"></q-radio>
                  <q-radio v-model="redirectYn" val="N" label="미사용" color="red-8"></q-radio>
                </div>
              </td>

              <td>리다이렉트 경로</td>
              <td>
                <q-input dense square outlined />
              </td>
            </tr>

            <tr>
              <td>파라미터 사용여부</td>
              <td>
                <div class="q-gutter-sm">
                  <q-radio v-model="redirectYn" val="Y" label="사용함" color="blue-8"></q-radio>
                  <q-radio v-model="redirectYn" val="N" label="미사용" color="red-8"></q-radio>
                </div>
              </td>

              <td>부모 페이지 ID</td>
              <td>
                <q-input dense square outlined />
              </td>
            </tr>

            <tr>
              <td>인증필요여부</td>
              <td>
                <div class="q-gutter-sm">
                  <q-radio v-model="redirectYn" val="Y" label="사용함" color="blue-8"></q-radio>
                  <q-radio v-model="redirectYn" val="N" label="미사용" color="red-8"></q-radio>
                </div>
              </td>

              <td>사용여부</td>
              <td>
                <div class="q-gutter-sm">
                  <q-radio v-model="redirectYn" val="Y" label="사용함" color="blue-8"></q-radio>
                  <q-radio v-model="redirectYn" val="N" label="미사용" color="red-8"></q-radio>
                </div>
              </td>
            </tr>
          </table>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="취소" v-close-popup></q-btn>
          <q-btn flat label="등록" v-close-popup></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="menuDialog" persistent>
      <q-card style="width: 800px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6 text-weight-bold">페이지 정보 추가</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <table class="pageRouterTbl" cellspacing="20">
            <tr>
              <td><span style="color: red;">* &nbsp;</span>메뉴명</td>
              <td>
                <q-input dense square outlined />
              </td>

              <td><span style="color: red;">* &nbsp;</span>메뉴 약식명</td>
              <td>
                <q-input dense square outlined />
              </td>
            </tr>

            <tr>
              <td><span style="color: red;">* &nbsp;</span>메뉴코드</td>
              <td>
                <q-input dense square outlined />
              </td>

              <td><span style="color: red;">* &nbsp;</span>부모</td>
              <td>
                <q-input dense square outlined />
              </td>
            </tr>

            <tr>
              <td>리다이렉트 사용여부</td>
              <td>
                <div class="q-gutter-sm">
                  <q-radio v-model="redirectYn" val="Y" label="사용함" color="blue-8"></q-radio>
                  <q-radio v-model="redirectYn" val="N" label="미사용" color="red-8"></q-radio>
                </div>
              </td>

              <td>리다이렉트 경로</td>
              <td>
                <q-input dense square outlined />
              </td>
            </tr>

            <tr>
              <td>파라미터 사용여부</td>
              <td>
                <div class="q-gutter-sm">
                  <q-radio v-model="redirectYn" val="Y" label="사용함" color="blue-8"></q-radio>
                  <q-radio v-model="redirectYn" val="N" label="미사용" color="red-8"></q-radio>
                </div>
              </td>

              <td>부모 페이지 ID</td>
              <td>
                <q-input dense square outlined />
              </td>
            </tr>

            <tr>
              <td>인증필요여부</td>
              <td>
                <div class="q-gutter-sm">
                  <q-radio v-model="redirectYn" val="Y" label="사용함" color="blue-8"></q-radio>
                  <q-radio v-model="redirectYn" val="N" label="미사용" color="red-8"></q-radio>
                </div>
              </td>

              <td>사용여부</td>
              <td>
                <div class="q-gutter-sm">
                  <q-radio v-model="redirectYn" val="Y" label="사용함" color="blue-8"></q-radio>
                  <q-radio v-model="redirectYn" val="N" label="미사용" color="red-8"></q-radio>
                </div>
              </td>
            </tr>
          </table>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn flat label="취소" v-close-popup></q-btn>
          <q-btn flat label="등록" v-close-popup></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="routerSelect" persistent>
      <q-card class="my-card" style="width: 800px; max-width: 80vw;">
        <q-card-section>
          <TuiGrid ref="routerTable" :options="routerOptions.options" :columns="routerOptions.columns" :data="routerOptions.data"/>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="취소" v-close-popup></q-btn>
          <q-btn flat label="선택" @click="routerCheck"></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
  import { useUserStore } from 'src/stores/example-store';
  import { ref, onMounted } from 'vue';
  import { TuiGrid } from "vue3-tui-grid";
  import axios from 'axios';

  const userStore = useUserStore();

  const menuTable = ref();
  const routerTable = ref();
  let menuGrid = null;
  let routerGrid = null;

  const pageRouterDialog = ref(false);
  const menuDialog = ref(false)
  const routerSelect = ref(false)

  let menu = null;

  // 현재 메뉴에 대한 권한
  const menuAuth = ref({
    regPermAt: '', // 등록권한
    modPermAt: '', // 수정권한
    delPermAt: '', // 삭제권한
    execPermAt: '', // 실행권한
  })

  const menuOptions = ref({
    columns: [
      {
        header: '메뉴명',
        name: 'menuShortNm',
        editor: 'text'
      },
      {
        header: '메뉴코드',
        name: 'menuCd'
      },
      {
        header: 'URL 경로',
        name: 'toPath'
      },
      {
        header: '메뉴타입',
        name: 'menuType',
        copyOptions: {
          useListItemText: true
        },
        formatter: 'listItemText',
        editor: {
          type: 'select',
          options: {
            listItems: [
              { text: '메뉴분류', value: 'S' },
              { text: '디렉토리', value: 'D' },
              { text: '메뉴', value: 'M' }
            ]
          }
        }
      },
      {
        header: '사용여부',
        name: 'useAt',
        copyOptions: {
          useListItemText: true
        },
        formatter: 'listItemText',
        editor: {
          type: 'radio',
          useViewMode: false,
          options: {
            useViewMode: false,
            listItems: [
              { text: '사용중', value: 'Y' },
              { text: '미사용', value: 'N' },
            ]
          }
        }
      }
    ],
    options: {
      treeColumnOptions: {
        name: 'menuShortNm',
        useIcon: false
      },
    },
    data: []
  });

  class CheckboxRenderer {
    constructor(props) {
      const hiddenInput = document.createElement('input');
      hiddenInput.className = 'hidden-input';

      hiddenInput.type = 'checkbox';
      hiddenInput.addEventListener('click', (ev) => {
        if( this.el.checked ) {

          const check = document.getElementsByClassName( "hidden-input" );

          for( let i = 0; i<check.length; i++) {
            check[i].checked = false;
          }

          this.el.checked = true;
        }
      });

      this.el = hiddenInput;
    }

    getElement() {
      return this.el;
    }
  }

  const routerOptions = ref({
    columns: [
      {
        header: '메뉴명',
        name: 'menuShortNm',
      },
      {
        header: '아이디',
        name: 'menuCd',
        hidden: true
      }
    ],
    options: {
      rowHeaders: [
      {
        type: 'checkbox',
        header: ``,
        renderer: {
          type: CheckboxRenderer
        }
      }
      ]
    },
    data: [
      {
        menuShortNm: "aa"
      },
      {
        menuShortNm: "aa"
      }
    ]
  })


  async function loadData() {
    await axios.get( '/api/v1/menu/', { headers : { Authorization : userStore.AccessToken } } )
    .then( res => {
      menuGrid.gridInstance.resetData( res.data.result );
    })
  }

  // 권한 가져오기
  function selectMenuAuth() {
    menu = userStore.MenuAuthority;
    menu = menu.filter( menu => menu.menuNm === '시스템환경설정' );

    menuAuth.value.regPermAt = menu.regPermAt;
    menuAuth.value.modPermAt = menu.modPermAt;
    menuAuth.value.delPermAt = menu.delPermAt;
    menuAuth.value.execPermAt = menu.execPermAt;
  }

  // 선택한 rowkey
  let clickRow = null;

  onMounted( () => {
    selectMenuAuth();

    menuGrid = menuTable.value;
    menuGrid.applyTheme( "clean" );
    menuGrid.setLanguage( "ko" );

    loadData();

    menuGrid.gridInstance.on( 'dblclick', ( ev ) => {
      routerSelect.value = true
      clickRow = ev.rowKey
    });
  })

  function routerCheck() {
    routerGrid = routerTable.value;

    let row = routerGrid.gridInstance.getCheckedRows();

    console.log(row)

    // menuGrid.gridInstance.setValue( clickRow, 'toPath', row[0].menuShortNm, false )

    // routerSelect.value = false
  }
</script>


<style lang="css">
  .pageRouterTbl {
    width: 100%
  }
</style>
