import { boot } from 'quasar/wrappers'
import axios from 'axios'

const API_URL = config.API_URL;

const api = axios.create({
              baseURL: API_URL,
              withCredentials: true
            })

export default boot(({ app }) => {

  // 요청 인터셉터
  api.interceptors.request.use(
    function( config ) {


      // 요청 성공
      return config;
    },
    // 요청 에러
    function( error ) {

      return Promise.reject( error );
    }
  );

  // 응답 인터셉터
  api.interceptors.response.use(
    function( response ) {
      // 응답 성공
      return response
    },
    // 응답 에러
    function( error ) {

      return Promise.reject( error );
    }
  );

	app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;

})

export { axios, api }
