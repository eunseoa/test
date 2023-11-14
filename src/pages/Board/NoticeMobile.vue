<template>
    <q-page>
        <div class="row q-pa-sm">
            <div class="text-h6 text-weight-bolder">
                <q-icon name="subject"></q-icon>
                &nbsp;<span>공지사항</span>
            </div>
        </div>

        <div class="row">
            <q-card flat class="my-card notice-card shadow-3" style="width: 100%; height: 100vh;">
                <div v-for="list1 in list" :key="list1.nttUid" @click="onClickTitle( list1.nttUid )" style="padding: 0;">
                    <q-item clickable v-ripple>
                        <q-item-section>
                            <q-item-label>
                                <q-badge rounded color="indigo-3" :label="list1.nttCategory"></q-badge>
                                {{ list1.nttSubject }}
                            </q-item-label>
                        </q-item-section>

                        <q-item-section side>
                            {{ list1.writeDt }}
                        </q-item-section>
                    </q-item>

                    <q-separator />
                </div>
            </q-card>
        </div>
    </q-page>
</template>

<script>
    import { defineComponent, ref } from 'vue'
    import { useRouter } from "vue-router"

    export default defineComponent ({
        name: 'NoticeMobile',
        setup() {
            const router = useRouter();

            const list = ref([
                {
                    nttUid: '0',
                    nttCategory: '일반',
                    nttSubject: '제목1',
                    readCount: '23',
                    writeDt: '2023-09-23',
                    writeId: 'admin'
                },
                {
                    nttUid: '1',
                    nttCategory: '일반',
                    nttSubject: '제목2',
                    readCount: '23',
                    writeDt: '2023-09-23',
                    writeId: 'admin'
                }
            ])

            function onClickTitle( nttUid ) {
                router.push( {
                    path: "/noticeDetail"
                })
            }

            return {
                list,
                onClickTitle
            }
        }
    })
</script>

<style lang="css">
    .notice-card {
        border-radius: 0;
    }
</style>
