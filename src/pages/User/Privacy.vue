<template>
  <div class="q-pa-md">
    <div class="row">
      <div class="col-lg-12">
        <div class="text-h4 text-weight-bolder text-center">개인정보처리방침</div>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
      <q-layout>
        <q-page-container>
          <q-page padding>
            <p v-for="n in 40" :key="n">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit nihil praesentium molestias a adipisci, dolore vitae odit, quidem consequatur optio voluptates asperiores pariatur eos numquam rerum delectus commodi perferendis voluptate?
            </p>

            <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[30, 70]">
              <q-btn fab icon="keyboard_arrow_up" color="deep-purple-7"></q-btn>
            </q-page-scroller>
          </q-page>
        </q-page-container>
      </q-layout>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-12">
        <q-btn to="/login" color="indigo-9" class="full-width" label="확인"></q-btn>
      </div>
    </div>
  </div>
</template>
