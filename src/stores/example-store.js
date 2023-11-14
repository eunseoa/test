import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import axios from 'axios';

export const useUserStore = defineStore( "user", {
  state: () => ({
    userInfo: {},
    accessToken: null,
    refreshToken: null,
    menuAuthority: {},
    commomCode: {},
    userGroup: {},
    sysconfig: [],
    rowPerPage: null,
    aroundRadius: null,
  }),
  getters: {
    UserInfo( state ) {
      return state.userInfo
    },
    AccessToken( state ) {
      return state.accessToken
    },
    RefreshToken( state ) {
      return state.refreshToken
    },
    MenuAuthority( state ) {
      return state.menuAuthority
    }
  },
  actions: {
        logOut() {
      this.userInfo = {};
      this.accessToken = null;
      this.refreshToken = null;
      this.menuAuthority = {};
      this.commomCode = {};
      this.userGroup = {};
      this.sysconfig = [];
      this.rowPerPage = null;
      this.aroundRadius = null;
    },
    // 로그인
    async login( userId, userPassword ) {

      let toastMsg = {};

      await api.post( "/login", { username: userId, password: userPassword } )
      .then( res => {
        if( res.data.code == 0 ) {
          this.userInfo = res.data.result;
          this.accessToken = res.data.result.token.authentication;
          this.refreshToken = res.data.result.token.refreshToken;

          toastMsg = { loginSuccess: true, msg: res.data.message }

          // 사용자별 메뉴 접근 권한 조회
          axios.get( `/api/v1/menu/findMenus/${this.userInfo.userUid}`, { headers : { Authorization : this.AccessToken } } )
          .then( res => {
            if( res.data.code == 0 ) {
              this.menuAuthority = res.data.result;
            } else if ( res.data.code < 0 ) {
              toastMsg = { loginSuccess: false, msg: res.data.message }
            }
          })
          .catch( error => {
            toastMsg = { loginSuccess: false, msg: 'API를 호출하는 도중 에러가 발생했습니다.' }
          })
        } else if( res.data.code < 0) {
          toastMsg = { loginSuccess: false, msg: res.data.message }
        }
      })
      .catch( error => {
        if( error.response ) {
          if( error.response.status == 401 ) {
            toastMsg = {
              loginSuccess: false,
              msg: error.response.data.message
            }
          }
        }
      })

      return toastMsg;
    },

    // 공통코드 목록 조회
    loadCommonCode() {
      axios.post( `/api/v1/code/`, {}, { headers : { Authorization : this.AccessToken } } )
      .then( res => {
        this.commomCode = res.data.result;
      })
    },

    // 사용자 그룹 조회
    loadUserGroup() {
      axios.post( `/api/v1/users/group/helper`, {} , { headers : { Authorization : this.AccessToken } } )
      .then( res => {
        this.userGroup = res.data.result;
      })
    },

    // 환경설정 정보
    loadSysconfig() {
      axios.get( `/api/v1/sysconfig/`, { headers : { Authorization : this.AccessToken } } )
      .then( res => {
        this.sysconfig = res.data.result;
      })
    },

    // 페이지당 조회 건수
    loadRowPerPage() {
      axios.get( `/api/v1/sysconfig/?category=일반&envKey=rowcount-per-page`, { headers : { Authorization : this.AccessToken } } )
      .then( res => {
        this.rowPerPage = res.data.result[0].envValue;
      })
    },

    // 주변 거래처 검색 반경 거리
    loadAroundRadius() {
      axios.get( `/api/v1/sysconfig/?category=일반&envKey=default-around-radius`, { headers : { Authorization : this.AccessToken } } )
      .then( res => {
        this.aroundRadius = res.data.result[0].envValue;
      })
    }
  },
  // 로컬스토리지에 저장
  persist: {
    enabled: true,
  },
});
