<template>
  <q-card class="my-card" style="width: 700px; max-width: 50vw;">
    <q-card-section class="row items-center">
      <div class="text-h6 text-weight-bold">거래처 담당자 목록</div>

      <q-space />

      <q-btn icon="close" flat round dense v-close-popup></q-btn>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <TuiGrid
        ref="bmTable"
        :columns="bmOptions.columns"
        :data="bmOptions.data"
      />
    </q-card-section>

    <q-card-actions align="center">
      <q-btn square color="blue-grey-7" label="닫기" v-close-popup></q-btn>
    </q-card-actions>
  </q-card>
</template>

<script setup>
  import { useUserStore } from 'src/stores/example-store';
  import { TuiGrid } from "vue3-tui-grid";
  import { ref, onMounted } from 'vue';
  import { Notify } from 'quasar';
  import axios from 'axios';

  const userStore = useUserStore();

  const props = defineProps([
    'bpcd'
  ])

  const bpCd = ref( props.bpcd );

  const bmTable = ref('');
  let bmGrid = null;
  let bmInstance = null;
  const bmOptions = ref({
    columns: [
      {
        header: '담당자',
        name: 'bmNm'
      },
      {
        header: '연락처',
        name: 'bmTelNo',
        minWidth: 140,
        align: 'center'
      },
      {
        header: '핸드폰',
        name: 'bmMobileNo',
        minWidth: 140,
        align: 'center'
      },
      {
        header: '이메일',
        name: 'bmEmail',
        minWidth: 180,
      },
      {
        header: '구분',
        name: 'bmCategoryNm'
      }
    ],
    data: []
  })

  function loadData() {
    axios.get( `/api/v1/partner/manager/`
              , { headers : { Authorization : userStore.AccessToken } } )
    .then( res => {
      if( res.data.code == 0 ) {
        if( res.data.count > 0 ) {
          console.log(res.data.result)

          let data = ( res.data.result ).filter( bm => bm.bpCd === bpCd.value );

          console.log( data )

          bmInstance.resetData( data );
        } else if( res.data.count < 1 ) {
          bmInstance.resetData( [] );
        }
      } else if( res.data.code < 0 ) {
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

  onMounted( () => {
    loadData()

    bmGrid = bmTable.value;
    bmInstance = bmGrid.gridInstance;

    bmGrid.applyTheme( "clean" );
    bmGrid.setLanguage('ko', {
      display: {
        noData: '데이터가 없습니다.',
        loadingData: '데이터가 로딩중입니다.'
      }
    });
    bmInstance.setBodyHeight( 410 );
  })

</script>
