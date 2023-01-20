<template>
    <vue-jsoneditor
        height=""
        mode="tree"
        v-model:text="props.editorValue"
        :readOnly="props.readOnly"
        :mainMenuBar="props.mainMenuBar"
        :navigationBar="props.navigationBar"
        :statusBar="props.statusBar"
        :darkTheme="props.darkTheme"
    />
</template>

<script setup lang="ts">
    import VueJsoneditor from 'vue3-ts-jsoneditor';

    const props = defineProps<{
        height: string
        mode: string
        editorValue: string
        mainMenuBar: boolean
        navigationBar: boolean
        statusBar: boolean
        darkTheme: boolean
        readOnly: boolean
    }>();
</script>