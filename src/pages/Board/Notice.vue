<template>
    <div v-if="true">
        <NoticeDesktop></NoticeDesktop>
    </div>

    <div v-if="false">
        <BoardMobile></BoardMobile>
    </div>
</template>

<script>
    import { defineComponent, defineAsyncComponent } from 'vue'
    import { useUserStore } from 'src/stores/example-store';

    export default defineComponent ({
        name: 'Board',
        components: {
          NoticeDesktop: defineAsyncComponent( () => import( 'pages/Board/NoticeDesktop.vue' ) ),
            BoardMobile: defineAsyncComponent( () => import( 'pages/Board/BoardMobile.vue' ) ),
        },
        setup() {
            const useStore = useUserStore()

            console.log(useStore.username)
        }
    })
</script>
