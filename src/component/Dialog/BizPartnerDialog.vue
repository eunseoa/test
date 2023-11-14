<template>
  <q-card style="width: 1400px; max-width: 70vw;">
    <q-card-section class="row items-center">
      <div class="text-h6 text-weight-bold">거래처 검색</div>

      <q-space />

      <q-btn icon="close" flat round dense v-close-popup></q-btn>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <div class="row q-col-gutter-sm">
        <div class="col-lg-3">
          <q-select
            dense square outlined
            v-model="brandSearch"
            :options="selectBoxBrand"
            option-value="brdCd"
            option-label="brdNm"
            emit-value map-options
          >
            <template v-if="brandSearch == ''" v-slot:selected>
              <div class="text-grey-6">브랜드 선택</div>
            </template>
          </q-select>
        </div>

        <div class="col-lg-4">
          <q-input
            dense square outlined
            @keyup.enter="bizPartData"
            v-model="bizPartSearch"
            placeholder="코드 또는 명칭"
          />
        </div>

        <div class="col-lg-2">
          <q-btn
            label="조회"
            color="indigo-7"
            @click="bizPartData"
          />
        </div>
      </div>
    </q-card-section>

    <q-card-section>
      <TuiGrid
        ref="bizPartTable"
        :columns="bizPartOptions.columns"
        :data="bizPartOptions.data"
      />
    </q-card-section>

    <div class="q-pa-lg flex flex-center">
      <q-pagination
        v-model="clickPage"
        :max="pageSize"
        input
        color="indigo-8"
        @update:model-value="bizPartData"
      />
    </div>

    <q-card-actions align="right">
      <q-btn flat label="선택" @click="bizPartClick"></q-btn>
      <q-btn flat label="취소" v-close-popup></q-btn>
    </q-card-actions>
  </q-card>
</template>

<script setup>
  import { useUserStore } from 'src/stores/example-store';
  import { ref, onMounted } from 'vue';
  import { TuiGrid } from "vue3-tui-grid";
  import { useRouter } from 'vue-router';
  import { Notify } from 'quasar';
  import axios from 'axios';

  const userStore = useUserStore();
  const router = useRouter();

  const props = defineProps([
    'bpCd'
  ])

  const emit = defineEmits([
    "bizpart-value"
  ]);

  let bizPartGrid = null;
  let bizPartInstance = null;
  const bizPartTable = ref('');
  let bpClickRow = null; // 현재선택된 거래처
  const clickPage = ref(1);
  const pageSize = ref('');
  const rowcountPerPage = ref(0);
  const selectBoxBrand = ref([]); // 셀렉트 박스용 브랜드 리스트

  const bizPartDialog = ref(false);
  const brandSearch = ref('');
  const bizPartSearch = ref('');

  const bizPartOptions = ref({
    columns: [
      {
        header: '코드',
        name: 'bpCd',
        minWidth: 90,
        align: 'center'
      },
      {
        header: '거래처명',
        name: 'bpNm',
        minWidth: 270
      },
      {
        header: '사업자번호',
        name: 'bizRegNo',
        minWidth: 150,
        align: 'center'
      },
      {
        header: '대표자',
        name: 'ceoNm',
        minWidth: 130
      },
      {
        header: '연락처',
        name: 'bpTelNo',
        minWidth: 150
      },
      {
        header: '거래처유형',
        name: 'bpTypeNm',
        minWidth: 100
      },
      {
        header: '거래상태',
        name: 'transactionStatusNm',
        minWidth: 100
      },
      {
        header: '사용여부',
        name: 'useAtNm',
        minWidth: 100
      }
    ],
    data: []
  })

  function bizPartData() {
    rowcountPerPage.value = ( ( data.value ).filter( data => data.envKey === 'rowcount-per-page' ) )[0];

    bizPartGrid = bizPartTable.value;
    bizPartInstance = bizPartGrid.gridInstance;

    bizPartGrid.applyTheme( "clean" );
    bizPartInstance.setBodyHeight(480);

    axios.get( `/api/v1/partner/helper?bpNm=${bizPartSearch.value}&bpType=S&transactionStatus=O&useAt=Y&pageNumber=${clickPage.value}&rowCountPerPage=${rowcountPerPage.value}`
            , { headers : { Authorization : userStore.AccessToken } } )
    .then( res => {
      if( res.data.code == 0 ) {
        if( res.data.count > 0 ) {
          bizPartInstance.resetData( res.data.result );

          clickPage.value = res.data.page;
          pageSize.value = res.data.pageSize;
        } else {
          bizPartInstance.resetData( [] );

          clickPage.value = res.data.page;
          pageSize.value = res.data.pageSize;
        }
      } else if( res.data.code < 0) {
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

    bizPartInstance.on( 'click', ( ev ) => {
      if ( ev.targetType == 'cell' ) {
        for( let i = 0; i<bizPartInstance.getRowCount(); i++ ) {
          bizPartInstance.removeRowClassName( i, 'row-click-yellow' )
        }

        bizPartInstance.addRowClassName( ev.rowKey, 'row-click-yellow' );

        bpClickRow = ev.rowKey;
      }
    })
  }

  function bizPartClick() {
    bizPartDialog.value = false;

    if( bpClickRow != null ) {
      let row = bizPartInstance.getRow( bpClickRow );
      emit( 'bizpart-value', { bpCd: row.bpCd, bpNm: row.bpNm } )
    }

    bpClickRow = null;
  }

  onMounted( () => {
    bizPartData()

    if( props.bpCd ) {
      bizPartSearch.value = props.bpCd;
    }
  })
</script>
