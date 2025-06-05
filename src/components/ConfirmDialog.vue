<template>
  <transition name="fade">
    <div class="confirm-dialog-backdrop" @click.self="handleBackdropClick">
      <transition name="scale">
        <div class="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="confirm-dialog-title">
          <div class="dialog-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
          </div>
          <div id="confirm-dialog-title" class="confirm-title">{{ title }}</div>
          <div class="confirm-message">{{ message }}</div>
          <div class="confirm-actions">
            <button class="btn btn-cancel" @click="$emit('cancel')" autofocus>
              Cancel
            </button>
            <button class="btn btn-danger" @click="$emit('confirm')">
              {{ confirmText }}
            </button>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ConfirmDialog',
  props: {
    title: { 
      type: String, 
      default: 'Are you sure?' 
    },
    message: { 
      type: String, 
      default: 'This action cannot be undone.' 
    },
    confirmText: {
      type: String,
      default: 'Delete'
    },
    closeOnBackdrop: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleBackdropClick() {
      if (this.closeOnBackdrop) {
        this.$emit('cancel');
      }
    }
  }
};
</script>
<style scoped>
@import '@/assets/dialog.css';
</style>