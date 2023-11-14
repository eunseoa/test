<template>
  <q-page class="q-pl-sm q-pr-sm q-pb-sm">
    <div class="row q-pt-sm">
      <q-breadcrumbs>
        <template v-slot:separator>
          <q-icon
            size="1.5em"
            name="chevron_right"
            color="primary"
          ></q-icon>
        </template>
          <q-breadcrumbs-el label="home" icon="home" to="/main" class="text-grey-7"/>
          <q-breadcrumbs-el label="기준정보" icon="info" class="text-grey-7"/>
          <q-breadcrumbs-el label="매입처" icon="shopping_cart_checkout" class="text-blue-10"/>
      </q-breadcrumbs>
    </div>

    <div class="row q-py-lg">
      <div class="text-h5 text-weight-bolder">
        <q-icon name="shopping_cart_checkout" />
        &nbsp;<span>매입처 일괄등록</span>
      </div>
    </div>

    <div>
      <q-stepper
        v-model="step"
        ref="stepper"
        done-color="indigo"
        animated
        style="height: 800px;"
      >
        <q-step
          :name="1"
          title="업로드파일 선택"
          icon="cloud_upload"
          active-icon="cloud_upload"
          :done="step > 1"
        >
          <step1
            @upload-temp="uploadTemp"
          />
        </q-step>

        <q-step
          :name="2"
          title="임시등록"
          icon="save_as"
          active-icon="save_as"
          :done="step > 2"
        >
          <step2
            @go-back="goBack"
            @upload-excel="uploadExcel"
          />
        </q-step>

        <q-step
          :name="3"
          title="마스터 적용 완료"
          icon="done"
          active-icon="done"
          active-color="indigo"
        >
          <step3

          />
        </q-step>
      </q-stepper>
    </div>
  </q-page>
</template>

<script setup>
  import { useUserStore } from 'src/stores/example-store';
  import { ref, onMounted, watch } from 'vue';

  import step1 from 'src/pages/Master/Vendor/MasterVendorUploadSt1.vue';
  import step2 from 'src/pages/Master/Vendor/MasterVendorUploadSt2.vue';
  import step3 from 'src/pages/Master/Vendor/MasterVendorUploadSt3.vue';

  const userStore = useUserStore();

  const step = ref(1);

  function uploadTemp() {

    step.value = 2;
  }

  function goBack() {
    step.value = 1;
  }

  function uploadExcel() {
    step.value = 3;
  }
</script>
