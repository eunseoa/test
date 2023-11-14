<template>
  <div>
    <q-select
      dense square outlined
      v-model="corpValue"
      :options="corpList"
      option-label="corpNm"
      option-value="corpId"
      emit-value
      map-options
      clearable
      clear-icon="clear"
      class="q-pt-sm"
      @update:model-value="updateValue"
    >
      <template v-if="corpValue == '' || corpValue == null" v-slot:selected>
        <div class="text-grey-6">회사 선택</div>
      </template>
    </q-select>
  </div>
</template>

<script setup>
  import { useUserStore } from 'src/stores/example-store';
  import { ref, onMounted, watch } from 'vue';
  import { Notify } from 'quasar';
  import axios from 'axios';

  const userStore = useUserStore();

  const props = defineProps([
    'value'
  ]);

  const emit = defineEmits([
    "update-value"
  ]);

  const corpValue = ref('');
  const corpList = ref([]);

  function loadData() {
    axios.post( '/api/v1/corporation/'
              , {}
              , { headers : { Authorization : userStore.AccessToken } } )
    .then( res => {
      if( res.data.code == 0 ) {
        corpList.value = res.data.result;
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

  function updateValue( e ) {
    emit( 'update-value', e )
  }

  watch( () => props.value, () => {
    corpValue.value = props.value;
  })

  onMounted( () => {
    loadData()
  })
</script>
