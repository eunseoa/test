<template>
  <div>
    <q-card class="my-card shadow-3" style="height: 800px;">
      <q-toolbar class="shadow-2">
        <div v-if="selectCorpId != null">
          <div class="text-h6 q-pa-md">
            [ {{ headerCorpId }} ] {{ headerCorpNm }}
          </div>
        </div>

        <div v-if="selectCorpId == null">
          <div class="text-h6 q-pa-md">
            신규 등록
          </div>
        </div>

        <q-space></q-space>

        <q-btn
          v-if="menuauth.modPermAt == true && selectCorpId != null"
          flat stretch
          icon="edit"
          @click="corpModify"
        >
          <q-tooltip>
            수정
          </q-tooltip>
        </q-btn>

        <q-btn
          v-if="menuauth.regPermAt == true && selectCorpId == null"
          flat stretch
          icon="save"
          @click="corpReg"
        >
          <q-tooltip>
            저장
          </q-tooltip>
        </q-btn>
      </q-toolbar>

      <q-separator />

      <q-card-section>
        <div class="q-gutter-lg">
          <div class="row q-col-gutter-md">
            <div class="col-lg-3">
              회사로고<span style="color: red"> * &nbsp; ( 110 &nbsp; * &nbsp; 50 )</span>
              <div v-if="corpInfo.logoImageData == null" class="row q-pt-md flex flex-center">
                <div class="col-lg-12">
                  <input type="file" id="upload-image" @change="getFileName($event.target.files)" hidden/>
                  <label for="upload-image">
                    <img src="/src/assets/company/noImage.png" id="logoImg" style="width: 220px; height: 100px;"/>
                  </label>
                </div>
              </div>
              <div class="row q-pt-sm">
                <div class="col-lg-12 flex flex-center">
                  <q-btn
                    label="등록"
                    color="indigo-7"
                    @click="corpImgReg"
                  />
                </div>
              </div>

              <div v-if="corpInfo.logoImageData != null" class="q-pt-md flex flex-center">
                <div>
                  <q-img :src="logoUrl" style="pointer-events: none; width: 220px; height: 100px;">
                    <q-icon
                      v-if="menuauth.delPermAt == true"
                      class="absolute all-pointer-events"
                      size="32px"
                      name="disabled_by_default"
                      color="black"
                      @click="corpImgDel"
                      style="top: 8px; right: 8px">
                      <q-tooltip>
                        삭제
                      </q-tooltip>
                    </q-icon>
                  </q-img>
                </div>
              </div>
            </div>

            <div class="col-lg-9">
              <div class="row q-col-gutter-md q-pb-lg">
                <div class="col-lg-6">
                  회사ID<span style="color: red">&nbsp;*</span>
                  <div>
                    <q-input
                      dense square outlined
                      v-bind:readonly="selectCorpId != null"
                      v-model="corpInfo.corpId"
                      :rules="[corpId_rules]"
                      class="q-pt-sm"
                      placeholder="영문자 ( 4~10자 )"
                    />
                  </div>
                </div>
                <div class="col-lg-6">
                  회사명<span style="color: red">&nbsp;*</span>
                  <q-input
                    dense square outlined
                    v-bind:readonly="menuauth.modPermAt != true"
                    v-model="corpInfo.corpNm"
                    class="q-pt-sm"
                  />
                </div>
              </div>

              <div class="row q-col-gutter-md">
                <div class="col-lg-6">
                  사용여부<span style="color: red">&nbsp;*</span>
                  <q-select
                    dense square outlined
                    v-bind:readonly="menuauth.modPermAt != true"
                    v-model="corpInfo.useAt"
                    :options="useAtOptions"
                    class="q-pt-sm"
                    emit-value
                    map-options
                  />
                </div>

                <div class="col-lg-6">
                  약식명
                  <q-input
                    dense square outlined
                    v-bind:readonly="menuauth.modPermAt != true"
                    v-model="corpInfo.corpShortNm"
                    class="q-pt-sm"
                    hint="미입력시 회사명이 자동으로 기입됩니다."
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="row q-col-gutter-md">
            <div class="col-lg-4">
              사업자 등록번호
              <q-input
                dense square outlined
                v-bind:readonly="menuauth.modPermAt != true"
                v-model="corpInfo.bizRegNo"
                class="q-pt-sm"
                placeholder="000-00-00000 형식으로 입력"
              />
            </div>

            <div class="col-lg-4">
              대표자
              <q-input
                dense square outlined
                v-bind:readonly="menuauth.modPermAt != true"
                v-model="corpInfo.ceoNm"
                class="q-pt-sm"
              />
            </div>

            <div class="col-lg-4">
              E-Mail
              <q-input
                dense square outlined
                v-bind:readonly="menuauth.modPermAt != true"
                v-model="corpInfo.corpEmail"
                class="q-pt-sm"
                placeholder="대표 이메일 주소 입력"
              />
            </div>
          </div>

          <div class="row q-col-gutter-md">
            <div class="col-lg-4">
              업태
              <q-input
                dense square outlined
                v-bind:readonly="menuauth.modPermAt != true"
                v-model="corpInfo.bizType"
                class="q-pt-sm"
              />
            </div>

            <div class="col-lg-4">
              종목
              <q-input
                dense square outlined
                v-bind:readonly="menuauth.modPermAt != true"
                v-model="corpInfo.bizItem"
                class="q-pt-sm"
              />
            </div>

            <div class="col-lg-4">
              대표전화번호
              <q-input
                dense square outlined
                v-bind:readonly="menuauth.modPermAt != true"
                v-model="corpInfo.corpTelNo"
                class="q-pt-sm"
                placeholder="&quot;-&quot; 구분자 사용"
              />
            </div>
          </div>

          <div class="row q-col-gutter-md">
            <div class="col-lg-12">
              주소
              <div class="row q-col-gutter-sm q-pt-sm">
                <div class="col-lg-2">
                  <q-input
                    dense square outlined disable
                    v-bind:readonly="menuauth.modPermAt != true"
                    v-model="corpInfo.postNo"
                    placeholder="우편번호"
                    />
                </div>

                <div class="col-lg-4">
                  <q-input
                    dense square outlined disable
                    v-bind:readonly="menuauth.modPermAt != true"
                    v-model="corpInfo.corpAddr"
                    placeholder="우편번호 선택시 자동 입력"
                  />
                </div>

                <div class="col-lg-4">
                  <q-input dense square outlined
                    v-bind:readonly="menuauth.modPermAt != true"
                    v-model="corpInfo.corpAddrDtl"
                    placeholder="상세주소 입력"
                  />
                </div>

                <div class="col-lg-2">
                  <q-btn
                    v-bind:readonly="menuauth.modPermAt != true"
                    class="full-width"
                    @click="postCode"
                    color="teal-6"
                  >
                    <span class="text-caption">
                      우편번호검색
                    </span>
                  </q-btn>
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
  import { useUserStore } from 'src/stores/example-store';
  import { ref, watch, onMounted } from 'vue'
  import { Notify, Dialog } from 'quasar';
  import { useRouter } from 'vue-router';
  import { api } from 'src/boot/axios';
  import axios from 'axios';


  const userStore = useUserStore();
  const router = useRouter();

  const props = defineProps([
    'menuauth',
    'corpId'
  ]);

  const menuauth = ref( props.menuauth );
  const selectCorpId = ref( props.corpId );
  const corpInfo = ref({});
  const headerCorpId = ref('');
  const headerCorpNm = ref('');

  const corpLogoImg = ref('');
  const logoUrl = ref('');
  const useAtOptions = ref([
    {
      label: '사용',
      value: 'Y'
    },
    {
      label: '미사용',
      value: 'N'
    }
  ])

  const corpId_rules = ( v ) => {
    if( !v ) {
      return 'ID는 필수항목입니다.'
    }

    if( v.length < 4 ) {
      return 'ID는 4자리 이상이어야합니다.'
    }

    const kor = v.match(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g);
    if( kor ) {
      return '한글은 입력할 수 없습니다.'
    }

    const eng = v.match(/[A-Za-z]/g);
    if( !eng ) {
      return 'ID는 영문자를 사용해야합니다.'
    }
  }

  function loadData( corpId ) {
    axios.get( `/api/v1/corporation/${corpId}`
            , { headers : { Authorization : userStore.AccessToken } } )
    .then( res => {
      if( res.data.code == 0 ) {
        corpInfo.value = res.data.result;

        headerCorpId.value = corpInfo.value.corpId;
        headerCorpNm.value = corpInfo.value.corpNm;
        if( corpInfo.value.logoImageData ) {
          api.get( `/images${corpInfo.value.logoImageData.relativePath}/${corpInfo.value.logoImageData.storeFileNm}` )
          .then( res => {
            logoUrl.value = res.config.baseURL + res.config.url;
          })
        }
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

  function getFileName( files ) {
    corpLogoImg.value = files[0];
    base64( corpLogoImg.value )
  }

  function base64( fileName ) {
    return new Promise(resolve => {
      let a = new FileReader()
      a.onload = e => {
        resolve(e.target.result)
        const logoImg = document.getElementById('logoImg');
        logoImg.src = e.target.result;
      }
      a.readAsDataURL(fileName)
    })
  }

  function corpImgReg() {
    let formData = new FormData();
    formData.append( "imgFile", corpLogoImg.value );

    axios.post( `/api/v1/corporation/modify/logoImage/add/${corpInfo.value.corpId}`
                ,formData
                , { headers : { Authorization : userStore.AccessToken, 'Content-Type': 'multipart/form-data' } } )
    .then( res => {
      if( res.data.code == 0 ) {
        Notify.create({
          type: 'positive',
          message: '로고사진이 등록되었습니다.',
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

  function corpImgDel() {
    Dialog.create({
      title: '회사로고 삭제',
      message: '회사로고를 삭제 하시겠습니까?',
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
      axios.post( `/api/v1/corporation/modify/logoImage/remove?corpId=${corpInfo.value.corpId}&attachFileId=${corpInfo.value.logoImageData.atchFileId}`
                  , {}
                  , { headers : { Authorization : userStore.AccessToken } } )
      .then( res => {
        if( res.data.code == 0 ) {
          Notify.create({
            type: 'positive',
            message: '로고사진이 삭제되었습니다.',
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
    })
  }

  function corpModify() {

    if( !corpInfo.value.corpId
      || !corpInfo.value.corpNm
      || !corpInfo.value.useAt ) {
      Notify.create({
        type: 'negative',
        message: '필수항목이 입력되지않았습니다.',
        timeout: 600
      })
    } else {
      axios.post( '/api/v1/corporation/modify'
                  , corpInfo.value
                  , { headers : { Authorization : userStore.AccessToken } } )
      .then( res => {
        if( res.data.code == 0 ) {
          Notify.create({
            type: 'positive',
            message: '회사정보가 수정되었습니다.',
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

  function corpReg() {
    if( !corpInfo.value.corpId
      || !corpInfo.value.corpNm
      || !corpInfo.value.useAt
      || !corpLogoImg.value ) {
        Notify.create({
          type: 'negative',
          message: '필수항목을 입력해주세요.',
          timeout: 600
        })
    } else {
      let formData = new FormData();
      formData.append("data", new Blob( [ JSON.stringify( corpInfo.value ) ], { type: "application/json" } ) );
      formData.append( "imgFile", corpLogoImg.value );

      axios.post( '/api/v1/corporation/registration'
                  , formData
                  , { headers : { Authorization : userStore.AccessToken, 'Content-Type': 'multipart/form-data' } } )
      .then( res => {
        if( res.data.code == 0 ) {
          Notify.create({
            type: 'positive',
            message: '회사정보가 등록되었습니다.',
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

  function postCode() {
    let address = null;
    let extraAddress = null;
    let postCode = null;

    new window.daum.Postcode({
      oncomplete: (data) => {
        if ( extraAddress != "") {
          extraAddress = "";
        }

        if( data.userSelectedType == "R" ) {
          // 도로명 주소를 선택했을 경우
          address = data.roadAddress;
        }
        else {
          // 지번주소를 선택했을 경우
          address = data.jibunAddress;
        }

        // 도로명 주소를 선택했을 경우 참고항목을 조합
        if( data.userSelectedType == "R" ) {
          // 법정동명이 있을 경우 추가한다. (법정리는 제외)
          // 법정동의 경우 마지막 문자가 "동/로/가"로 끝난다.
          if( data.bname != "" && /[동|로|가]$/g.test( data.bname ) ) {
              extraAddress += data.bname
          }

          // 건물명이 있고, 공동주택일 경우 추가한다.
          if( data.buildingName != "" || data.apartment == "Y" ) {
              extraAddress += extraAddress.value != "" ? `, ${data.buildingName}` : data.buildingName;
          }

          // 표시할 참고항목이 있을 경우, 괄호까지 추가한 최종 문자열을 만든다.
          if( extraAddress != "" ) {
              extraAddress = `( ${ extraAddress } )`;
          }
        }
        else {
          extraAddress = "";
        }

        address = address + " " + extraAddress;

        // 우편번호를 입력한다.
        postCode = data.zonecode;

        corpInfo.value.corpAddr = address;
        corpInfo.value.corpAddrDtl = extraAddress;
        corpInfo.value.postNo = postCode;
      },
    }).open({
        popupKey: 'popup1'
    })
  }

  function corpInfoClear() {
    corpInfo.value = {
      corpId: null,
      corpNm: null,
      corpShortNm: null,
      bizRegNo: null,
      postNo: null,
      corpAddr: null,
      corpAddrDtl: null,
      ceoNm: null,
      bizType: null,
      bizItem: null,
      corpTelNo: null,
      corpEmail: null,
      logoImgId: null,
      useAt: 'Y'
    }
  }

  watch( () => props.corpId, ( a, b ) => {
    if( props.corpId != null ) {
      selectCorpId.value = props.corpId;
      loadData( props.corpId )
    } else if ( props.corpId == null ) {
      selectCorpId.value = null;

      corpInfoClear()
    }
  })

  onMounted( () => {
    if( selectCorpId.value != null ) {
      loadData( selectCorpId.value )
    } else if ( selectCorpId.value == null ) {
      corpInfoClear()
    }
  })
</script>
