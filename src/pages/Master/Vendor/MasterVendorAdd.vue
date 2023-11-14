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
        &nbsp;<span>매입처 등록</span>
      </div>
    </div>

    <div>
      <vendorInfo
        :type="type"
      />
    </div>
  </q-page>
</template>

<script setup>
  import { useUserStore } from 'src/stores/example-store';
  import { useRouter } from 'vue-router';
  import { Notify, date } from 'quasar';
  import { ref, onMounted } from 'vue';
  import axios from 'axios';

  import vendorInfo from 'src/pages/Master/Vendor/MasterVendorInfo.vue';

  const type = ref('add')

</script>
