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
        &nbsp;<span>사내 공지사항 등록</span>
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
                    v-model="corpBbs.nttCategory"
                    :options="nttCategoryList"
                    :rules="[ val => !!val || '구분은 필수선택입니다.' ]"
                    option-value="cd"
                    option-label="cdNm"
                    emit-value
                    map-options
                  />
                </div>

                <div class="col-lg-9">
                  <q-input
                    dense square outlined
                    v-model="corpBbs.nttSubject"
                    :rules="[ val => !!val || '제목은 필수입력입니다.' ]"
                    placeholder="제목을 입력하세요"
                  />
                </div>
              </div>

              <div class="row q-col-gutter-md q-mt-none">
                <div class="col-lg-12 q-pt-none">
                  <div
                    ref="editor"
                  />
                  <div align="right">
                  </div>
                </div>
              </div>

              <div class="row q-col-gutter-md q-mt-none">
                <div class="col-lg-1">
                  <span class="text-bold">게시일</span>
                </div>

                <div class="col-lg-3">
                  <q-input dense square outlined v-model="corpBbs.pubBeginDate" placeholder="게시시작일">
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
                  <q-input dense square outlined v-model="corpBbs.pubEndDate" placeholder="게시종료일">
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
                      v-model="corpBbs.topLockAt"
                      true-value="Y"
                      false-value="N"
                      label="상단고정하기"
                    />
                  </div>
                </div>
              </div>

              <div class="row q-col-gutter-md q-mt-none">
                <div class="col-lg-1">
                  <span class="text-bold">첨부파일</span>
                </div>

                <div class="col-lg-3">
                  <q-uploader
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
                  label="등록"
                  @click="corpBbsReg"
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
  import { useRouter } from 'vue-router';
  import Editor from '@toast-ui/editor';
  import { Notify, date } from 'quasar';
  import { ref, onMounted } from 'vue'
  import axios from 'axios';

  import '@toast-ui/editor/dist/toastui-editor.css';

  const userStore = useUserStore();
  const router = useRouter();

  const editor = ref();
  let nttEditor = null;

  const corpBbsForm = ref(null);
  const nttCategoryList = ref([]);
  const corpBbs = ref({
    bbsId: 'IA',
    nttCategory: '10',
    nttSubject: null,
    nttContent: null,
    writerId: null,

  })

  const files = ref([]);

  function dateOptions( data ) {
    let value = date.formatDate( corpBbs.value.pubBeginDate, 'YYYY/MM/DD');

    return data >= value
  }

  function loadData() {
    nttCategoryList.value = ( userStore.commomCode ).filter( code => code.cgId === 'C01' );
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

  async function corpBbsReg() {
    let valid = await corpBbsForm.value.validate();
    let content = nttEditor.getHTML();
    corpBbs.value.nttContent = content;


    console.log(content)

    if( valid == false
      || content == '<p><br></p>' ) {
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

      axios.post( '/api/v1/bbs/manage/registration'
                  , formData
                  , { headers : { Authorization : userStore.AccessToken, 'Content-Type': 'multipart/form-data' } } )
      .then( res => {
        if( res.data.code == 0 ) {
          Notify.create({
            type: 'positive',
            message: '공지사항이 등록되었습니다.',
            timeout: 600,
            position: 'center'
          })

          setTimeout( () => {
            router.push( {
              path: "/system/board/corpAnnounceMod",
              state: {
                data : {
                  clickNttUid: res.data.result.nttUid
                }
              }
            })
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
    corpBbs.value.bbsId = 'IA';
    corpBbs.value.nttCategory = '10';
    corpBbs.value.writerId = userStore.userInfo.accountId;
    corpBbs.value.topLockAt = 'N';

    loadData()

    nttEditor = new Editor({
        el: editor.value,
        height: '500px',
        initialEditType: 'wysiwyg',
        previewStyle: 'vertical'
    });
  });
</script>
