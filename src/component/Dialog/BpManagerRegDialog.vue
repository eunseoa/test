<template>
  <q-card class="my-card" style="width: 600px; max-width: 50vw;">
    <q-card-section class="row items-center">
      <div class="text-h6 text-weight-bold">담당자 등록</div>

      <q-space />

      <q-btn icon="close" flat round dense v-close-popup></q-btn>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <q-icon
        name="priority_high"
        size="lg"
      />
      <span class="text-body1 text-bold" style="color: #4682B4; text-decoration: underline;">
        {{ bpNm }}
      </span>
      <span class="text-body1">
        의 업무 담당자를 등록합니다.
      </span>
    </q-card-section>

    <q-card-section class="q-mx-md">
      <q-form ref="bmForm">
        <div class="q-ma-none q-pb-lg">
          구분
          <q-select
            dense square outlined
            v-model="bmInfo.bmCategory"
            :options="bmCategoryList"
            option-label="cdNm"
            option-value="cd"
            emit-value
            map-options
            class="q-pt-sm"
          ></q-select>
        </div>

        <div class="q-ma-none q-pb-sm">
          담당자 <span style="color:red"> * </span>
          <q-input
            dense square outlined
            v-model="bmInfo.bmNm"
            class="q-pt-sm"
            :rules="[ val => !!val || '담당자명은 필수항목입니다.' ]"
            lazy-rules
            placeholder="담당자명 입력"
            hint="필수항목입니다."
          />
        </div>

        <div class="q-ma-none q-pb-sm">
          전화번호
          <q-input
            dense square outlined
            v-model="bmInfo.bmTelNo"
            class="q-pt-sm"
            :rules="[ telNo_rules ]"
            lazy-rules
            placeholder="010-0000-0000 형식"
          />
        </div>

        <div class="q-ma-none q-pb-sm">
          핸드폰
          <q-input
            dense square outlined
            v-model="bmInfo.bmMobileNo"
            class="q-pt-sm"
            :rules="[ telNo_rules ]"
            lazy-rules
            placeholder="010-0000-0000 형식"
          />
        </div>

        <div class="q-ma-none q-pb-md">
          이메일주소
          <q-input
            dense square outlined
            v-model="bmInfo.bmEmail"
            class="q-pt-sm"
            :rules="[ email_rules ]"
            lazy-rules
            placeholder="username@email.com 형식"
          />
        </div>
      </q-form>
    </q-card-section>

    <q-card-actions align="center" class="q-pb-lg">
      <q-btn square color="green-6" label="등록" @click="bmInfoReg"></q-btn>
      <q-btn square color="blue-grey-7" label="취소" v-close-popup></q-btn>
    </q-card-actions>
  </q-card>
</template>

<script setup>
  import { useUserStore } from 'src/stores/example-store';
  import { Notify } from 'quasar';
  import { ref, onMounted } from 'vue';
  import axios from 'axios';

  const userStore = useUserStore();

  const props = defineProps([
    'bpcd',
    'bpnm'
  ])

  const emit = defineEmits([
    'reg-success'
  ]);

  const bpCd = ref( props.bpcd );
  const bpNm = ref( props.bpnm );
  const bmForm = ref(null);
  const bmCategoryList = ref([]);
  const bmInfo = ref({
    bmNm: '',
    bmTelNo: '',
    bmMobileNo: '',
    bmEmail: '',
    bmCategory: '10',
    bpCd: bpCd.value
  })

  const email_rules = ( v ) => {
    const email = v.match(/[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]/g);
    if( !email ) {
      return '이메일 형식에 맞춰 입력해주세요.';
    }
  }

  const telNo_rules = ( v ) => {
    const tel = v.match(/\d{2,}-\d{4}-\d{4}/g);
    if( !tel ) {
      return '전화번호 형식에 맞춰 입력해주세요.';
    }
  }

  function selectBoxData() {
    bmCategoryList.value = ( userStore.commomCode ).filter( code => code.cgId === 'G20' );
  }

  async function bmInfoReg() {
    let valid = await bmForm.value.validate();

    if( valid == false ) {
      Notify.create({
        type: 'negative',
        message: '입력내용을 확인해주세요.',
        timeout: 600,
        position: 'center'
      })
    } else {
      axios.post( '/api/v1/partner/manager/registration'
                , bmInfo.value
                , { headers : { Authorization : userStore.AccessToken } } )
      .then( res => {
        if( res.data.code == 0 ) {
          emit( 'reg-success', 'success' );
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

  onMounted( () => {
    selectBoxData()
  })

</script>
