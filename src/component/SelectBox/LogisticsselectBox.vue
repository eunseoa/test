<template>
  <div>
    <q-select
      dense square outlined
      v-model="logisValue"
      :options="logisList"
      option-label="lcNm"
      option-value="lcCd"
      emit-value
      map-options
      clearable
      clear-icon="clear"
      @update:model-value="updateValue"
    >
      <template v-if="logisValue == '' || logisValue == null" v-slot:selected>
        <div class="text-grey-6">물류센터 선택</div>
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
    'value',
    'corpId'
  ]);

  const emit = defineEmits([
    "update-value"
  ]);

  const logisValue = ref( '' );
  const corpId = ref( '' )
  const logisList = ref([]);

  function loadData() {
    axios.post( '/api/v1/logisticscenter/'
              , { corpId: corpId.value }
              , { headers : { Authorization : userStore.AccessToken } } )
    .then( res => {
      if( res.data.code == 0 ) {
        logisList.value = res.data.result;
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

  watch( () => props.corpId, () => {
    corpId.value = props.corpId;

    loadData()
  })

  watch( () => props.value, () => {
    logisValue.value = props.value;
  })

  onMounted( () => {
    loadData()
  })
</script>
