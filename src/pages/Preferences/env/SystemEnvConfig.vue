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
          <q-breadcrumbs-el label="시스템설정" icon="settings_suggest" class="text-grey-7"/>
          <q-breadcrumbs-el label="환경설정" icon="settings" class="text-blue-10"/>
      </q-breadcrumbs>
    </div>

    <div class="row q-py-lg">
      <div class="text-h5 text-weight-bolder">
        <q-icon name="settings"></q-icon>
        &nbsp;<span>시스템환경설정</span>
      </div>
    </div>

    <div class="row q-col-gutter-sm">
      <div class="col-lg-2 text-center">
        <q-card class="my-card shadow-3">
          <q-item
              v-for="syscfg in syscfgList"
              class="item"
              clickable v-ripple
              @click="syscfgactive = syscfg;"
              :active="syscfgactive === syscfg"
              active-class="my-menu-link"
            >
            <q-item-section>
              {{ syscfg }}
            </q-item-section>
          </q-item>
        </q-card>
      </div>

      <div class="col-lg-10">
        <div v-if="syscfgactive == '일반'">
          <syscfg-common :menuauth="menuauth" :data="data"></syscfg-common>
        </div>

        <div v-if="syscfgactive == '보안'">
          <syscfg-security :menuauth="menuauth" :data="data"></syscfg-security>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
  import { useUserStore } from 'src/stores/example-store';
  import { ref, onMounted } from 'vue';
  import { Notify } from 'quasar'
  import axios from 'axios';

  import SyscfgSecurity from 'src/pages/Preferences/env/SystemEnvSecurity.vue';
  import SyscfgCommon from 'src/pages/Preferences/env/SystemEnvCommon.vue';

  const userStore = useUserStore();

  let menu = null;

  // 현재 메뉴에 대한 권한
  const menuauth = ref({
    regPermAt: '', // 등록권한
    modPermAt: '', // 수정권한
    delPermAt: '', // 삭제권한
    execPermAt: '', // 실행권한
  });

  const data = ref([]);

  const syscfgList = ref([ '일반', '매입', '매출', '보안' ]); // 환경설정 목록
  const syscfgactive = ref('일반');

  // 권한 가져오기
  function selectMenuAuth() {
    menu = userStore.MenuAuthority;
    menu = menu.filter( menu => menu.menuNm === '시스템환경설정' );

    menuauth.value.regPermAt = menu[0].regPermAt;
    menuauth.value.modPermAt = menu[0].modPermAt;
    menuauth.value.delPermAt = menu[0].delPermAt;
    menuauth.value.execPermAt = menu[0].execPermAt;
  }

  function loadData() {
    axios.get( `/api/v1/sysconfig/?category`, { headers : { Authorization : userStore.AccessToken } } )
    .then( res => {
      if( res.data.code == 0 ) {
        data.value = res.data.result;
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

  onMounted( () => {
    selectMenuAuth()
    loadData()
  })
</script>

<style lang="css">
  .my-menu-link {
    color: white;
    background: #78909c;
  }
</style>
