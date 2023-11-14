<template>
  <div>
    <q-select
      dense square outlined
      v-model="orgValue"
      :options="orgList"
      option-label="orgNm"
      option-value="orgCd"
      emit-value
      map-options
      clearable
      clear-icon="clear"
      @update:model-value="updateValue"
    >
      <template v-if="orgValue == '' || orgValue == null" v-slot:selected>
        <div class="text-grey-6">부서 선택</div>
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
    'corpId',
    'lcCd'
  ]);

  const emit = defineEmits([
    "update-value"
  ]);

  const orgValue = ref( '' );
  const corpId = ref( '' );
  const lcCd = ref( '' );
  const orgList = ref([]);

  function loadData() {
    axios.post( '/api/v1/logisticscenter/organization'
              , { corpId: corpId.value, lcCd: lcCd.value }
              , { headers : { Authorization : userStore.AccessToken } } )
    .then( res => {
      if( res.data.code == 0 ) {
        orgList.value = res.data.result;
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

  watch( () => props.lcCd, () => {
    orgValue.value = props.value;
    corpId.value = props.corpId;
    lcCd.value = props.lcCd;

    loadData()
  })

  onMounted( () => {
    loadData()
  })
</script>
