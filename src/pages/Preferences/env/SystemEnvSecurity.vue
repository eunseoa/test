<template>
  <div>
    <q-card class="my-card shadow-3" style="height: 700px;">
      <div >
        <q-card-section>
          <div class="row">
            <div class="col-lg-8">
              <q-icon class="text-h4" name="edit_note"></q-icon>
              <span>시스템 로그인과 관련된 옵션입니다.</span>
            </div>

            <div class="col-lg-4">
              <div align="right">
                <q-btn v-if="menuAuth.modPermAt == true" color="indigo-8" label="저장" @click="syscfgReg" />
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <span class="text-subtitle1 text-weight-bold">사용자 등록시 기본값 설정</span>
          <q-separator color="black"></q-separator>
          <div class="q-gutter-sm q-pa-md">
            <div class="row sysCfigRow">
              <div class="col-lg-4">
                기본 사용자 그룹
              </div>

              <div class="col-lg-8">
                <q-select
                  dense square outlined
                  v-bind:readonly="menuAuth.modPermAt != true"
                  v-model="userGroup.envValue"
                  :options="userGrpList"
                  option-value="grpUid"
                  option-label="grpName"
                  emit-value
                  map-options
                />
              </div>
            </div>

            <div class="row sysCfigRow">
              <div class="col-lg-4">
                기본 사용자 역할
              </div>

              <div class="col-lg-8">
                <q-select dense square outlined
                  v-bind:readonly="menuAuth.modPermAt != true"
                  v-model="userRole.envValue"
                  :options="userRoleList"
                  option-value="cd"
                  option-label="cdNm"
                  emit-value
                  map-options
                />
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <span class="text-subtitle1 text-weight-bold">인증 유효시간 설정</span>
          <q-separator color="black"></q-separator>

          <div class="q-gutter-sm q-pa-md">
            <div class="row sysCfigRow">
              <div class="col-lg-4">
                연결 유효시간
              </div>

              <div class="col-lg-8">
                <q-input
                  dense square outlined
                  v-bind:readonly="menuAuth.modPermAt != true"
                  v-model="authDuration.envValue"
                >
                  <template v-slot:append>
                    <span class="text-subtitle1">분</span>
                  </template>
                </q-input>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <span class="text-subtitle1 text-weight-bold">초기화 암호 설정</span>
          <q-separator color="black"></q-separator>

          <div class="q-gutter-sm q-pa-md">
            <div class="row sysCfigRow">
              <div class="col-lg-4">
                초기화 암호
              </div>

              <div class="col-lg-8">
                <q-input
                  dense square outlined
                  v-bind:readonly="menuAuth.modPermAt != true"
                  v-model="initPwd.envValue"
                  :type="isPwd ? 'password' : 'text'">
                  <template v-slot:append>
                    <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" @click="isPwd = !isPwd" class="cursor-pointer" hint="Password with toggle"></q-icon>
                  </template>
                </q-input>
              </div>
            </div>
          </div>
        </q-card-section>
      </div>
    </q-card>
  </div>
</template>

<script setup>
  import { useUserStore } from 'src/stores/example-store';
  import { useRouter } from 'vue-router';
  import { ref, onMounted } from 'vue';
  import { Notify } from 'quasar'
  import axios from 'axios';

  const userStore = useUserStore();
  const router = useRouter();

  const props = defineProps([
    'menuauth',
    'data'
  ]);

  const menuAuth = ref( props.menuauth );
  const data = ref( props.data );

  const userGroup = ref({}); // 기본 사용자 그룹
  const userRole = ref({}); // 기본 사용자 역할
  const authDuration = ref({}); // 연결 유효시간
  const initPwd = ref([]); // 초기화 암호
  const userGrpList = ref([]); // 사용자그룹 목록
  const userRoleList = ref([]); // 사용자역할 목록
  const isPwd = ref(true); // 비밀번호 확인버튼

  function loadData() {

    // 사용자 그룹 목록
    userGrpList.value = userStore.userGroup;

    // 사용자역할 목록
    userRoleList.value = ( userStore.commomCode ).filter( code => code.cgId === 'S03' );

    data.value = ( data.value ).filter( data => data.category === '보안' );

    authDuration.value = ( ( data.value ).filter( data => data.envKey === 'auth-duration' ) )[0];
    userGroup.value = ( ( data.value ).filter( data => data.envKey === 'default-user-group' ) )[0];
    userRole.value = ( ( data.value ).filter( data => data.envKey === 'default-user-role' ) )[0];
    initPwd.value = ( ( data.value ).filter( data => data.envKey === 'default-init-pwd' ) )[0];
  }

  function syscfgReg() {

    if ( !authDuration.value.envValue
      || !userGroup.value.envValue
      || !userRole.value.envValue
      || !initPwd.value.envValue ) {
        Notify.create({
          type: 'negative',
          message: '입력되지않은 항목이 있습니다.',
          timeout: 600
        })

        return;
      }

    const a = [
      authDuration.value, userGroup.value, userRole.value, initPwd.value
    ]

    for( let i in a ) {
      axios.post( '/api/v1/sysconfig/registration', a[i], { headers : { Authorization : userStore.AccessToken } } )
      .then( res => {
        if( res.data.code == 0 ) {
          Notify.create({
            type: 'positive',
            message: '정보가 저장되었습니다.',
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

  onMounted( () => {
    loadData()
  })
</script>

<style lang="css">
  .sysCfigRow {
    width: 60%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
