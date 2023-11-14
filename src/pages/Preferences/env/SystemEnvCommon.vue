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
          <span class="text-subtitle1 text-weight-bold">거래처 등록시 기본값 설정</span>
          <q-separator color="black"></q-separator>
          <div class="q-gutter-sm q-pa-md">
            <div class="row sysCfigRow">
              <div class="col-lg-4">
                코드 자동 등록 여부
              </div>

              <div class="col-lg-8">
                <q-radio
                  v-bind:disable="menuAuth.modPermAt != true"
                  v-model="keygenUseBp.envValue"
                  checked-icon="task_alt"
                  unchecked-icon="panorama_fish_eye"
                  val="Y"
                  color="teal"
                  label="예"
                />
                <q-radio
                  v-bind:disable="menuAuth.modPermAt != true"
                  v-model="keygenUseBp.envValue"
                  checked-icon="task_alt"
                  unchecked-icon="panorama_fish_eye"
                  val="N"
                  color="red"
                  label="아니오"
                />
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <span class="text-subtitle1 text-weight-bold">직원 등록시 기본값 설정</span>
          <q-separator color="black"></q-separator>

          <div class="q-gutter-sm q-pa-md">
            <div class="row sysCfigRow">
              <div class="col-lg-4">
                사번 자동 등록 여부
              </div>

              <div class="col-lg-8">
                <q-radio
                  v-bind:disable="menuAuth.modPermAt != true"
                  v-model="keygenUseEmp.envValue"
                  checked-icon="task_alt"
                  unchecked-icon="panorama_fish_eye"
                  val="Y"
                  color="teal"
                  label="예"
                />
                <q-radio
                  v-bind:disable="menuAuth.modPermAt != true"
                  v-model="keygenUseEmp.envValue"
                  checked-icon="task_alt"
                  unchecked-icon="panorama_fish_eye"
                  val="N"
                  color="red"
                  label="아니오"
                />
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <span class="text-subtitle1 text-weight-bold">페이지당 조회 건수 기본값 설정</span>
          <q-separator color="black"></q-separator>

          <div class="q-gutter-sm q-pa-md">
            <div class="row sysCfigRow">
              <div class="col-lg-4">
                페이지당 조회 건수
              </div>

              <div class="col-lg-8">
                <q-input
                  dense square outlined
                  v-bind:readonly="menuAuth.modPermAt != true"
                  v-model="rowcountPerPage.envValue"
                >
                  <template v-slot:append>
                    <span class="text-subtitle1">건</span>
                  </template>
                </q-input>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <span class="text-subtitle1 text-weight-bold">
            주변 거래처 검색 반경 거리 설정
          </span>
          <q-separator color="black"></q-separator>

          <div class="q-gutter-sm q-pa-md">
            <div class="row sysCfigRow">
              <div class="col-lg-4">
                주변 거래처 검색 반경 거리
              </div>

              <div class="col-lg-8">
                <q-input
                  dense square outlined
                  v-bind:readonly="menuAuth.modPermAt != true"
                  v-model="aroundRadius.envValue"
                >
                  <template v-slot:append>
                    <span class="text-subtitle1">km</span>
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
  import { ref, onMounted, watch } from 'vue';
  import { useRouter } from 'vue-router';
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

  const keygenUseBp = ref({
    envKey: '',
    envValue: ''
  });
  const keygenUseEmp = ref({
    envKey: '',
    envValue: ''
  });
  const rowcountPerPage = ref({
    envKey: '',
    envValue: ''
  })
  const aroundRadius = ref({
    envKey: '',
    envValue: ''
  })

  function loadData() {
    if( data.value.length > 0 ) {
      data.value = ( data.value ).filter( data => data.category === '일반' );

      keygenUseBp.value = ( ( data.value ).filter( data => data.envKey === 'keygen-use-bp' ) )[0];
      keygenUseEmp.value = ( ( data.value ).filter( data => data.envKey === 'keygen-use-emp' ) )[0];
      rowcountPerPage.value = ( ( data.value ).filter( data => data.envKey === 'rowcount-per-page' ) )[0];
      aroundRadius.value = ( ( data.value ).filter( data => data.envKey === 'default-around-radius' ) )[0];
    }
  }

  function syscfgReg() {

    if ( !keygenUseBp.value.envValue
      || !keygenUseEmp.value.envValue
      || !rowcountPerPage.value.envValue
      || !aroundRadius.value.envValue ) {
        Notify.create({
          type: 'negative',
          message: '입력되지않은 항목이 있습니다.',
          timeout: 600
        })

        return;
      }

    const a = [
      keygenUseBp.value, keygenUseEmp.value, rowcountPerPage.value, aroundRadius.value
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

          loadData()
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

  /*
    자식 -> 부모 순으로 컴포넌트가 mount되기때문에 비동기데이터는 mount된 이후에 넘어옴
    그렇기때문에 부모 컴포넌트에서 데이터가 넘어올때 데이터를 다시 넣어줘야함

    onMounted가 있는 이유는 부모가 mount된 상태에서 자식 컴포넌트를 다시 부를경우 데이터를 넣어줘야하기때문
  */
  watch( () => props.data, () => {
    data.value = props.data

    loadData()
  })

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
