<template>
  <q-page class="q-pl-sm q-pr-sm q-pb-sm">
    <div class="row q-pt-sm">
      <q-breadcrumbs>
          <q-breadcrumbs-el label="home" icon="home" to="/main" class="text-grey"></q-breadcrumbs-el>
          <q-breadcrumbs-el label="커뮤니티" class="text-grey"></q-breadcrumbs-el>
          <q-breadcrumbs-el label="사내 공지사항" icon="feed"></q-breadcrumbs-el>
      </q-breadcrumbs>
    </div>

    <div class="row q-py-lg">
      <div class="text-h5 text-weight-bolder">
        <q-icon name="feed" />
        &nbsp;<span>사내 공지사항</span>
      </div>
    </div>

    <div>
      <q-card style="min-height: 100%;">
        <q-card-section>
          <div class="text-h5 text-weight-bold q-pa-sm" ref="subjectDiv">
            {{ bbsInfo.nttSubject }}
          </div>
        </q-card-section>

        <q-card-section>
          <div class="q-pb-md">
            <div style="float: left;">
              <span class="text-indigo-9 text-weight-bold">
                구분: &nbsp;
              </span>
              {{ bbsInfo.nttCategoryNm }}
            </div>

            <div style="float: right">
              <span class="text-indigo-9 text-weight-bold">
                작성일: &nbsp;
              </span>
              {{ bbsInfo.writeDt }}

              &nbsp;&nbsp;&nbsp;

              <span class="text-indigo-9 text-weight-bold">
                조회수: &nbsp;
              </span>
              {{ bbsInfo.readCount }}
            </div>
          </div>
        </q-card-section>

        <q-separator inset color="indigo-8"/>

        <q-card-section>
          <q-scroll-area style="height: 430px;">
            <div ref="viewer"></div>
          </q-scroll-area>
        </q-card-section>

        <div v-if="bbsFiles != null">
          <div v-if="bbsFiles.length > 0">
            <q-card-section>
              <span class="text-indigo-9 text-weight-bold">
                첨부파일
              </span>
            </q-card-section>

            <q-separator inset color="indigo-8"/>

            <q-card-section>
              <q-list bordered class="rounded-borders" >
                <q-scroll-area style="height: 140px; border-right: 1px solid #ddd">
                  <div v-for="file in bbsFiles" :key="file.atchFileId">
                    <q-item>
                      <q-item-section top class="gt-sm">
                        <div>
                          <q-btn
                            flat dense round
                            class="gt-xs"
                            size="12px"
                            icon="cloud_download"
                            color="deep-purple-8"
                            @click="fileDown( file.atchFileId, file.fileSn )"
                          />
                          <span class="q-ml-md text-weight-medium text-primary text-uppercase">
                            {{ file.originalFileNm }}
                          </span>
                        </div>
                      </q-item-section>
                    </q-item>
                  </div>
                </q-scroll-area>
              </q-list>
            </q-card-section>
          </div>
        </div>

        <q-card-section class="flex flex-center">
          <q-btn
            outline
            label="목록"
            color="indigo-9"
            @click="goCorpAnnoList"
          />
        </q-card-section>
      </q-card>
    </div>
  </q-page>

</template>

<script setup>
  import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer';
  import { useUserStore } from 'src/stores/example-store';
  import { ref, onMounted, watch } from 'vue';
  import fileDownLoad from 'js-file-download';
  import { Notify, Dialog } from 'quasar';
  import { useRouter } from 'vue-router';
  import axios from 'axios';

  import '@toast-ui/editor/dist/toastui-editor-viewer.css';

  const userStore = useUserStore();
  const router = useRouter();

  const subjectDiv = ref('');
  const nttUid = ref('');
  const bbsInfo = ref([]);
  const bbsFiles = ref([]);
  const viewer = ref('');
  let nttViewer = null;

  function loadData() {
    axios.get( `/api/v1/bbs/IA/${nttUid.value}`
              , { headers : { Authorization : userStore.AccessToken } } )
    .then( res => {
      if( res.data.code == 0 ) {
        bbsInfo.value = res.data.result;
        bbsFiles.value = res.data.result.attachFiles;
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

  function fileDown( fileId, fileSn ) {
    axios.get( `/api/v1/bbs/download/attachedFile/${fileId}/${fileSn}`
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
  }

  function goCorpAnnoList() {
    router.push( {
      path: "/user/board/corpAnnounce",
      state: {
        data : history.state.data
      }
    })
  }

  watch( () => bbsInfo.value, () => {
    nttViewer = new Viewer({
      el: viewer.value,
      initialValue: bbsInfo.value.nttContent
    })
  })

  onMounted( () => {
    if( history.state.data ) {
      nttUid.value = history.state.data.clickNttUid;
    }

    loadData()
  })
</script>
