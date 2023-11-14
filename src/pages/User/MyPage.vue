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
          <q-breadcrumbs-el label="시스템관리" class="text-grey-7"/>
          <q-breadcrumbs-el label="내정보" icon="account_circle" class="text-blue-10"/>
      </q-breadcrumbs>
    </div>

    <div class="row q-py-lg">
      <div class="text-h5 text-weight-bolder">
        <q-icon name="account_circle"></q-icon>
        &nbsp;<span>내 정보</span>
      </div>
    </div>

    <div class="q-gutter-sm">
      <div class="row">
        <div class="col-lg-12">
          <q-card class="my-card shadow-3" style="width: 100%;">
            <q-card-section>
              <div class="text-h6 text-bold">
                {{ userInfo.accountId }} &nbsp; 계정정보
              </div>
            </q-card-section>

            <q-separator />

            <q-card-section>
              <div class="q-gutter-lg">
                <div class="row q-col-gutter-md">
                  <div class="col-lg-6">
                    계정명<span style="color: red">&nbsp;*</span>
                    <q-input
                      dense square outlined
                      v-bind:disable="menuauth.modPermAt != true"
                      v-model="userInfo.accountName"
                      :rules="[val => !!val || '계정명은 필수항목입니다.']"
                      class="q-pt-sm"
                    />
                  </div>

                  <div class="col-lg-6">
                    계정별칭<span style="color: red">&nbsp;*</span>
                    <q-input
                      dense square outlined
                      v-bind:disable="menuauth.modPermAt != true"
                      v-model="userInfo.accountNickname"
                      :rules="[val => !!val || '계정별칭은 필수항목입니다.']"
                      class="q-pt-sm"
                    />
                  </div>
                </div>

                <div class="row q-col-gutter-md q-mt-none">
                  <div class="col-lg-6">
                    이메일주소
                    <q-input
                      dense square outlined
                      v-bind:disable="menuauth.modPermAt != true"
                      v-model="userInfo.email"
                      class="q-pt-sm"
                      placeholder="user@email.com 형식으로 입력"
                    />
                  </div>

                  <div class="col-lg-6">
                    핸드폰번호
                    <q-input
                      dense square outlined
                      v-bind:disable="menuauth.modPermAt != true"
                      v-model="userInfo.accountTel"
                      class="q-pt-sm"
                      placeholder="010-0000-0000 형식으로 입력"
                    />
                  </div>
                </div>
              </div>
            </q-card-section>

            <q-card-section>
              <div align="right" class="q-gutter-md">
                <q-btn
                  v-if="menuauth.modPermAt == true"
                  color="deep-purple-9"
                  label="암호변경"
                  @click="passwordDialog = true"
                />
                <q-btn
                  v-if="menuauth.modPermAt == true"
                  color="indigo-8"
                  label="저장"
                  @click="userInfoModify"
                 />
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <div v-if="userInfo.accoutType == 'P' && userInfo.extUserAt == 'I'" class="row">
        <div class="col-lg-12">
          <q-card class="my-card shadow-3" style="width: 100%;">
            <q-card-section>
              <div class="text-h6 text-bold">
                사용자 프로필
              </div>
            </q-card-section>

            <q-separator />

            <!--select 마다 목록 가져오기-->
            <q-card-section>
              <div class="q-gutter-lg">
                <div class="row q-col-gutter-md">
                  <div class="col-lg-4">
                    물류센터
                    <q-input
                      dense square outlined v-model="userProfile.lcCd"
                      class="q-pt-sm"
                    />
                  </div>

                  <div class="col-lg-4">
                    부서
                    <q-select
                      dense square outlined
                      v-bind:disable="menuauth.modPermAt != true"
                      v-model="userProfile.orgCd"
                      :options="empList"
                      option-value="cd"
                      option-label="cdNm"
                      emit-value
                      map-options
                      class="q-pt-sm"
                    />
                  </div>

                  <div class="col-lg-4">
                    팀
                    <q-select
                      dense square outlined
                      v-bind:disable="menuauth.modPermAt != true"
                      v-model="userProfile.teamCd"
                      :options="teamList"
                      option-value="cd"
                      option-label="cdNm"
                      emit-value
                      map-options
                      class="q-pt-sm"
                    />
                  </div>
                </div>

                <div class="row q-col-gutter-md">
                  <div class="col-lg-4">
                    직위
                    <q-select
                      dense square outlined
                      v-bind:disable="menuauth.modPermAt != true"
                      v-model="userProfile.empLvl"
                      :options="empLvlList"
                      option-value="cd"
                      option-label="cdNm"
                      emit-value
                      map-options
                      class="q-pt-sm"
                      placeholder="지정안됨"
                    >
                      <template v-slot:selected>
                        <div class="text-grey-6">지정안됨</div>
                      </template>
                    </q-select>
                  </div>

                  <div class="col-lg-4">
                    직책
                    <q-select
                      dense square outlined
                      v-bind:disable="menuauth.modPermAt != true"
                      v-model="userProfile.empRep"
                      :options="empRepList"
                      option-value="cd"
                      option-label="cdNm"
                      emit-value
                      map-options
                      class="q-pt-sm"
                    >
                      <template v-slot:selected>
                        <div class="text-grey-6">지정안됨</div>
                      </template>
                    </q-select>
                  </div>

                  <div class="col-lg-4">
                    직무
                    <q-select
                      dense square outlined
                      v-bind:disable="menuauth.modPermAt != true"
                      v-model="userProfile.empRole"
                      :options="empRoleList"
                      option-value="cd"
                      option-label="cdNm"
                      emit-value
                      map-options
                      class="q-pt-sm"
                    >
                      <template v-slot:selected>
                        <div class="text-grey-6">지정안됨</div>
                      </template>
                    </q-select>
                  </div>
                </div>
              </div>
            </q-card-section>

            <q-card-section>
              <div align="right" class="q-gutter-md">
                <q-btn
                  v-if="menuauth.modPermAt == true"
                  color="indigo-8"
                  label="저장"
                /> <!-- 사용자 프로필 수정하는 부분은 생각해본다고 하심-->
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>

      <div v-if="userInfo.accoutType == 'P' && userInfo.extUserAt == 'E'" class="row">
        <div class="col-lg-12">
          <q-card class="my-card shadow-3" style="width: 100%;">
            <q-card-section>
              <div class="text-h6 text-bold">
                사업장 정보
              </div>
            </q-card-section>

            <q-separator />

            <q-card-section>
              <div class="q-gutter-lg">
                <div class="row q-col-gutter-md">
                  <div class="col-lg-6">
                    브랜드
                    <q-input
                      dense borderless
                      v-bind:disable="menuauth.modPermAt != true"
                      :model-value="'aaaaa'"
                      class="q-pt-sm"
                      readonly
                    />
                  </div>

                  <div class="col-lg-6">
                    사업자등록번호
                    <q-input
                      dense square outlined
                      v-bind:disable="menuauth.modPermAt != true"
                      class="q-pt-sm"
                      placeholder="000-00-00000 형식으로 입력"
                    />
                  </div>
                </div>

                <div class="row q-col-gutter-md">
                  <div class="col-lg-4">
                    대표자
                    <q-input
                      dense square outlined
                      v-bind:disable="menuauth.modPermAt != true"
                      class="q-pt-sm"
                      placeholder="대표자 성명 입력"
                    />
                  </div>

                  <div class="col-lg-4">
                    업태
                    <q-input
                      dense square outlined
                      v-bind:disable="menuauth.modPermAt != true"
                      class="q-pt-sm"
                    />
                  </div>

                  <div class="col-lg-4">
                    종목
                    <q-input
                      dense square outlined
                      v-bind:disable="menuauth.modPermAt != true"
                      class="q-pt-sm"
                    />
                  </div>
                </div>

                <div class="row q-col-gutter-md">
                  <div class="col-lg-12">
                    계산서 발행 주소
                    <div class="row q-col-gutter-sm q-pt-sm">
                      <div class="col-lg-2">
                        <q-input
                          dense square outlined disable
                          v-model="companyAddr.bpPostcode"
                          placeholder="우편번호"
                          />
                      </div>

                      <div class="col-lg-5">
                        <q-input dense square outlined disable
                        v-model="companyAddr.bpAddr"
                        placeholder="우편번호 선택시 자동 입력"
                        />
                      </div>

                      <div class="col-lg-4">
                        <q-input dense square outlined
                          v-bind:disable="menuauth.modPermAt != true"
                          v-model="companyAddr.bpAddrDtl"
                          placeholder="상세주소 입력"
                        />
                      </div>

                      <div class="col-lg-1">
                        <q-btn
                          class="full-width"
                          v-bind:disable="menuauth.modPermAt != true"
                          @click="pastCode( 'bp' )"
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

                <div class="row q-col-gutter-md">
                  <div class="col-lg-12">
                    배송지 주소
                    <div class="row q-col-gutter-sm q-pt-sm">
                      <div class="col-lg-2">
                        <q-input
                          dense square outlined disable
                          v-bind:disable="menuauth.modPermAt != true"
                          v-model="companyAddr.dlvyPostCode"
                          placeholder="우편번호"
                          @click="pastCode"
                          />
                      </div>

                      <div class="col-lg-5">
                        <q-input
                          dense square outlined disable
                          v-bind:disable="menuauth.modPermAt != true"
                          v-model="companyAddr.dlvyAddr"
                          placeholder="우편번호 선택시 자동 입력"
                        />
                      </div>

                      <div class="col-lg-4">
                        <q-input
                          dense square outlined
                          v-bind:disable="menuauth.modPermAt != true"
                          v-model="companyAddr.dlvyAddrDtl"
                          placeholder="상세주소 입력"
                        />
                      </div>

                      <div class="col-lg-1">
                        <q-btn
                          class="full-width"
                          v-bind:disable="menuauth.modPermAt != true"
                          @click="pastCode( 'dlvy' )"
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

                <div class="row q-col-gutter-md">
                  <div class="col-lg-4">
                    핸드폰
                    <q-input
                      dense square outlined
                      v-bind:disable="menuauth.modPermAt != true"
                      class="q-pt-sm"
                      placeholder="010-0000-0000 형식으로 입력"
                    />
                  </div>

                  <div class="col-lg-4">
                    대표 전화번호
                    <q-input
                      dense square outlined
                      v-bind:disable="menuauth.modPermAt != true"
                      class="q-pt-sm"
                      placeholder="&quot;-&quot; 구분자를 포함하여 입력"
                    />
                  </div>

                  <div class="col-lg-4">
                    팩스번호
                    <q-input
                      dense square outlined
                      v-bind:disable="menuauth.modPermAt != true"
                      class="q-pt-sm"
                      placeholder="&quot;-&quot; 구분자를 포함하여 입력"
                    />
                  </div>
                </div>
              </div>
            </q-card-section>

            <q-card-section>
              <div align="right" class="q-gutter-md">
                <q-btn
                  v-if="menuauth.modPermAt == true"
                  color="indigo-8"
                >저장</q-btn>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <q-dialog v-model="passwordDialog" persistent >
      <q-card style="width: 500px; max-width: 80vw;" class="q-pa-sm">
        <q-card-section class="text-center">
          <div class="text-h6 text-bold">비밀번호변경</div>
          <div class="">비밀번호 업데이트 후 다시 로그인하세요</div>
        </q-card-section>

        <q-card-section>
          <div class="q-gutter-lg">
            <div class="row">
              <div class="col-lg-12 q-gutter-sm">
                <div>
                  현재암호 <span style="color: red">*</span>
                </div>
                <div>
                  <q-input type="password" dense square outlined v-model="oldPassword" :rules="[ val => !!val || '현재암호를 입력해주세요']" />
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-lg-12 q-gutter-sm">
                <div>
                  새암호 <span style="color: red">*</span>
                </div>
                <div>
                  <q-input type="password" dense square outlined v-model="newPassword" :rules="[ newPassword_rules ]" />
                </div>
              </div>
            </div>

            <div class="row">
              <div class="col-lg-12 q-gutter-sm">
                <div>
                  새암호 확인 <span style="color: red">*</span>
                </div>
                <div>
                  <q-input type="password" dense square outlined v-model="newPasswordCheck" :rules="[ val => !!val || '새암호 확인을 입력해주세요']" />
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
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
  import { useUserStore } from 'src/stores/example-store'
  import { ref, onMounted } from 'vue'
  import { Notify } from 'quasar'
  import axios from 'axios'

  const userStore = useUserStore();

  let menu = null;

  // 현재 메뉴에 대한 권한
  const menuauth = ref({
    regPermAt: '', // 등록권한
    modPermAt: '', // 수정권한
    delPermAt: '', // 삭제권한
    execPermAt: '', // 실행권한
  });

  const userInfo = ref([]); // 사용자 정보
  const userProfile = ref([]); // 프로필 정보
  // const companyProfile // 사업장 정보
  const passwordDialog = ref(false);
  const oldPassword = ref('');
  const newPassword = ref('');
  const newPasswordCheck = ref('');

  const empList = ref([]);
  const teamList = ref([]);
  const empLvlList = ref([]);
  const empRepList = ref([]);
  const empRoleList = ref([]);

  const companyAddr = ref({
    postCode: '',
    sido: '',
    gugun: '',
    long: '', // 경도 x
    lat: '', // 위도 y
    bpPostcode: '',
    bpAddr: '',
    bpAddrDtl: '',
    bpFullAddr: '',
    dlvyPostCode: '',
    dlvyAddr: '',
    dlvyAddrDtl: '',
    dlvyFullAddr: ''
  })

  /*
    계산서 or 배송지 주소 중에 어떤걸 기준으로 db에 넣는지 ( 우편번호, 시도, 구군, 위도, 경도 )
    현재 코드는 계산서 기준으로 넣을예정
  */

  const newPassword_rules = ( v ) => {
    if( !v ) {
      return '새암호를 입력해주세요.'
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

  // 권한 가져오기
  function selectMenuAuth() {
    menu = userStore.MenuAuthority;
    menu = menu.filter( menu => menu.menuNm === '내정보관리' );

    menuauth.value.regPermAt = menu[0].regPermAt;
    menuauth.value.modPermAt = menu[0].modPermAt;
    menuauth.value.delPermAt = menu[0].delPermAt;
    menuauth.value.execPermAt = menu[0].execPermAt;
  }

  function loadData() {
    userInfo.value = userStore.UserInfo;
    empList.value = ( userStore.commomCode ).filter( code => code.cgId === 'G30' );
    teamList.value = ( userStore.commomCode ).filter( code => code.cgId === 'G31' );
    empLvlList.value = ( userStore.commomCode ).filter( code => code.cgId === 'G24' );
    empRepList.value = ( userStore.commomCode ).filter( code => code.cgId === 'G25' );
    empRoleList.value = ( userStore.commomCode ).filter( code => code.cgId === 'G26' );

    console.log(userStore.AccessToken)

    axios.get( `/api/v1/corporation/employee/${userInfo.value.profile.empNo}`, { headers : { Authorization : userStore.AccessToken } } )
    .then( res => {
      if( res.data.code == 0 ) {
        userProfile.value = res.data.result;
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

  function userInfoModify() {
    if( !userInfo.value.accountName || !userInfo.value.accountNickname ) {
      Notify.create({
        type: 'negative',
        message: '필수항목이 입력되지않았습니다.',
        timeout: 600
      })
    } else {
      axios.post( '/api/v1/users/modify', userInfo.value, { headers : { Authorization : userStore.AccessToken } } )
      .then( res => {
        if( res.data.code == 0 ) {
          userInfo.value = res.data.result;
          userStore.userInfo = res.data.result;

          console.log(res)

          Notify.create({
            type: 'positive',
            message: '정보가 저장되었습니다.',
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

  function passwordModify() {
    if ( !oldPassword.value
        || !newPassword.value
        || !newPasswordCheck.value ) {
      Notify.create({
        type: 'negative',
        message: '입력되지않은 항목이 있습니다.',
        timeout: 600
      })

      return;
    }

    if( newPassword.value != newPasswordCheck.value ) {
      Notify.create({
        type: 'negative',
        message: '새암호를 다시 확인해주세요.',
        timeout: 600
      })
    } else {
      axios.post( '/api/v1/users/modifyPassword', null, { headers : { Authorization : userStore.AccessToken }, params : { userUid: userStore.UserInfo.userUid, oldPassword: oldPassword.value, newPassword: newPassword.value } } )
      .then( res => {
        if( res.data.code == 0 ) {
          Notify.create({
            type: 'positive',
            message: '비밀번호가 변경되었습니다. 다시 로그인해주세요.',
            timeout: 600
          })

          passwordDialog.value = false;
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
  }

  function pastCode( value ) {
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

        if( value == 'bp' ) {
          // 위도 경도 구하기
          const geocoder = new daum.maps.services.Geocoder();

          geocoder.addressSearch( address, ( result, status ) =>{
            if( status === daum.maps.services.Status.OK ) {
              companyAddr.value.long = result[0].x;
              companyAddr.value.lat = result[0].y;
            }
          })

          companyAddr.value.bpAddr = address;
          companyAddr.value.bpPostcode = postCode;
          companyAddr.value.sido = data.sido;
          companyAddr.value.gugun = data.sigungu;
        } else if ( 'dlvy' ) {
          companyAddr.value.dlvyAddr = address;
          companyAddr.value.dlvyPostCode = postCode;
        }
      },
    }).open({
        popupKey: 'popup1'
    })
  }

  onMounted( () => {
    selectMenuAuth()
    loadData()
  })
</script>
