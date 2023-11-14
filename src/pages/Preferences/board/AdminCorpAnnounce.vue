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
          <q-breadcrumbs-el label="게시판관리" icon="edit_note" class="text-grey-7"/>
          <q-breadcrumbs-el label="사내 공지사항 관리" icon="feed" class="text-blue-10"/>
      </q-breadcrumbs>
    </div>

    <div class="row q-py-lg">
      <div class="text-h5 text-weight-bolder">
        <q-icon name="feed" />
        &nbsp;<span>사내 공지사항 관리</span>
      </div>
    </div>

    <div>
      <q-card class="my-card shadow-3" style="height:800px;">
        <q-toolbar class="shadow-2" style="height: 50px;">
          <div class="text-h6 q-pa-md text-weight-bold">
            사내 공지사항 관리
          </div>

          <q-space></q-space>

          <q-btn
            v-if="menuauth.regPermAt == true"
            flat stretch
            icon="add"
            @click="goCorpAnnoDtlReg"
          >
            <q-tooltip>
              등록
            </q-tooltip>
          </q-btn>

          <q-btn
            v-if="menuauth.modPermAt == true"
            flat stretch
            icon="edit"
            @click="goCorpAnnoDtlMod"
          >
            <q-tooltip>
              수정
            </q-tooltip>
          </q-btn>

          <q-btn
            v-if="menuauth.delPermAt == true"
            flat stretch
            icon="delete"
            @click="corpAnnoDel"
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
                v-model="corpAnnoSearch"
                @keyup.enter="loadData"
                placeholder="제목 또는 내용"
              />
            </div>
            <div class="col-lg-2">
              <q-select
                dense square outlined
                v-model="annoCategory"
                :options="annoCategoryList"
                option-value="cd"
                option-label="cdNm"
                emit-value
                map-options
              >
                <template v-if="annoCategory" v-slot:append>
                  <q-icon name="cancel" @click.stop.prevent="annoCategory = ''" class="cursor-pointer"></q-icon>
                </template>
                <template v-if="annoCategory == ''" v-slot:selected>
                  <div class="text-grey-6">분류 선택</div>
                </template>
              </q-select>
            </div>

            <div class="col-lg-2">
              <q-input dense square outlined v-model="beginDate" placeholder="게시시작일">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="beginDate" mask="YYYY-MM-DD" minimal>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="선택" color="primary" flat></q-btn>
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>

            <div class="col-lg-2">
              <q-input dense square outlined v-model="endDate" placeholder="게시종료일">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="endDate" mask="YYYY-MM-DD" :options="dateOptions" minimal>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="선택" color="primary" flat></q-btn>
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
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
            ref="corpAnnoTable"
            :options="corpAnnoOptions.options"
            :columns="corpAnnoOptions.columns"
            :data="corpAnnoOptions.data"
          />
        </div>

        <div class="q-pa-sm flex flex-center">
          <q-pagination
            v-model="clickPage"
            :max="pageSize"
            input
            color="indigo-8"
            @update:model-value="loadData"
          />
        </div>
      </q-card>
    </div>

    <q-dialog v-model="fileDialogAt" persistent>
      <q-card style="width: 800px; max-width: 80vw;">
        <q-card-section>
          <div class="text-h6 text-weight-bold">첨부파일 다운로드</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <TuiGrid
            ref="fileTable"
            :columns="fileOptions.columns"
            :data="fileOptions.data"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="닫기" v-close-popup></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
  import { useUserStore } from 'src/stores/example-store';
  import { Notify, date, Dialog } from 'quasar';
  import { ref, onMounted, watch } from 'vue';
  import fileDownLoad from 'js-file-download';
  import { TuiGrid } from "vue3-tui-grid";
  import { useRouter } from 'vue-router';
  import axios from 'axios';

  const userStore = useUserStore();
  const router = useRouter();

  // 현재 메뉴에 대한 권한
  let menu = null;
  const menuauth = ref({
    regPermAt: '', // 등록권한
    modPermAt: '', // 수정권한
    delPermAt: '', // 삭제권한
    execPermAt: '', // 실행권한
  });

  const corpAnnoSearch = ref('');
  const annoCategory = ref('');
  const annoCategoryList = ref([]);
  const beginDate = ref('');
  const endDate = ref('');
  const clickNttUid = ref('');
  const clickRow = ref(null);
  const clickPage = ref(1);
  const pageSize = ref(0);
  const dataTotalCount = ref(0);
  const fileDialogAt = ref(false);

  class fileDailogButton {
    constructor(props) {
      const el = document.createElement('span');

      el.addEventListener('click', ( ev ) => {
        fileDialogAt.value = true;

        corpAnnoFile( props.value )

        console.log(props)
      });

      this.el = el;
      this.render(props);
    }

    getElement() {
      return this.el;
    }

    render(props) {
      if( props.value != null ) {
        if( ( props.value ).length > 0 ) {
          this.el.className = "material-icons";
          this.el.innerHTML = "attach_file";
          this.el.style = "font-size:20px;"
        }
      }
    }
  }

  class fileDownButton {
    constructor(props) {
      const el = document.createElement('input');

      el.type = 'button';

      el.addEventListener('click', ( ev ) => {
        let data = fileInstance.getRow( props.rowKey );

        axios.get( `/api/v1/bbs/download/attachedFile/${data.atchFileId}/${data.fileSn}`
            , { headers : { Authorization : userStore.AccessToken }, responseType: 'blob' } )
        .then( res => {
          const extractDownloadFilename = (res) => {
              const disposition = res.headers["content-disposition"];
              const fileName = decodeURI(
              disposition
                .match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)[1]
                .replace(/['"]/g, "")
              );
              return fileName;
          };

          fileDownLoad( res.data, extractDownloadFilename(res) )
        })
        .catch( error => {
          Notify.create({
            type: 'negative',
            message: 'API를 호출하는 도중 에러가 발생했습니다.',
            timeout: 600
          })
        })
      });

      this.el = el;
      this.render(props);
    }

    getElement() {
      return this.el;
    }

    render(props) {
      this.el.value = '다운로드'
      this.el.style = "border: none; background-color: #47C83E; padding: 0.3rem 0.3rem; border-radius: 4px; color: #ffffff"
    }
  }

  class topLockAt {
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

  const corpAnnoTable = ref('');
  let corpAnnoGrid = null;
  let corpAnnoInstance = null;
  const corpAnnoOptions = ref({
    options: {
      header: {
        height: 70,
        complexColumns: [
          {
            header: '게시일',
            name: 'date',
            childNames: ['pubBeginDate', 'pubEndDate']
          }
        ]
      }
    },
    columns: [
      {
        header: 'No',
        name: 'nttUid',
        minWidth: 50,
        align: 'right',
        sortable: true
      },
      {
        header: '분류',
        name: 'nttCategoryNm',
        minWidth: 100,
        sortable: true
      },
      {
        header: '제목',
        name: 'nttSubject',
        minWidth: 500,
        sortable: true
      },
      {
        header: '조회',
        name: 'readCount',
        minWidth: 100,
        align: 'right',
        sortable: true
      },
      {
        header: '작성일시',
        name: 'writeDt',
        minWidth: 150,
        align: 'center',
        sortable: true
      },
      {
        header: '작성자',
        name: 'writerId',
        minWidth: 120,
        sortable: true
      },
      {
        header: '첨부파일',
        name: 'attachFiles',
        minWidth: 100,
        align: 'center',
        renderer: {
          type: fileDailogButton
        }
      },
      {
        header: '상단고정여부',
        name: 'topLockAt',
        minWidth: 100,
        sortable: true,
        renderer: {
          type: topLockAt
        }
      },
      {
        header: '시작일',
        name: 'pubBeginDate',
        minWidth: 120,
        align: 'center',
        sortable: true
      },
      {
        header: '종료일',
        name: 'pubEndDate',
        minWidth: 120,
        align: 'center',
        sortable: true
      }
    ],
    data: []
  })

  const fileTable = ref('');
  let fileGrid = null;
  let fileInstance = null;
  const fileOptions = ref({
    columns: [
      {
        header: 'No',
        name: 'fileSn',
        minWidth: 80
      },
      {
        header: '첨부파일',
        name: 'originalFileNm',
        minWidth: 400
      },
      {
        header: '파일크기',
        name: 'fileSize',
        minWidth: 100,
        align: 'right'
      },
      {
        header: '다운로드',
        minWidth: 120,
        align: 'center',
        renderer: {
          type: fileDownButton
        }
      }
    ],
    data: []
  })

  // 권한 가져오기
  function selectMenuAuth() {
    menu = userStore.MenuAuthority;
    menu = menu.filter( menu => menu.menuNm === '사내공지사항관리' );

    menuauth.value.regPermAt = menu[0].regPermAt;
    menuauth.value.modPermAt = menu[0].modPermAt;
    menuauth.value.delPermAt = menu[0].delPermAt;
    menuauth.value.execPermAt = menu[0].execPermAt;
  }

  function dateOptions( data ) {
    let value = date.formatDate(  beginDate.value, 'YYYY/MM/DD');

    return data >= value;
  }

  function selextBoxData() {
    annoCategoryList.value = ( userStore.commomCode ).filter( code => code.cgId === 'C01' );
    // rowcountPerPage.value = ( ( data.value ).filter( data => data.envKey === 'rowcount-per-page' ) )[0];

    let newdate = new Date();
    beginDate.value = date.formatDate( date.subtractFromDate( newdate, { days: 7 } ), 'YYYY-MM-DD'); // 현재날짜 - 7일
    endDate.value = date.formatDate( date.addToDate( newdate, { days: 7 } ), 'YYYY-MM-DD'); // 현재날짜 +7일
  }

  function loadData() {
    axios.get( `/api/v1/bbs/manage/IA?nttCategory=${annoCategory.value}&searchWord=${corpAnnoSearch.value}&pageNumber=${clickPage.value}&rowCountPerPage=${userStore.rowPerPage}`
            , { headers : { Authorization : userStore.AccessToken } } )
    .then( res => {
      if( res.data.code == 0 ) {
        if( res.data.count > 0 ) {
          corpAnnoInstance.resetData( res.data.result );

          clickPage.value = res.data.page;
          pageSize.value = res.data.pageSize;
          dataTotalCount.value = res.data.totalCount;
        } else if(res.data.count < 1 ) {
          corpAnnoInstance.resetData( [] );

          clickPage.value = res.data.page;
          pageSize.value = res.data.pageSize;
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

  function goCorpAnnoDtlMod() {
    if( clickNttUid.value == null
      || clickNttUid.value == '' ) {
      Notify.create({
        type: 'info',
        message: '수정할 공지사항을 선택해주세요.',
        timeout: 600,
        position: 'center'
      })
    } else {
      router.push( {
        path: "/system/board/corpAnnounceMod",
        state: {
          data : {
            clickNttUid: clickNttUid.value,
            corpInfromSearch: corpAnnoSearch.value,
            infoCategory: annoCategory.value,
            beginDate: beginDate.value,
            endDate: endDate.value
          }
        }
      })
    }
  }

  function goCorpAnnoDtlReg() {
    router.push( {
      path: "/system/board/corpAnnounceReg",
      state: {
        data : {
          clickNttUid: clickNttUid.value,
          corpInfromSearch: corpAnnoSearch.value,
          infoCategory: annoCategory.value,
          beginDate: beginDate.value,
          endDate: endDate.value
        }
      }
    })
  }

  function corpAnnoDel() {
    if( clickNttUid.value == null
      || clickNttUid.value == '' ) {
      Notify.create({
        type: 'info',
        message: '삭제할 공지사항을 선택해주세요.',
        timeout: 600,
        position: 'center'
      })
    } else {
      Dialog.create({
        title: '공지사항 삭제',
        message: '공지사항을 삭제 하시겠습니까?',
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
        axios.post( `/api/v1/bbs/manage/remove/IA`
                    , { nttUid: clickNttUid.value }
                    , { headers : { Authorization : userStore.AccessToken } } )
        .then( res => {
          if( res.data.code == 0 ) {
            Notify.create({
              type: 'positive',
              message: '공지사항이 삭제되었습니다.',
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
      })
    }
  }

  function corpAnnoFile( data ) {
    watch( () => fileTable.value, () => {
      console.log(data)

      if( fileTable.value != ''
       && fileTable.value != null ) {
        fileGrid = fileTable.value;
        fileInstance = fileGrid.gridInstance;

        fileGrid.applyTheme( "clean" );
        fileInstance.setBodyHeight( 300 );

        fileInstance.resetData( data )
      }
    })
  }

  onMounted( () => {
    if( history.state.data ) {
      corpAnnoSearch.value = history.state.data.corpInfromSearch;
      annoCategory.value = history.state.data.infoCategory;
      beginDate.value = history.state.data.beginDate;
      endDate.value = history.state.data.endDate;
    }

    selectMenuAuth()
    selextBoxData()
    loadData()

    corpAnnoGrid = corpAnnoTable.value;
    corpAnnoInstance = corpAnnoGrid.gridInstance;

    corpAnnoGrid.applyTheme( "clean", {
      cell: {
        header: {
          background: '#dee7f7'
        },
      }
    });
    corpAnnoInstance.setBodyHeight( 530 );

    corpAnnoGrid.setLanguage('ko', {
      display: {
        noData: '데이터가 없습니다.',
        loadingData: '데이터가 로딩중입니다.'
      }
    });

    corpAnnoInstance.on( 'click', ( ev ) => {
      if( ev.targetType == 'cell' ) {
        if( clickRow.value == ev.rowKey ) {
          corpAnnoInstance.removeRowClassName( ev.rowKey, 'row-click-yellow' );
          clickRow.value = null;
          clickNttUid.value = null;
          return;
        }

        clickRow.value = ev.rowKey;

        for( let i = 0; i<corpAnnoInstance.getRowCount(); i++ ) {
          corpAnnoInstance.removeRowClassName( i, 'row-click-yellow' )
        }

        corpAnnoInstance.addRowClassName( ev.rowKey, 'row-click-yellow' );

        clickNttUid.value = corpAnnoInstance.getValue( ev.rowKey, 'nttUid' );
      }
    });
  })
</script>
