<template>
    <q-page class="q-pl-md q-pr-md">
        <div class="row q-pt-sm">
            <q-breadcrumbs>
                <q-breadcrumbs-el label="대시보드" icon="home" to="/main" class="text-grey"></q-breadcrumbs-el>
                <q-breadcrumbs-el label="공지사항" icon="subject" to="/notice"></q-breadcrumbs-el>
            </q-breadcrumbs>
        </div>

        <div class="row q-py-lg">
            <div class="text-h5 text-weight-bolder">
                <q-icon name="subject"></q-icon>
                &nbsp;<span>공지사항</span>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-12">
                <q-card class="my-card shadow-3" style="width: 100%;">
                    <q-card-section>
                        <div class="row q-gutter-sm">
                            <q-select square outlined dense v-model="select1" :options="select1Options" class="selectbox"></q-select>
                            <q-select square outlined dense v-model="select2" :options="select2Options" class="selectbox"></q-select>
                            <q-input dense v-model="search" class="noteSearch" placeholder="검색어를 입력해주세요">
                                <template v-slot:append>
                                <q-btn round dense flat icon="search"></q-btn>
                                </template>
                            </q-input>
                        </div>
                    </q-card-section>
                    <div class="q-pb-sm">
                        <TuiGrid
                          ref="GridTable"
                          :columns="gridProps.columns"
                          :data="gridProps.data"
                          :options="gridProps.options"
                          :pageOptions="gridProps.pageOptions"
                          :theme="'clean'"
                          @dblclick="dblclick"
                        />
                    </div>
                </q-card>
            </div>
        </div>
    </q-page>
</template>

<script setup lang="ts">
    import { ref, onMounted } from 'vue'
    import { useRouter } from "vue-router"
    import { TuiGrid } from "vue3-tui-grid"

    import 'tui-grid/dist/tui-grid.css'
    import 'tui-pagination/dist/tui-pagination.css';

    const router = useRouter();

    const select1 = ref('');
    const select2 = ref('');

    const select1Options = ref([
        'option1', 'options2'
    ])

    const select2Options = ref([
        'option1', 'options2'
    ])

    const search = ref('');

    const GridTable = ref();

    const noticeList = [
        {
            bbsId: 'A01',
            nttUid: 'A01-01',
            nttCategory: '일반',
            nttSubject: '테스트',
            nttContent: '테스트',
            topLockAt: 'Y',
            writeDt: '2023-09-23',
            writeId: 'admin',
            readCount: '31'
        },
        {
            bbsId: 'A01',
            nttUid: 'A01-02',
            nttCategory: '일반',
            nttSubject: '테스트2',
            nttContent: '테스트2',
            topLockAt: 'N',
            writeDt: '2023-09-23',
            writeId: 'admin',
            readCount: '77'
        },
        {
            bbsId: 'A01',
            nttUid: 'A01-03',
            nttCategory: '일반',
            nttSubject: '테스트3',
            nttContent: '테스트3',
            topLockAt: 'N',
            writeDt: '2023-09-23',
            writeId: 'admin',
            readCount: '214'
        }
    ]

    const gridProps = ref({
        scrollX: false,
        scrollY: false,
        options: {
            rowHeaders: [ 'rowNum' ],
        },
        columns: [
            {
                header: '분류',
                name: 'nttCategory',
                sortable: true,
                align: 'center'
            },
            {
                header: '제목',
                name: 'nttSubject',
                width: 'auto',
                minWidth: 750,
                sortable: true
            },
            {
                header: '작성자',
                name: 'writeId',
            },
            {
                header: '날짜',
                name: 'writeDt',
                sortable: true,
                align: 'center'
            },
            {
                header: '조회수',
                name: 'readCount',
                sortable: true,
                align: 'center',
                width: 100
            }
        ],
        data: noticeList,
        pageOptions: {
            useClient: true,
            perPage: 5
        }
    })

    function dblclick( data ) {
        router.push( {
            path: "/noteDetail"
        })

        const grid = GridTable.value;
        const instance = grid.gridInstance;

        console.log(instance.getRow(data.rowKey))
    }

    onMounted(()=>{
        const grid = GridTable.value;
        grid.applyTheme("clean");
        grid.setLanguage("ko");
    });
</script>

<style lang="css">
    .tui-grid-body-area {
        padding: 0;
    }

    .selectbox {
        width: 150px;
    }

    .noteSearch {
        width: 300px;
    }
</style>
