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
        &nbsp;<span>사내 공지사항</span>
      </div>
    </div>

    <div>
      <q-card class="my-card shadow-3" style="height: 950px; max-height: 1400px;">
        <q-form ref="corpBbsForm">
          <q-card-section>
            <div class="q-gutter-lg">
              <div class="row q-col-gutter-md">
                <div class="col-lg-3">
                  <q-select
                    dense square outlined
                    v-bind:readonly="menuauth.modPermAt != true"
                    v-model="corpBbs.nttCategory"
                    :options="nttCategoryList"
                    option-value="cd"
                    option-label="cdNm"
                    emit-value
                    map-options
                  />
                </div>

                <div class="col-lg-9">
                  <q-input
                    dense square outlined
                    v-bind:readonly="menuauth.modPermAt != true"
                    v-model="corpBbs.nttSubject"
                    placeholder="제목을 입력하세요"
                  />
                </div>
              </div>

              <div class="row q-col-gutter-md q-mt-none">
                <div class="col-lg-12">
                  <div
                    ref="editor"
                  >
                  </div>
                </div>
              </div>

              <div class="row q-col-gutter-md q-mt-none">
                <div class="col-lg-1">
                  <span class="text-bold">게시일</span>
                </div>

                <div class="col-lg-3">
                  <q-input dense square outlined v-model="corpBbs.pubBeginDate" placeholder="게시시작일" v-bind:readonly="menuauth.modPermAt != true">
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-date v-model="corpBbs.pubBeginDate" mask="YYYY-MM-DD" minimal>
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="선택" color="primary" flat></q-btn>
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>

                <div class="col-lg-3">
                  <q-input dense square outlined v-model="corpBbs.pubEndDate" placeholder="게시시작일" v-bind:readonly="menuauth.modPermAt != true">
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-date v-model="corpBbs.pubEndDate" mask="YYYY-MM-DD" :options="dateOptions" minimal>
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="선택" color="primary" flat></q-btn>
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>

                <div class="col-lg-3"></div>

                <div class="col-lg-2 q-pt-none">
                  <div align="right">
                    <q-checkbox
                      v-bind:disable="menuauth.modPermAt != true"
                      v-model="corpBbs.topLockAt"
                      true-value="Y"
                      false-value="N"
                      label="상단고정하기"
                    />
                  </div>
                </div>
              </div>

              <div class="row q-col-gutter-md q-mt-sm">
                <div class="col-lg-1">
                  <span class="text-bold">첨부파일</span>
                </div>

                <div class="col-lg-3">
                  <q-list bordered class="rounded-borders" >
                    <q-item-label header>파일 다운로드</q-item-label>

                    <q-scroll-area style="height: 150px; border-right: 1px solid #ddd">
                      <div v-for="file in bbsFiles" :key="file.atchFileId">
                        <q-item>
                          <q-item-section top class="col-2 gt-sm">
                            <div class="q-gutter-xs">
                              <q-btn
                                flat dense round
                                class="gt-xs"
                                size="12px"
                                icon="cloud_download"
                                @click="fileDown( file.atchFileId, file.fileSn )"
                              />
                            </div>
                          </q-item-section>

                          <q-item-section top>
                            <q-item-label lines="1" class="q-mt-xs text-body2 text-weight-bold text-primary text-uppercase" style="width: 160px;">
                              <span>{{ file.originalFileNm }}</span>
                            </q-item-label>
                          </q-item-section>

                          <q-item-section top side>
                            <div class="text-grey-8 q-gutter-xs">
                              <q-btn
                                flat dense round
                                v-bind:readonly="menuauth.delPermAt != true"
                                class="gt-xs"
                                size="12px"
                                icon="delete"
                                @click="fileDelete( file.atchFileId, file.fileSn )"
                              />
                            </div>
                          </q-item-section>
                        </q-item>
                      </div>
                    </q-scroll-area>
                  </q-list>
                </div>

                <div class="col-lg-3">
                  <q-uploader
                    v-bind:readonly="menuauth.modPermAt != true"
                    multiple
                    color="white"
                    text-color="black"
                    flat
                    bordered
                    no-thumbnails
                    hide-upload-btn
                    class="full-width"
                    style="height: 200px;"
                    @added="fileUpload"
                    @removed="fileRemove"
                  ></q-uploader>
                </div>
              </div>

              <div class="flex flex-center q-gutter-md q-mt-none">
                <q-btn
                  outline
                  label="저장"
                  @click="corpBbsMod"
                />

                <q-btn
                  outline
                  label="목록"
                  @click="goCorpAnnoList"
                />
              </div>
            </div>
          </q-card-section>
        </q-form>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
  import { useUserStore } from 'src/stores/example-store';
  import fileDownLoad from 'js-file-download';
  import { useRouter } from 'vue-router';
  import Editor from '@toast-ui/editor';
  import { Notify, date } from 'quasar';
  import { ref, onMounted } from 'vue'
  import axios from 'axios';

  import '@toast-ui/editor/dist/toastui-editor.css';

  const router = useRouter();
  const userStore = useUserStore();

  const editor = ref();
  let nttEditor = null;
  let menu = null;
  const menuauth = ref({
    regPermAt: '', // 등록권한
    modPermAt: '', // 수정권한
    delPermAt: '', // 삭제권한
    execPermAt: '', // 실행권한
  });

  const corpBbsForm = ref(null);
  const nttCategoryList = ref([]);
  const nttUid = ref('');
  const corpBbs = ref({});
  const bbsFiles = ref({});

  const files = ref([]);

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
    let value = date.formatDate( corpBbs.value.pubBeginDate, 'YYYY/MM/DD');

    return data >= value
  }

  function selectBoxData() {
    nttCategoryList.value = ( userStore.commomCode ).filter( code => code.cgId === 'C01' );
  }

  function loadData() {
    axios.get( `/api/v1/bbs/IA/${nttUid.value}`
            , { headers : { Authorization : userStore.AccessToken } } )
    .then( res => {
      if( res.data.code == 0 ) {
        corpBbs.value = res.data.result;
        bbsFiles.value = res.data.result.attachFiles;

        nttEditor.setHTML( corpBbs.value.nttContent );
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

  function fileUpload( file ) {
    for( let i = 0; i < file.length; i++ ) {
      files.value.push( file[i] )
    }
  }

  function fileRemove( file ) {
    for(let i = 0; i < files.value.length; i++) {
      if( files.value[i].__key == file[0].__key )  {
        ( files.value ).splice(i, 1);
        i--;
      }
    }
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

  function fileDelete( fileId, fileSn ) {
    axios.post( `/api/v1/bbs/manage/attachedFile/remove/IA/${nttUid.value}`
            , { 'atchFileId': fileId, 'fileSn': fileSn }
            , { headers : { Authorization : userStore.AccessToken } } )
    .then( res => {
      if( res.data.code == 0 ) {
        Notify.create({
          type: 'positive',
          message: '파일이 삭제되었습니다.',
          timeout: 600,
          position: 'center'
        })

        setTimeout( () => {
          router.go(0)
        }, 1000 )
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

  async function corpBbsMod() {
    let valid = await corpBbsForm.value.validate();
    let content = nttEditor.getHTML();
    corpBbs.value.nttContent = content;

    if( valid == false
      || content == '' ) {
      Notify.create({
        type: 'negative',
        message: '필수항목을 확인해주세요.',
        timeout: 600,
        position: 'center'
      })
    } else {
      let formData = new FormData();
      formData.append( "data", new Blob( [ JSON.stringify( corpBbs.value ) ], { type: "application/json" } ) );
      for (let i = 0; i < files.value.length; i++) {
        formData.append( "attachedFiles", files.value[i]);
      }

      axios.post( '/api/v1/bbs/manage/modify'
                  , formData
                  , { headers : { Authorization : userStore.AccessToken, 'Content-Type': 'multipart/form-data' } } )
      .then( res => {
        if( res.data.code == 0 ) {
          Notify.create({
            type: 'positive',
            message: '공지사항이 수정되었습니다.',
            timeout: 600,
            position: 'center'
          })

          setTimeout( () => {
            router.go(0)
          }, 1000 )
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
          timeout: 600,
          position: 'center'
        })
      })
    }
  }

  function goCorpAnnoList() {
    router.push( {
      path: "/system/board/corpAnnounce",
      state: {
        data : history.state.data
      }
    })
  }

  onMounted(() => {
    nttUid.value = history.state.data.clickNttUid;

    selectMenuAuth()
    selectBoxData()
    loadData()

    nttEditor = new Editor({
        el: editor.value,
        height: '500px',
        initialEditType: 'wysiwyg',
        previewStyle: 'vertical'
    });
  });
</script>
