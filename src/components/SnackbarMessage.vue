<template>
  <div v-if="isVisible" :class="['snackbar', type, { 'isVisible': isVisible }]">
    {{ message }}
  </div>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  props: {
    message: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'success' 
    },
    timeout: {
      type: Number,
      default: 3000 
    }
  },
  setup(props) {
    const isVisible = ref(false);
    let timer = null;

    const show = () => {
      isVisible.value = true;
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => {
        isVisible.value = false;
      }, props.timeout);
    };

    watch(() => props.message, (newMessage) => {
      if (newMessage) {
        show();
      }
    });

    return {
      isVisible
    };
  }
};
</script> 