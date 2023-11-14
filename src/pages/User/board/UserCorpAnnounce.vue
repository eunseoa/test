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
          <q-breadcrumbs-el label="커뮤니티" class="text-grey-7"/>
          <q-breadcrumbs-el label="사내 공지사항" icon="newspaper" class="text-cyan-10"/>
      </q-breadcrumbs>
    </div>

    <div class="row q-py-lg">
      <div class="text-h5 text-weight-bolder">
        <q-icon name="feed" />
        &nbsp;<span>사내 공지사항</span>
      </div>
    </div>

    <div>
      <q-card class="my-card shadow-3" style="height: 700px;">
        <q-toolbar class="shadow-2">
          <div class="text-h6 q-pa-md text-weight-bold">
            사내 공지사항
          </div>
        </q-toolbar>

        <q-separator />

        <q-card-section>
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

            <div class="col-lg-1">
              <q-btn
                label="조회"
                color="indigo-7"
                @click="loadData"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="row text-center">
            <div class="col-lg-1">
              <span class="text-weight-bold">#</span>
            </div>

            <div class="col-lg-1">
              <span class="text-weight-bold">분류</span>
            </div>

            <div class="col-lg-5">
              <span class="text-weight-bold">제목</span>
            </div>

            <div class="col-lg-1">
              <span class="text-weight-bold">첨부파일</span>
            </div>

            <div class="col-lg-1">
              <span class="text-weight-bold">조회</span>
            </div>

            <div class="col-lg-1">
              <span class="text-weight-bold">작성일</span>
            </div>

            <div class="col-lg-2">
              <span class="text-weight-bold">작성자</span>
            </div>
          </div>
        </q-card-section>

        <q-scroll-area style="height: 430px;">
          <div class="q-pt-none">
            <q-list v-for="corp in corpAnnoList">
              <q-separator spaced inset />

              <q-card-section class="q-py-sm">
                <div class="row">
                  <div class="col-lg-1 text-center">
                    <span>
                      {{ corp.nttUid }}
                    </span>
                  </div>

                  <div class="col-lg-1 text-center">
                    {{ corp.nttCategoryNm }}
                  </div>

                  <div class="col-lg-5 div-overflow">
                    <span v-if="corp.topLockAt == 'Y'" class="text-purple">
                      <q-icon
                        name="campaign"
                        size="xs"
                      /> &nbsp;
                    </span>
                    <span @click="goCorpAnnoDtl( corp.nttUid )">
                      {{ corp.nttSubject }}
                    </span>
                  </div>

                  <div class="col-lg-1 text-center">
                    <span v-if="corp.attachFiles != null" class="q-pt-none">
                      <q-btn
                        v-if="corp.attachFiles.length > 0"
                        padding="none"
                        flat round
                        icon="attach_file"
                        size="sm"
                        color="teal-7"
                        @click="fileDialogAt = true, corpAnnoFile( corp.attachFiles )"
                      />
                    </span>
                  </div>

                  <div class="col-lg-1 text-center">
                    <span>
                      {{ corp.readCount }}
                    </span>
                  </div>

                  <div class="col-lg-1 text-center">
                    <span>
                      {{ corp.writeDt }}
                    </span>
                  </div>

                  <div class="col-lg-2 text-center div-overflow">
                    <span>
                      {{ corp.writerId }}
                    </span>
                  </div>
                </div>
              </q-card-section>
            </q-list>
          </div>
        </q-scroll-area>

        <div class="q-pa-sm flex flex-center">
          <q-pagination
            v-model="clickPage"
            :max="pageSize"
            input
            color="indigo-8"
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
  import { ref, onMounted, watch } from 'vue';
  import fileDownLoad from 'js-file-download';
  import { Notify, Dialog } from 'quasar';
  import { TuiGrid } from "vue3-tui-grid";
  import { useRouter } from 'vue-router';
  import axios from 'axios';

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

  const userStore = useUserStore();
  const router = useRouter();

  const corpAnnoSearch = ref('');
  const annoCategory = ref('');
  const annoCategoryList = ref([]);
  const corpAnnoList = ref([]);

  const clickPage = ref(1);
  const pageSize = ref(0);
  const fileDialogAt = ref(false);
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

  function selextBoxData() {
    annoCategoryList.value = ( userStore.commomCode ).filter( code => code.cgId === 'C01' );
  }

  function loadData() {
    axios.get( `/api/v1/bbs/IA?nttCategory=${annoCategory.value}&searchWord=${corpAnnoSearch.value}&pageNumber=${clickPage.value}&rowCountPerPage=${userStore.rowPerPage}`
            , { headers : { Authorization : userStore.AccessToken } } )
    .then( res => {
      if( res.data.code == 0 ) {
        corpAnnoList.value = res.data.result;

        clickPage.value = res.data.page;
        pageSize.value = res.data.pageSize;
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

  function corpAnnoFile( data ) {
    watch( () => fileTable.value, () => {

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

  function goCorpAnnoDtl( nttUid ) {
    router.push( {
      path: "/user/board/corpAnnounceDtl",
      state: {
        data : {
          clickNttUid: nttUid,
          corpAnnoSearch: corpAnnoSearch.value,
          annoCategory: annoCategory.value
        }
      }
    })
  }

  onMounted( () => {
    if( history.state.data ) {
      corpAnnoSearch.value = history.state.data.corpAnnoSearch;
      annoCategory.value = history.state.data.annoCategory;
    }

    selextBoxData()
    loadData()
  })
</script>

<style lang="css">
  .div-overflow {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
