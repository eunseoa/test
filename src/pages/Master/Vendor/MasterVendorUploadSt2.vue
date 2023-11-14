<template>
  <div class="row">
    <div class="col-lg-10 q-gutter-md">
      <q-btn
        color="red-9"
        padding="6px 40px"
        label="삭제"
      />

      <q-btn
        style="background-color: #253abb; color: #ffffff"
        padding="6px 40px"
        label="저장"
      />
    </div>
  </div>

  <div class="row q-pt-lg">
    <div class="col-lg-12">
      <span class="text-h6 text-bold">
        총 {}건
      </span>
    </div>
  </div>

  <div class="row q-pt-lg">
    <div class="col-lg-12">
      <TuiGrid
        ref="doneTable"
        :columns="doneOptions.columns"
        :data="doneOptions.data"
      />
    </div>
  </div>

  <div class="row q-pt-lg">
    <div class="col-lg-12">
      <span class="text-h6 text-bold">
        실패 총 { / }건
      </span>
    </div>
  </div>

  <div class="row q-pt-lg">
    <div class="col-lg-12">
      <TuiGrid
        ref="failTable"
        :columns="failOptions.columns"
        :data="failOptions.data"
      />
    </div>
  </div>

  <div class="q-pt-lg flex flex-center q-gutter-md">
    <q-btn
      label="뒤로"
      @click="goBack"
    />

    <q-btn
      label="업로드"
      @click="uploadExcelData"
    />
  </div>
</template>

<script setup>
  import { useUserStore } from 'src/stores/example-store';
  import { Notify, Dialog } from 'quasar';
  import { TuiGrid } from "vue3-tui-grid";
  import { useRouter } from 'vue-router';
  import { ref, onMounted } from 'vue';
  import axios from 'axios';

  const userStore = useUserStore();

  const emit = defineEmits([
    'go-back',
    'upload-excel'
  ])

  // 성공테이블
  const doneTable = ref('');
  let doneGrid = null;
  let doneInstance = null;
  const doneOptions = ref({
    columns: [
      {
        header: '테스트'
      }
    ],
    data: []
  })
  // 실패테이블
  const failTable = ref('');
  let failGrid = null;
  let failInstance = null;
  const failOptions = ref({
    columns: [
      {
        header: '테스트'
      }
    ],
    data: []
  })

  function goBack() {
    emit( 'go-back', '' );
  }

  function uploadExcelData() {
    emit( 'upload-excel', '' );
  }

  onMounted( () => {
    // 성공 테이블
    doneGrid = doneTable.value;
    doneInstance = doneGrid.gridInstance;

    doneGrid.applyTheme( "clean", {
      cell: {
        header: {
          background: '#dee7f7'
        },
      }
    });
    doneGrid.setLanguage('ko', {
      display: {
        noData: '데이터가 없습니다.',
        loadingData: '데이터가 로딩중입니다.'
      }
    });
    doneInstance.setBodyHeight( 170 );

    // 실패 테이블
    failGrid = failTable.value;
    failInstance = failGrid.gridInstance;

    failGrid.applyTheme( "clean", {
      cell: {
        header: {
          background: '#dee7f7'
        },
      }
    });
    failGrid.setLanguage('ko', {
      display: {
        noData: '데이터가 없습니다.',
        loadingData: '데이터가 로딩중입니다.'
      }
    });
    failInstance.setBodyHeight( 170 );
  })
</script>
