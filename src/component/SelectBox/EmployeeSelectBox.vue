<template>
  <div>
    <q-select
      dense square outlined
      v-model="empValue"
      :options="empList"
      option-label="empNm"
      option-value="empNo"
      emit-value
      map-options
      clearable
      clear-icon="clear"
      class="q-pt-sm"
      @update:model-value="updateValue"
      bottom-slots
    >
      <template v-if="empValue == '' || empValue == null" v-slot:selected>
        <div class="text-grey-6">사원 선택</div>
      </template>

      <template v-if="hint != ''" v-slot:hint>
        {{ hint }}
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
    'lcCd',
    'orgCd',
    'hint'
  ]);

  const emit = defineEmits([
    "update-value"
  ]);

  const empValue = ref( '' );
  const corpId = ref( '' )
  const lcCd = ref( '' );
  const orgCd = ref( '' );
  const hint = ref( '' );
  const empList = ref([]);

  function loadData() {
    axios.post( '/api/v1/corporation/brand'
              , { corpId: corpId.value, lcCd: lcCd.value, orgCd: orgCd.value }
              , { headers : { Authorization : userStore.AccessToken } } )
    .then( res => {
      if( res.data.code == 0 ) {
        empList.value = res.data.result;
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

  watch( () => props.orgCd, () => {
    empValue.value = props.value;
    corpId.value = props.corpId;
    lcCd.value = props.lcCd;
    orgCd.value = props.orgCd;

    loadData()
  })

  onMounted( () => {
    hint.value = props.hint;

    loadData()
  })
</script>
