<template>
  <div>
    <div class="row q-col-gutter-md">
      <div class="col-lg-3">
        <q-file class="col-lg-3 col-md-3 col-xs-6 col-sm-12" outlined bottom-slots v-model="file" label="엑셀파일 선택"
          accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/haansoftxlsx" counter max-files="1" @update:model-value="chooseFile">
          </q-file>

          <xlsx-read :file="file" class="col-lg-3 col-md-3 col-xs-6 col-sm-12">
            <xlsx-sheets >
              <template #default="{sheets}">
                <q-select v-model="selectSheet"
                  :options="sheets"
                  option-label="sheet"
                  option-value="sheet"
                  label="시트선택"
                  transition-show="scale"
                  transition-hide="scale"
                  emit-value
                  map-options
                  outlined
                  stack-label
                >
                  <q-tooltip anchor="bottom middle" self="top middle" :offset="[10, 10]">
                    <strong>선택한 엑셀 파일의 시트 목록을 표시됩니다. <br /> 시트 선택 시 자동으로 조회됩니다.</strong>
                  </q-tooltip>
                </q-select>
              </template>
            </xlsx-sheets>
          </xlsx-read>
      </div>


    </div>

    <div class="row q-pt-md">
      <div class="col-lg-10 q-gutter-md">
        <q-btn
          color="red-9"
          padding="6px 40px"
          label="삭제"
        />

        <q-btn
          style="background-color: #253abb; color: #ffffff"
          padding="6px 40px"
          label="초기화"
        />
      </div>

      <div class="col-lg-2">
        <div align="right">
          <q-btn
            href="/src/File/Excel/거래처 업로드 양식.xlsx"
            style="background-color: #253abb; color: #ffffff"
            padding="6px 40px"
            label="양식 다운로드"
          />
        </div>
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
          ref="table"
          :columns="options.columns"
          :data="options.data"
        />
      </div>
    </div>

    <div class="q-pt-lg flex flex-center">
      <q-btn
        label="업로드"
        @click="uploadInTemp"
      />
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue';
  import { XlsxRead, XlsxTable, XlsxSheets, XlsxJson, XlsxWorkbook, XlsxSheet, XlsxDownload } from "vue3-xlsx";
  import { useUserStore } from 'src/stores/example-store';
  import { Notify, Dialog } from 'quasar';
  import { TuiGrid } from "vue3-tui-grid";
  import { useRouter } from 'vue-router';
  import axios from 'axios';


  const userStore = useUserStore();

  const emit = defineEmits([
    'upload-temp'
  ])

  const file = ref(null);
  const selectSheet = ref('');

  const table = ref('');
  let grid = null;
  let instance = null;
  const options = ref({
    columns: [
      {
        header: '테스트'
      }
    ],
    data: []
  })

  function chooseFile( value ) {
    console.log(value)
    file.value = value ? value : null
  }

  /*
    업로드 버튼 클릭
    -> 부모 컴퍼넌트에서 이벤트 발생 시키기
   */
  function uploadInTemp() {
    emit( 'upload-temp', 'aa' )
  }

  onMounted( () => {
    grid = table.value;
    instance = grid.gridInstance;

    grid.applyTheme( "clean", {
      cell: {
        header: {
          background: '#dee7f7'
        },
      }
    });
    grid.setLanguage('ko', {
      display: {
        noData: '데이터가 없습니다.',
        loadingData: '데이터가 로딩중입니다.'
      }
    });
    instance.setBodyHeight( 400 );
  })
</script>
