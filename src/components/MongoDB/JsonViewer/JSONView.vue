<template>
    <json-viewer
        :value="props.editorValue"
        :expand-depth=1
        :show-double-quotes="false"
        theme="json-dark-theme"
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

<style lang="scss">
    .json-dark-theme {
        background: #ffffff0a;
        white-space: nowrap;
        color: white;
        font-size: 14px;
        font-family: Consolas, Menlo, Courier, monospace;

        .jv-more:after {
            background: none;
        }

        .jv-more:hover:after {
            background: none;
        }

        .jv-ellipsis {
            color: white;
            background-color: #ffffff0a;
            display: inline-block;
            line-height: 0.9;
            font-size: 0.9em;
            padding: 0px 4px 2px 4px;
            //border-radius: 3px;
            vertical-align: 2px;
            cursor: pointer;
            user-select: none;
        }
        .jv-button { color: #49b3ff }
        .jv-key { color: #7FCFA0}
        .jv-item {
            &.jv-array { color: #56B5C1 }
            &.jv-boolean { color: #D19A66}
            &.jv-function { color: #49b3ff }
            &.jv-number { color: #D19A66}
            &.jv-number-float { color: #D19A66 }
            &.jv-number-integer { color: #D19A66 }
            &.jv-object { color: #C678DD }
            &.jv-undefined { color: gray }
            &.jv-string {
                color: #C789D6;
                word-break: break-word;
                white-space: normal;
            }
        }
        .jv-code {
            .jv-toggle {
                &:before {
                    padding: 0px 2px;
                    border-radius: 2px;
                }
                &:hover {
                    &:before {
                        background: #ffffff0a;
                    }
                }
            }
        }
    }
</style>