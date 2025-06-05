<template>
  <div class="product-form-modal">
    <div class="modal-overlay" @click="$emit('cancel')"></div>
    <div class="product-form-card">
      <div class="form-header">
        <h2>{{ isEditing ? 'Edit Product' : 'Add New Product' }}</h2>
        <button class="close-btn" @click="$emit('cancel')" aria-label="Close">
          &times;
        </button>
      </div>
      <form @submit.prevent="handleSubmit">
        <div class="form-grid">
          <div class="form-group">
            <label for="title">Title</label>
            <input
              id="title"
              v-model="formData.title"
              type="text"
              required
              class="form-input"
              placeholder="Enter product title"
            />
          </div>
          <div class="form-group">
            <label for="price">Price (₹)</label>
            <div class="input-with-symbol">
              <span class="symbol">₹</span>
              <input
                id="price"
                v-model.number="formData.price"
                type="number"
                step="0.01"
                min="0"
                required
                class="form-input"
                placeholder="0.00"
              />
            </div>
          </div>
          <div class="form-group">
            <label for="description">Description</label>
            <textarea
              id="description"
              v-model="formData.description"
              required
              class="form-input"
              placeholder="Enter detailed product description"
            ></textarea>
          </div>
          <div class="form-group">
            <label for="category">Category</label>
            <select
              id="category"
              v-model="formData.category"
              required
              class="form-input"
            >
              <option value="" disabled selected>Select a category</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          <div class="form-group full-width">
            <label for="image">Image URL</label>
            <input
              id="image"
              v-model="formData.image"
              type="url"
              required
              class="form-input"
              placeholder="https://example.com/image.jpg"
            />
            <div v-if="formData.image" class="image-preview">
              <img :src="formData.image" alt="Product preview" @error="handleImageError" />
              <span v-if="!imageValid" class="error-text">Invalid image URL</span>
            </div>
          </div>
        </div>
        <div class="form-actions">
          <button type="button" @click="$emit('cancel')" class="btn btn-cancel">
            Cancel
          </button>
          <button type="submit" class="btn btn-submit">
            {{ isEditing ? 'Update Product' : 'Add Product' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';

export default {
  name: 'ProductForm',
  props: {
    product: {
      type: Object,
      default: () => ({
        title: '',
        price: 0,
        description: '',
        category: '',
        image: ''
      })
    },
    categories: {
      type: Array,
      default: () => []
    }
  },
  emits: ['submit', 'cancel'],
  setup(props, { emit }) {
    const formData = ref({ ...props.product });
    const imageValid = ref(true);
    const isEditing = computed(() => !!props.product && !!props.product.id);

    watch(
      () => props.product,
      (newVal) => {
        formData.value = { ...newVal };
      },
      { immediate: true, deep: true }
    );

    const handleImageError = () => {
      imageValid.value = false;
    };

    const handleSubmit = () => {
      if (!imageValid.value) return;
      emit('submit', { ...formData.value });
    };

    return {
      formData,
      isEditing,
      imageValid,
      handleSubmit,
      handleImageError
    };
  }
};
</script>
<style scoped>
@import '@/assets/productForm.css';
</style>

