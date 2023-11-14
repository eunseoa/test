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
          <q-breadcrumbs-el label="회사정보관리" icon="business" class="text-blue-10"/>
      </q-breadcrumbs>
    </div>

    <div class="row q-py-lg">
      <div class="text-h5 text-weight-bolder">
        <q-icon name="business" />
        &nbsp;<span>회사정보관리</span>
      </div>
    </div>

    <div class="row q-col-gutter-sm">
      <div v-if="corpMenuList.length > 1" class="col-lg-2 text-center">
        <q-card class="my-card shadow-3">
          <q-item
            v-for="menu in corpMenuList"
            class="item"
            clickable v-ripple
            @click="selectCorp( menu )"
            :active="corpactive === menu.corpNm"
            active-class="my-menu-link"
          >
            <q-item-section>
              {{ menu.corpNm }}
            </q-item-section>
          </q-item>

          <q-item
              class="item"
              clickable v-ripple
              :active="corpactive == null"
              active-class="my-menu-link"
              @click="selectCorp"
            >
            <q-item-section>
              신규 등록
            </q-item-section>
          </q-item>
        </q-card>
      </div>

      <div :class="corpMenuList.length > 1 ? 'col-lg-10' : 'col-lg-12'">
        <corporaion-info
          :menuauth="menuauth"
          :corpId="corpId"
        ></corporaion-info>
      </div>
    </div>
  </q-page>
</template>

<script setup>
  import { useUserStore } from 'src/stores/example-store';
  import { ref, onMounted } from 'vue';
  import { Notify } from 'quasar'
  import axios from 'axios';

  import CorporaionInfo from 'src/component/Info/CorporationInfo.vue';

  const userStore = useUserStore();

  const corpMenuList = ref([]);
  const corpactive = ref('');
  const corpId = ref(null);

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
    menu = menu.filter( menu => menu.menuNm === '회사정보관리' );

    menuauth.value.regPermAt = menu[0].regPermAt;
    menuauth.value.modPermAt = menu[0].modPermAt;
    menuauth.value.delPermAt = menu[0].delPermAt;
    menuauth.value.execPermAt = menu[0].execPermAt;
  }

  function loadData() {
    axios.post( '/api/v1/corporation/'
              , {}
              , { headers : { Authorization : userStore.AccessToken } } )
    .then( res => {
      if( res.data.code == 0 ) {
        corpMenuList.value = res.data.result;

        corpId.value = corpMenuList.value[0].corpId;
        corpactive.value = corpMenuList.value[0].corpNm;
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

  function selectCorp( corpor ) {
    if ( corpor ) {
      corpactive.value = corpor.corpNm;
      corpId.value = corpor.corpId;
    } else if ( !corpor ) {
      corpactive.value = null;
      corpId.value = null;
    }
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
