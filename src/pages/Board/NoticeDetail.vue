<template>
    <q-page class="q-pl-md q-pr-md q-ml-sm q-mr-sm">
        <div class="row q-pt-sm">
            <q-breadcrumbs>
                <q-breadcrumbs-el label="대시보드" icon="home" to="/main" class="text-grey"></q-breadcrumbs-el>
                <q-breadcrumbs-el label="공지사항" icon="subject" to="/notice" class="text-grey"></q-breadcrumbs-el>
                <q-breadcrumbs-el label="공지사항 상세" icon="sticky_note_2 "></q-breadcrumbs-el>
            </q-breadcrumbs>
        </div>

        <div class="row q-py-lg">
            <div class="text-h5 text-weight-bolder">
                <q-icon name="sticky_note_2"></q-icon>
                &nbsp;<span>공지사항 상세</span>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-12">
                <q-card class="my-card shadow-3" style="width: 100%;">
                    <div class="q-pa-lg">
                        <q-card-section>
                            <div v-if="true" class="text-h6 text-weight-bold">
                                공지사항입니다.
                            </div>

                            <div v-if="false">
                                <q-input outlined></q-input>
                            </div>
                        </q-card-section>

                        <q-separator />

                        <q-card-section>
                            <div align="right">
                                admin | 2023-09-24 18:23:00 | 조회수 : 34
                            </div>
                        </q-card-section>

                        <q-card-section>
                            <div v-show="true">
                                <div ref="editor"/>
                                <q-btn @click="Aclick">클릭</q-btn>
                            </div>
                            <div v-if="true">
                                <div ref="viewer" style="height: 200px;"></div>
                            </div>
                        </q-card-section>

                        <q-card-section>
                            <div v-if="true">
                                <q-file dense outlined v-model="model" label="파일업로드">
                                    <template v-slot:prepend>
                                        <q-icon name="attach_file"></q-icon>
                                    </template>
                                </q-file>
                            </div>
                            <div v-if="true">
                                <span style="padding: 20px;">
                                    <q-btn outline color="indigo-9" icon="file_download" label="파일이름"></q-btn>
                                </span>
                            </div>
                        </q-card-section>

                        <div v-if="true">
                            <q-separator />

                            <div align="right" class="q-gutter-sm q-pt-md">
                                <q-btn color="red-4" label="삭제"></q-btn>
                                <q-btn color="indigo-7" icon="done" label="저장"></q-btn>
                            </div>
                        </div>
                    </div>
                 </q-card>
            </div>
        </div>
    </q-page>
</template>


<script setup>
    import Editor from '@toast-ui/editor';
    import Viewer from '@toast-ui/editor/dist/toastui-editor-viewer';
    import '@toast-ui/editor/dist/toastui-editor.css';
    import '@toast-ui/editor/dist/toastui-editor-viewer.css';
    import { ref, onMounted } from 'vue'

    const props = defineProps({
        modelValue: {
            type: String,
            required: false,
            default: '',
        },
    });

    const emit = defineEmits(['update:modelValue']);
    const editor = ref();
    const viewer = ref();
    let e = null;
    let v = null;

    let result = '<ta><br>'


    onMounted(() => {
        e = new Editor({
            el: editor.value,
            height: '500px',
            initialEditType: 'wysiwyg',
            previewStyle: 'vertical',
            initialValue: `<table><thead><tr><th><p><br></p></th><th><p><br></p></th><th><p><br></p></th><th><p><br></p></th><th><p><br></p></th></tr></thead><tbody><tr><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td></tr><tr><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td></tr><tr><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td></tr><tr><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td></tr><tr><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td><td><p><br></p></td></tr></tbody></table>`,
        });
    });

    function Aclick() {
        result = e.getHTML();

        console.log(result)


        v = new Viewer({
            el: viewer.value,
            initialValue: result
        })

        e.setHTML(result)
    }

</script>
