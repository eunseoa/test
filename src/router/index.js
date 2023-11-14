import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import { useUserStore } from 'src/stores/example-store';
import routes from './routes'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE)
});

    const userStore = useUserStore();

    // 네비게이션 가이드
    Router.beforeEach( ( to, from, next ) => {
      // 로그인하지 않았을때
      if( !userStore.UserInfo.accountId ) {
        // meta의 required값이 true인 페이지에 접근하면
        if( to.meta.required ) {
          // 로그인 화면으로 이동
          next( "/login" );
        } else {
          next();
        }
      } else {
        // 로그인되어있을때 로그인 페이지로 이동하려고하면 main 페이지로 이동
        if( to.path == ( "/login" ) ) {
          next( "/main" );
        } else {
          next();
        }
      }
  })

  return Router
})
