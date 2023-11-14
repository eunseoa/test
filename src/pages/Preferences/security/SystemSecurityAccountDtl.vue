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
        &nbsp;<span>사용자 정보</span>
      </div>
    </div>

    <div>
      <q-card class="my-card shadow-3">
        <q-toolbar class="shadow-2">
          <div class="text-h6 q-pa-md text-weight-bold">
            계정 정보
          </div>

          <q-space></q-space>

          <q-btn
            v-if="userUid != null"
            v-bind:disable="menuauth.modPermAt != true"
            flat stretch
            icon="lock_reset"
            @click="initializePassword"
          >
            <q-tooltip>
              비밀번호 초기화
            </q-tooltip>
          </q-btn>

          <q-btn
            v-if="userUid != null"
            v-bind:disable="menuauth.modPermAt != true"
            flat stretch
            icon="password"
            @click="passwordDialogAt = true"
          >
            <q-tooltip>
              비밀번호 변경
            </q-tooltip>
          </q-btn>

          <q-btn
            v-if="userUid != null"
            v-bind:disable="menuauth.modPermAt != true"
            flat stretch
            icon="save"
            @click="userMod"
          >
            <q-tooltip>
              저장
            </q-tooltip>
          </q-btn>

          <q-btn
            v-if="userUid == null"
            v-bind:disable="menuauth.modPermAt != true"
            flat stretch
            icon="add"
            @click="userReg"
          >
            <q-tooltip>
              등록
            </q-tooltip>
          </q-btn>

          <q-btn
            v-if="menuauth.delPermAt == true"
            flat stretch
            icon="format_list_bulleted"
            @click="goAccountList"
          >
            <q-tooltip>
              목록
            </q-tooltip>
          </q-btn>
        </q-toolbar>

        <q-separator />

        <q-card-section>
          <q-form ref="userInfoForm">
            <div class="q-gutter-lg">
              <div class="row q-col-gutter-md">
                <div class="col-lg-3">
                  사용자 ID <span style="color: red"> * </span>
                  <q-input
                    dense square outlined
                    v-bind:readonly="menuauth.modPermAt != true || userUid != null"
                    v-model="userInfo.accountId"
                    :rules="[ accountId_rules ]"
                    placeholder="로그인 ID 입력"
                    hint="4자리이상의 영문자 또는 숫자"
                    class="q-pt-sm"
                  >
                    <template v-if="userUid == null" v-slot:after>
                      <q-btn dense color="red" label="중복확인" @click="idCheck"></q-btn>
                    </template>
                  </q-input>
                </div>

                <div class="col-lg-3">
                  사용자명 <span style="color: red"> * </span>
                  <q-input
                    dense square outlined
                    v-bind:readonly="menuauth.modPermAt != true"
                    v-model="userInfo.accountName"
                    :rules="[ val => !!val || '사용자명은 필수항목입니다.' ]"
                    class="q-pt-sm"
                  />
                </div>

                <div class="col-lg-3">
                  별명 <span style="color: red"> * </span>
                  <q-input
                    dense square outlined
                    v-bind:readonly="menuauth.modPermAt != true"
                    v-model="userInfo.accountNickname"
                    :rules="[ val => !!val || '별명은 필수항목입니다.' ]"
                    class="q-pt-sm"
                  />
                </div>

                <div class="col-lg-3">
                  계정유형 <span style="color: red"> * </span>
                  <q-select
                    dense square outlined
                    v-bind:readonly="menuauth.modPermAt != true"
                    v-model="userInfo.accountType"
                    :rules="[ val => !!val || '계정유형은 필수항목입니다.' ]"
                    :options="userTypeList"
                    option-value="cd"
                    option-label="cdNm"
                    emit-value
                    map-options
                    class="q-pt-sm"
                  />
                </div>
              </div>

              <div class="row q-col-gutter-md">
                <div class="col-lg-3">
                  계정 활성화여부 <span style="color: red"> * </span>
                  <div>
                    <q-toggle
                      v-bind:disable="menuauth.modPermAt != true"
                      v-model="userInfo.active"
                      :rules="[ val => !!val || '계정 활성화여부는 필수항목입니다.' ]"
                      false-value="N"
                      true-value="Y"
                      size="xl"
                      color="green"
                      checked-icon="check"
                      unchecked-icon="clear"
                    />
                  </div>
                </div>

                <div class="col-lg-3">
                  계정 잠금여부 <span style="color: red"> * </span>
                  <div>
                    <q-toggle
                      v-bind:disable="menuauth.modPermAt != true"
                      v-model="userInfo.accountLocked"
                      :rules="[ val => !!val || '계정 잠금여부는 필수항목입니다.' ]"
                      false-value="N"
                      true-value="Y"
                      size="xl"
                      color="green"
                      checked-icon="lock"
                      unchecked-icon="lock_open"
                    />
                  </div>
                </div>

                <div class="col-lg-3">
                  이메일
                  <q-input
                    dense square outlined
                    v-bind:readonly="menuauth.modPermAt != true"
                    v-model="userInfo.email"
                    class="q-pt-sm"
                    placeholder="user@email.com 형식"
                  />
                </div>

                <div class="col-lg-3">
                  사용자구분 <span style="color: red"> * </span>
                  <q-select
                    dense square outlined
                    v-bind:readonly="menuauth.modPermAt != true"
                    v-model="userInfo.extUserAt"
                    :rules="[ val => !!val || '사용자구분은 필수항목입니다.' ]"
                    :options="userExtUserAtList"
                    option-value="cd"
                    option-label="cdNm"
                    emit-value
                    map-options
                    class="q-pt-sm"
                  />
                </div>
              </div>

              <div class="row q-col-gutter-md">
                <div class="col-lg-3">
                  사용여부 <span style="color: red"> * </span>
                  <div>
                    <q-toggle
                      v-bind:disable="menuauth.modPermAt != true"
                      v-model="userInfo.useAt"
                      :rules="[ val => !!val || '사용여부는 필수항목입니다.' ]"
                      false-value="N"
                      true-value="Y"
                      size="xl"
                      color="green"
                      checked-icon="check"
                      unchecked-icon="clear"
                    />
                  </div>
                </div>

                <div class="col-lg-3">
                  계정 만료일
                  <q-input dense square outlined v-model="userInfo.accountExpiredDt" class="q-pt-sm">
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-date v-model="userInfo.accountExpiredDt" mask="YYYY-MM-DD" minimal>
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
                  핸드폰
                  <q-input
                    dense square outlined
                    v-bind:readonly="menuauth.modPermAt != true"
                    v-model="userInfo.mobile"
                    class="q-pt-sm"
                    placeholder="000-0000-000 형식"
                  />
                </div>

                <div v-if="userUid != null" class="col-lg-3">
                  최근 로그인 일시
                  <q-input
                    dense square outlined disable
                    v-model="userInfo.lastLoginDt"
                    class="q-pt-sm"
                    placeholder="000-0000-000 형식"
                  />
                </div>
              </div>

              <div v-if="userUid == null" class="row q-col-gutter-md">
                <div class="col-lg-3">
                  암호 <span style="color: red"> * </span>
                  <q-input
                    dense square outlined
                    v-bind:readonly="menuauth.modPermAt != true"
                    type="password"
                    v-model="userInfo.accountPwd"
                    :rules="[ password_rules ]"
                    class="q-pt-sm"
                    hint="6자리이상 숫자와 영문자를 혼용해서 등록"
                  />
                </div>

                <div v-if="userUid == null" class="col-lg-3">
                  암호확인 <span style="color: red"> * </span>
                  <q-input
                    dense square outlined
                    v-bind:readonly="menuauth.modPermAt != true"
                    type="password"
                    v-model="pwdCheckValue"
                    :rules="[ val => !!val || '암호확인은 필수항목입니다.' ]"
                    class="q-pt-sm"
                  />
                </div>
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>

    <div class="q-pt-sm">
      <q-card class="my-card shadow-3">
        <q-card-section>
          <div class="text-h6 text-weight-bold">
            조직 정보
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="q-gutter-lg">
            <div class="row q-col-gutter-md">
              <div class="col-lg-3">
                회사
                <corp-select-box
                  :value="userProfile.corpId"
                  @update-value="updateCorpValue"
                />
              </div>

              <div class="col-lg-3">
                물류센터
                <logis-select-box
                  :value="userProfile.lcCd"
                  :corp-id="userProfile.corpId"
                  @update-value="updateLcValue"
                  class="q-pt-sm"
                />
              </div>

              <div class="col-lg-3">
                부서
                <org-select-box
                  :value="userProfile.orgCd"
                  :corp-id="userProfile.corpId"
                  :lc-cd="userProfile.lcCd"
                  @update-value="updateOrgValue"
                  class="q-pt-sm"
                />
              </div>

              <div class="col-lg-3">
                사번
                <emp-select-box
                  :value="userProfile.empNo"
                  :corp-id="userProfile.corpId"
                  :lc-cd="userProfile.lcCd"
                  :org-cd="userProfile.orgCd"
                  hint="개인 계정인 경우 설정하세요"
                  @update-value="updateEmpValue"
                />
              </div>
            </div>

            <div class="row q-col-gutter-md q-mt-none">
              <div class="col-lg-3">
                거래처
                <q-input
                  dense square outlined
                  v-bind:readonly="menuauth.modPermAt != true"
                  placeholder="거래처 코드 입력 또는 검색"
                  v-model="userProfile.bpCd"
                  hint="외부 사용자 계정은 반드시 설정하세요"
                  class="q-pt-sm"
                >
                  <template v-slot:append>
                    <q-btn
                      round dense flat
                      icon="search"
                      @click="bizPartDialogAt = true"
                    />
                  </template>
                </q-input>
              </div>

              <div class="col-lg-6">
                &nbsp;
                <q-input
                  dense square outlined disable
                  v-model="bpNm"
                  class="q-pt-sm"
                  placeholder="거래처 선택 또는 입력시 거래처명이 표시"
                />
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <q-dialog v-model="bizPartDialogAt" persistent>
      <biz-part-dialog
        :bpCd="userProfile.bpCd"
        @bizpart-value="bizPartvalue"
      />
    </q-dialog>

    <div class="q-pt-sm">
      <q-card class="my-card shadow-3">
        <q-card-section>
          <div class="flex flex-center q-gutter-md">
            <q-btn
              v-if="userUid != null"
              v-bind:disable="menuauth.modPermAt != true"
              outline
              label="비밀번호 초기화"
              @click="initializePassword"
            />

            <q-btn
              v-if="userUid != null"
              v-bind:disable="menuauth.modPermAt != true"
              outline
              label="비밀번호 변경"
              @click="passwordDialogAt = true"
            />

            <q-btn
              v-if="userUid == null"
              v-bind:disable="menuauth.modPermAt != true"
              outline
              label="등록"
              @click="userReg"
            />

            <q-btn
              v-if="userUid != null"
              v-bind:disable="menuauth.modPermAt != true"
              outline
              label="저장"
              @click="userMod"
            />

            <q-btn
              outline
              label="목록"
              @click="goAccountList"
            />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <q-dialog v-model="passwordDialogAt" persistent >
      <q-card style="width: 500px; max-width: 80vw;" class="q-pa-sm">
        <q-card-section class="text-center">
          <div class="text-h6 text-bold">비밀번호변경</div>
        </q-card-section>

        <q-form ref="changePwdForm">
          <q-card-section>
            <div class="q-gutter-lg">
              <div class="row">
                <div class="col-lg-12 q-gutter-sm">
                  <div>
                    새암호 <span style="color: red">*</span>
                  </div>
                  <div>
                    <q-input
                      type="password"
                      dense square outlined
                      v-model="newPassword"
                      :rules="[ password_rules ]"
                      @keyup.enter="passwordModify"
                      hint="6자리이상 숫자와 영문자를 혼용해서 등록"
                      />
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-lg-12 q-gutter-sm">
                  <div>
                    새암호 확인 <span style="color: red">*</span>
                  </div>
                  <div>
                    <q-input
                      type="password"
                      dense square outlined
                      v-model="newPasswordCheck"
                      :rules="[ val => !!val || '새암호 확인을 입력해주세요']"
                      @keyup.enter="passwordModify"
                    />
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>

          <q-card-actions align="center">
            <div class="q-gutter-md">
              <q-btn label="비밀번호 업데이트" color="indigo-8" @click="passwordModify"/>
              <q-btn label="취소" color="indigo-4" v-close-popup />
            </div>
          </q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
  import { useUserStore } from 'src/stores/example-store';
  import { Notify, Dialog } from 'quasar';
  import { useRouter } from 'vue-router';
  import { ref, onMounted } from 'vue';
  import axios from 'axios';

  import corpSelectBox from 'src/component/SelectBox/CorporationSelectBox.vue';
  import logisSelectBox from 'src/component/SelectBox/LogisticsselectBox.vue';
  import orgSelectBox from 'src/component/SelectBox/OrganizationSelectBox.vue';
  import empSelectBox from 'src/component/SelectBox/EmployeeSelectBox.vue';
  import bizPartDialog from 'src/component/Dialog/BizPartnerDialog.vue';

  const userStore = useUserStore();
  const router = useRouter();

  const userInfoForm = ref(null);
  const changePwdForm = ref(null);
  const userInfo = ref({});
  const bpNm = ref('');
  const userProfile = ref({});
  const userTypeList = ref([]);
  const userExtUserAtList = ref([]);
  const userUid = ref('');
  const pwdCheckValue = ref('');
  const idCheckvalidate = ref(null);
  const pwdCheckvalidate = ref(null);
  const bizPartDialogAt = ref(false);
  const passwordDialogAt = ref(false);
  const newPassword = ref('');
  const newPasswordCheck = ref('');

  const accountId_rules = ( v ) => {
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

  const password_rules = ( v ) => {
    if( !v ) {
      return '암호는 필수항목입니다.'
    }

    if( v.length < 6 ) {
      return '암호는 6자리 이상이어야합니다.'
    }

    const kor = v.match(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/g);
    if( kor ) {
      return '한글은 입력할 수 없습니다.'
    }

    const eng = v.match(/[A-Za-z]/g);
    if( !eng ) {
      return '암호는 숫자와 영문자를 혼용해서 사용해야합니다.'
    }

    const num = v.match(/[0-9]/g);
    if( !num ) {
      return '암호는 숫자와 영문자를 혼용해서 사용해야합니다.'
    }
  }

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
    userTypeList.value = ( userStore.commomCode ).filter( code => code.cgId === 'S01' );
    userExtUserAtList.value = ( userStore.commomCode ).filter( code => code.cgId === 'S02' );
  }

  function loadData( uid ) {
    axios.get( `/api/v1/users/findUserByKey/${uid}`
            , { headers : { Authorization : userStore.AccessToken } } )
    .then( res => {
      if( res.data.code == 0 ) {
        userInfo.value = res.data.result;
        userProfile.value = res.data.result.profile;
        if( userProfile.value.bpCd ) {
          bizPartData()
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

  function bizPartData() {
    axios.post( '/api/v1/partner/'
              , { bpCd: userProfile.bpCd }
              , { headers : { Authorization : userStore.AccessToken } } )
    .then( res => {
      if( res.data.code == 0 ) {
        bpNm.value = res.data.result.bpNm;
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

  function goAccountList() {
    router.push({
      path: history.state.back,
      state: {
        data: history.state.data
      }
    })
  }

  function idCheck() {
    if( !userInfo.value.accountId ) {
      Notify.create({
        type: 'info',
        message: '아이디를 입력해주세요.',
        timeout: 600,
        position: 'center'
      })
    } else {
      axios.get( `/api/v1/users/${userInfo.value.accountId}`
            , { headers : { Authorization : userStore.AccessToken } } )
      .then( res => {
        if( res.data.code == 0 ) {
          if( res.data.result ) {
            Notify.create({
              type: 'negative',
              message: '[ ' + userInfo.value.accountId + ' ] 는 존재하는 아이디입니다.',
              timeout: 600,
              position: 'center'
            })

            idCheckvalidate.value = false;
          } else if( !res.data.result ) {
            Notify.create({
              type: 'positive',
              message: '[ ' + userInfo.value.accountId + ' ] 는 사용가능한 아이디입니다.',
              timeout: 600,
              position: 'center'
            })

            idCheckvalidate.value = true;
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
  }

  function pwdCheck() {
    if( userInfo.value.accountPwd != pwdCheckValue.value ) {
      pwdCheckvalidate.value = false;
    } else {
      pwdCheckvalidate.value = true;
    }
  }

  async function userReg() {
    pwdCheck()

    let valid = await userInfoForm.value.validate();

    if( valid == false ) {
      Notify.create({
        type: 'negative',
        message: '필수항목을 확인해주세요.',
        timeout: 600,
        position: 'center'
      })
    } else if ( pwdCheckvalidate.value == false ) {
      Notify.create({
        type: 'negative',
        message: '암호가 일치하지 않습니다. 다시 확인해 주세요.',
        timeout: 600,
        position: 'center'
      })
    } else if ( idCheckvalidate.value == false ) {
      Notify.create({
        type: 'negative',
        message: '사용할 수 없는 아이디입니다. 다시 확인해 주세요.',
        timeout: 600,
        position: 'center'
      })
    } else {
      userInfo.value.profile = {
        corpId: userProfile.value.corpId,
        lcCd: userProfile.value.lcCd,
        orgCd: userProfile.value.orgCd,
        empNo: userProfile.value.empNo,
        bpCd: userProfile.value.bpCd
      }

      axios.post( '/api/v1/users/registration'
                , userInfo.value
                , { headers : { Authorization : userStore.AccessToken } } )
      .then( res => {
        if( res.data.code == 0 ) {
          Notify.create({
            type: 'positive',
            message: '사용자가 등록되었습니다.',
            timeout: 600,
            position: 'center'
          })

          loadData( userUid.value )
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
    }
  }

  async function userMod() {
    let valid = await userInfoForm.value.validate();

    if( valid == false ) {
      Notify.create({
        type: 'info',
        message: '필수항목을 확인해주세요.',
        timeout: 600,
        position: 'center'
      })
    } else if ( pwdCheckvalidate.value == false ) {
      Notify.create({
        type: 'negative',
        message: '암호가 일치하지 않습니다. 다시 확인해 주세요.',
        timeout: 600,
        position: 'center'
      })
    } else if ( idCheckvalidate.value == false ) {
      Notify.create({
        type: 'negative',
        message: '사용할 수 없는 아이디입니다. 다시 확인해 주세요.',
        timeout: 600,
        position: 'center'
      })
    } else {
      // userInfo.value.profile = userProfile.value;

      userInfo.value.profile = {
        corpId: userProfile.value.corpId,
        lcCd: userProfile.value.lcCd,
        orgCd: userProfile.value.orgCd,
        empNo: userProfile.value.empNo,
        bpCd: userProfile.value.bpCd
      }

      axios.post( '/api/v1/users/modify'
                , userInfo.value
                , { headers : { Authorization : userStore.AccessToken } } )
      .then( res => {
        if( res.data.code == 0 ) {
          Notify.create({
            type: 'positive',
            message: '사용자 정보가 수정되었습니다.',
            timeout: 600,
            position: 'center'
          })

          loadData( userUid.value )
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

  function initializePassword() {
    Dialog.create({
      title: '비밀번호 초기화',
      message: '비밀번호를 초기화 하시겠습니까?',
      ok: {
          push: true,
          label: '초기화',
          color: 'accent'
      },
      cancel: {
      push: true,
      label: '취소',
      },
      persistent: true
    }).onOk(() => {
      axios.post( `/api/v1/users/initializePassword?userUid=${userInfo.value.userUid}`
              , {}
              , { headers : { Authorization : userStore.AccessToken } } )
      .then( res => {
        if( res.data.code == 0 ) {
          Notify.create({
            type: 'positive',
            message: '비밀번호가 초기화되었습니다.',
            timeout: 600,
            position: 'center'
          })
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
          message: 'API서버를 호출하는 도중 에러가 발생했습니다.',
          timeout: 600
        })
      })
    })
  }

  async function passwordModify() {
    let valid = await changePwdForm.value.validate();

    if( valid == false ) {
      Notify.create({
        type: 'info',
        message: '필수항목을 확인해주세요.',
        timeout: 600,
        position: 'center'
      })
    } else if( newPassword.value != newPasswordCheck.value ) {
      Notify.create({
        type: 'negative',
        message: '암호가 일치하지않습니다.',
        timeout: 600,
        position: 'center'
      })
    }else {
      axios.post( `/api/v1/users/changePassword?userUid=${userInfo.value.userUid}&newPassword=${newPassword.value}`
                , {}
                , { headers : { Authorization : userStore.AccessToken } } )
      .then( res => {
        if( res.data.code == 0 ) {
          Notify.create({
            type: 'positive',
            message: '암호가 변경되었습니다.',
            timeout: 600,
        position: 'center'
          })

          passwordDialogAt.value = false;
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

  function updateCorpValue( e ) {
    userProfile.value.corpId = e;
  }

  function updateLcValue( e ) {
    userProfile.value.lcCd = e;
  }

  function updateOrgValue( e ) {
    userProfile.value.orgCd = e;
  }

  function updateEmpValue( e ) {
    userProfile.value.empNo = e;
  }

  function bizPartvalue( e ) {
    bizPartDialogAt.value = false;

    userProfile.value.bpCd = e.bpCd;
    bpNm.value = e.bpNm;
  }

  onMounted( () => {
    selectMenuAuth()
    selectBoxData()

    userUid.value = history.state.data.userUid;
    if( userUid.value != null ) {
      loadData( userUid.value )
    } else {
      userInfo.value = {
        accountId: null,
        accountName: null,
        accountNickname: null,
        accountPwd: null,
        accountType: 'P',
        extUserAt: 'I',
        active: 'Y',
        email: null,
        mobile: null,
        accountLocked: 'N',
        accountExpiredDt: null,
        useAt: 'Y'
      }

      userProfile.value = {
        corpId: null,
        lcCd: null,
        orgCd: null,
        empNo: null,
        bpCd: null
      }
    }
  })
</script>
