<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex bg-image flex-center">
        <div class="page">
          <q-card class="my-card loginCard q-pt-lg q-pb-lg q-pr-xl q-pl-xl shadow-6">
            <q-card-section>
              <div style="display: flex; justify-content: center; align-items: center;">
                <q-img src="/src/assets/company/loginLogo.png" style="width: 300px; pointer-events: none;"/>
              </div>
            </q-card-section>

            <q-card-section>
              <div class="q-pb-lg">
                <q-input
                  color="indigo-8"
                  v-model="userId"
                  type="text"
                  label="ID"
                  @keyup.enter="login"
                >
                  <template v-slot:before>
                    <q-icon name="person" color="indigo-8" />
                  </template>
                </q-input>
              </div>

              <div class="q-pt-sm q-pb-sm">
                <q-input
                  color="indigo-8"
                  v-model="password"
                  :type="isPwd ? 'password' : 'text'"
                  label="PASSWORD"
                  @keyup.enter="login"
                >
                  <template v-slot:before>
                    <q-icon name="lock" color="indigo-8" />
                  </template>

                  <template v-slot:append>
                    <q-icon
                      color="indigo-8"
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      @click="isPwd = !isPwd"
                      class="cursor-pointer"
                      hint="Password with toggle"></q-icon>
                  </template>
                </q-input>
              </div>
            </q-card-section>

            <div>
              <q-checkbox v-model="rememverId" label="아이디 저장" color="indigo-8" />
            </div>

            <q-card-section>
              <div align="center">
                <q-btn
                  unelevated rounded
                  color="deep-purple-10"
                  label="로그인"
                  class="full-width text-weight-bold"
                  @click="login"
                />
              </div>
            </q-card-section>

            <q-card-section>
              <div align="center">
                <span>아이디 찾기</span>
              </div>

              <div align="center" class="q-pt-sm">
                <span>비밀번호 재설정</span>
              </div>
            </q-card-section>

            <div class="q-pt-sm">
              <div align="center">
                <span class="text-caption" @click="privacy">개인정보 처리방침 &nbsp; | &nbsp; support@email.com</span>
              </div>
            </div>
          </q-card>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from "vue-router"
  import { useUserStore } from 'src/stores/example-store';
  import { LocalStorage, Notify } from 'quasar'

  const userStore = useUserStore();
  const router = useRouter();

  const userId = ref('');
  const password = ref('');
  const isPwd = ref(true); // 비밀번호 확인버튼
  const rememverId = ref(false);

  // 로컬에 아이디 저장
  function setrememverId() {
    LocalStorage.set( "rememverId", rememverId.value );
    LocalStorage.set( "userId", userId.value );
  }

  // 로컬에 저장된 아이디 불러오기
  function loadrememverId() {
    rememverId.value = LocalStorage.getItem( "rememverId" );
    userId.value = LocalStorage.getItem( "userId" );
  }

  // 로컬에 저장된 아이디 삭제
  function removerememverId() {
    LocalStorage.set( "rememverId", false );
    LocalStorage.set( "userId", '' )
  }

  function login() {

    // 아이디, 비밀번호 유효성 검사
    if( !userId.value || !password.value ) {
      Notify.create({
        type: 'negative',
        message: '아이디 또는 비밀번호를 입력해주세요',
        timeout: 600
      })
    } else {

      // 아이디 저장 체크 유무
      if( rememverId ) {
        // 아이디 저장 체크
        setrememverId()
      } else {
        // 아이디 저장 언체크
        removerememverId()
      }

      userStore.login( userId.value, password.value )
        .then( ( res ) => {

          // 로그인 실패
          if( !res.loginSuccess) {
            Notify.create({
              type: 'negative',
              message: res.msg,
              timeout: 600
            })
          }
          // 로그인 성공
          else if( res.loginSuccess ) {
            Notify.create({
              type: 'positive',
              message: res.msg,
              timeout: 350
            })

            // 공통코드
            userStore.loadCommonCode();

            // 사용자그룹
            userStore.loadUserGroup();

            // 환경설정 정보
            userStore.loadSysconfig();

            // 페이지당 조회 건수
            userStore.loadRowPerPage();

            userStore.loadAroundRadius();

            // 로그인 성공하면 main 화면으로 이동
            router.replace( "/main" );
          }
      } )
    }
  }

  function privacy() {
    router.push({
      path: 'privacy'
    })
  }

  onMounted( () => {
    // 로컬에 저장되어있는 아이디 불러오기
    loadrememverId()
  })
</script>

<style lang="css">
  .loginCard {
      border-radius: 30px 30px 30px 30px;
      background-color: white;
      height: 570px;
  }
</style>
