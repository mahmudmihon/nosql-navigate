<template>
    <json-viewer
        :value="props.editorValue"
        :expand-depth=1
        :show-double-quotes="false"
        boxed
    >
    </json-viewer>
</template>

<script setup lang="ts">
    import JsonViewer from 'vue-json-viewer';

    const props = defineProps<{
        editorValue: object
    }>();
</script>