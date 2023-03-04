<template>
    <div v-for="(document, index) in props.documentList" :key="index" class="mb-4">
        <JSONView :editor-value="document" />
    </div>
</template>

<script setup lang="ts">
    import JSONView from '../Editor/JSONView.vue';

    const props = defineProps<{
        documentList: object[]
    }>();
</script>
