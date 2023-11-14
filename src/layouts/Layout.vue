<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-grey-2 text-primary">
      <q-toolbar>
        <q-btn flat @click="drawer = !drawer" round dense icon="menu"></q-btn>

        <q-toolbar-title></q-toolbar-title>

        <q-btn round dense flat color="black" :icon="$q.fullscreen.isActive ? 'fullscreen_exit' : 'fullscreen'"
                @click="$q.fullscreen.toggle()"
                v-if="$q.screen.gt.sm">
        </q-btn>

        <q-btn round dense flat color="black" icon="notifications">
          <q-badge color="red" text-color="white" floating >
            34
          </q-badge>
          <q-menu>
            <q-list style="min-width: 320px">
              <q-card class="text-center no-shadow no-border">
                <q-btn label="View All" style="max-width: 120px !important;" flat dense
                        class="text-indigo-8"></q-btn>
              </q-card>
            </q-list>
          </q-menu>
        </q-btn>

        <q-btn round dense flat color="black" icon="account_circle">
          <q-menu>
            <q-list style="min-width: 120px">
              <q-card class="text-center no-shadow no-border">
                <q-btn to="/mypage" label="마이페이지" style="max-width: 120px !important;" flat class="text-indigo-8 full-width"></q-btn><br>
                <q-btn @click="logout()" label="로그아웃" style="max-width: 120px !important;" flat class="text-indigo-8 full-width"></q-btn>
              </q-card>
            </q-list>
          </q-menu>
        </q-btn>

      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawer"
      show-if-above
      :width="250"
      :breakpoint="400"
      class="bg-grey-1 text-grey-8"
    >
      <q-scroll-area style="height: calc(100%); border-right: 1px solid #ddd">
        <q-list padding class="menu-list">

          <q-item>
            <q-item-section >
              <q-img :src="logoUrl" style="pointer-events: none;"/>
            </q-item-section>
            <q-item-section>
              <div class="text-subtitle2 text-weight-bold text-right">
                {{ unsername }}님
              </div>
            </q-item-section>
          </q-item>

          <q-separator />

          <div v-for="header in menuList" :key="header.menuUid">
            <q-item-label header v-if="header.menuType == 'S'" style="padding-bottom: 0;">
              <span class="text-subtitle1 text-weight-bold text-black">
                {{ header.menuShortNm }}
              </span>
            </q-item-label>

            <div v-for="menu in header._children" :key="menu.menuUid">
              <q-item v-if="menu.menuType == 'M' && menu._children == null" :key="menu.menuUid" clickable v-ripple class="item" :to="menu.toPath" active-class="my-menu-link">
                <q-item-section avatar>
                  <q-icon :name="menu.menuIcon"></q-icon>
                </q-item-section>
                <q-item-section>
                  <q-item-label >{{ menu.menuShortNm }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-expansion-item v-else-if="menu.menuType == 'D' && menu._children != null" :label="menu.menuShortNm" :icon="menu.menuIcon">
                <div v-for="menuChild in menu._children">
                  <div v-if="menu.menuUid == menuChild.parentUid">
                    <q-item clickable v-ripple class="item" :to="menuChild.toPath" active-class="my-menu-link">
                      <q-item-section avatar class="q-pl-lg">
                        <q-icon :name="menuChild.menuIcon"></q-icon>
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ menuChild.menuShortNm }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </div>
                </div>
              </q-expansion-item>
            </div>

            <q-separator />
          </div>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <div class="container">
      <q-page-container style="height:100%;">
        <router-view/>
      </q-page-container>
    </div>
  </q-layout>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import { useUserStore } from 'src/stores/example-store';
  import { useRouter } from "vue-router";
  import { Notify } from 'quasar'
  import { api } from 'src/boot/axios';
  import axios from 'axios';

  const userStore = useUserStore();
  const router = useRouter();

  const drawer = ref(false);
  const menuList = ref({});
  const unsername = ref('');
  const logoUrl = ref('');

   async function loadData() {
    await axios.get( `/api/v1/users/authority/findResources/${userStore.UserInfo.accountId}`
                  , { headers : { Authorization : userStore.AccessToken } } )
    .then( res => {
      if( res.data.code == 0 ) {
        menuList.value = res.data.result;

        corpLogoImg()
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

    unsername.value = userStore.UserInfo.accountName;
  };

  function corpLogoImg() {
    let corpId = userStore.userInfo.profile.corpId;

    if( corpId ) {
      axios.get( `/api/v1/corporation/${corpId}`
                , { headers : { Authorization : userStore.AccessToken } } )
      .then( res => {
        if( res.data.code == 0 ) {
          if( res.data.result.logoImageData ) {
            api.get( `/images${res.data.result.logoImageData.relativePath}/${res.data.result.logoImageData.storeFileNm}` )
            .then( res => {
              logoUrl.value = res.config.baseURL + res.config.url;
            })
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
        if( error.response ) {
          Notify.create({
            type: 'negative',
            message: 'API를 호출하는 도중 에러가 발생했습니다.',
            timeout: 600
          })
        }
      })
    }
  }

  function logout() {
    userStore.logOut()

    router.replace( '/login' );
  }

  onMounted( () => {
    loadData()
  })
</script>

<style lang="css">
  .my-menu-link {
    color: #ffffff;
    background: #455a64;
    opacity: 0.7;
  }

  .container {
    background-color: #f5f5f5;
  }
</style>
