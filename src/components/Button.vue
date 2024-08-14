<template>
    <button class="button" :class="[background]">
        <slot></slot>
    </button>
</template>

<script setup lang="ts">

const props = defineProps({
    background: { type: String, default: 'button__primary' },
    width: { type: String, default: '100%' },
    widthMobile: { type: String, default: '100%' },
    height: { type: String, default: '35px' },
    fontSize: { type: String, default: '14px' },
    borderRadius: { type: String, default: '4px' },
})
</script>


<style lang="scss">

    @import '@/scss/mixings';

    .button {
        @include flexbox(row, space-around, center);
        width: v-bind(width);
        height: v-bind(height);
        font-weight: 600;
        line-height: 24px;
        font-size: v-bind(fontSize);
        padding: 14px;
        border-radius: v-bind(borderRadius);
        box-shadow: 0px 2px 1px 0px #0000000A;
        cursor: pointer;
        @media (max-width: $sm-breakpoint) {
            width: v-bind(widthMobile);
        }
    }

</style>