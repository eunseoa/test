<template>
  <div>
    <q-select
      dense square outlined
      v-model="brandValue"
      :options="brandList"
      option-label="brdShortNm"
      option-value="brdCd"
      emit-value
      map-options
      clearable
      clear-icon="clear"
      @update:model-value="updateValue"
    >
      <template v-if="brandValue == '' || brandValue == null" v-slot:selected>
        <div class="text-grey-6">브랜드 선택</div>
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

  const brandValue = ref( '' );
  const brandList = ref([]);

  function loadData() {
    axios.post( '/api/v1/corporation/brand'
              , { }
              , { headers : { Authorization : userStore.AccessToken } } )
    .then( res => {
      if( res.data.code == 0 ) {
        brandList.value = res.data.result;
      } else if ( res.data.code < 0 ) {
        Notify.create({
          type: 'negative',
          message: res.data.message,
          timeout: 600,
          position: 'center'
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
    brandValue.value = props.value;
  })

  onMounted( () => {
    loadData()
  })
</script>
