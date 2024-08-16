<template>
    <div class="modal-overlay" v-if="isOpen">
        <div class="modal">
            <div class="modal-header">
                <h3>VOTAÇÃO</h3>
                <button @click="closeModal">X</button>
            </div>
            <div class="modal-body">
                <slot>
                    HELLO WORLD!
                </slot>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    isOpen: Boolean,
});

const emit = defineEmits(['close']);

const closeModal = () => {
    emit('close');
}

</script>

<style scoped>
    .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    }

    .modal {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 300px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.25);
    }

    .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    }

    .modal-body {
    margin-top: 10px;
    }
</style>