<template>
  <div class="product-list-container">
    <div class="list-header">
      <h2 class="list-title">Product Inventory</h2>
      <div class="filters-container">
        <div class="search-box">
          <span class="material-icons search-icon">search</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search products..."
            class="search-input"
            @input="handleSearch"
          />
        </div>
        <div class="filter-group">
          <label for="category-filter" class="filter-label">Category:</label>
          <select 
            id="category-filter"
            v-model="selectedCategory"
            class="category-select"
            @change="handleCategoryChange"
          >
            <option value="">All Categories</option>
            <option 
              v-for="category in categories" 
              :key="category" 
              :value="category"
            >
              {{ formatCategoryName(category) }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="table-wrapper">
      <div class="table-responsive">
        <table class="products-table">
          <thead>
            <tr>
              <th class="column-image">Image</th>
              <th class="column-title">Product</th>
              <th class="column-price">Price</th>
              <th class="column-category">Category</th>
              <th class="column-actions">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="product in paginatedProducts" 
              :key="product.id"
              class="product-row"
            >
              <td class="product-image-cell">
                <div class="image-wrapper">
                  <img 
                    :src="product.image" 
                    :alt="product.title" 
                    class="product-image"
                    @error="handleImageError"
                  />
                </div>
              </td>
              <td class="product-title-cell">
                <div class="product-title" :title="product.title">
                  {{ product.title }}
                </div>
                <div class="product-description" v-if="!isMobile">
                  {{ truncateDescription(product.description) }}
                </div>
              </td>
              <td class="product-price-cell">
                <span class="price-value">
                  {{ formatPrice(product.price) }}
                </span>
              </td>
              <td class="product-category-cell">
                <span class="category-badge">
                  {{ formatCategoryName(product.category) }}
                </span>
              </td>
              <td class="product-actions-cell">
                <div class="action-buttons">
                  <button 
                    @click="handleEdit(product)" 
                    class="btn-action btn-edit"
                    aria-label="Edit product"
                  >
                    <span class="material-icons">edit</span>
                    <span class="btn-text" v-if="!isMobile">Edit</span>
                  </button>
                  <button 
                    @click="handleDelete(product.id)" 
                    class="btn-action btn-delete"
                    aria-label="Delete product"
                  >
                    <span class="material-icons">delete</span>
                    <span class="btn-text" v-if="!isMobile">Delete</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="filteredProducts.length === 0" class="empty-state">
          <div class="empty-icon">
            <span class="material-icons">inventory_2</span>
          </div>
          <h3 class="empty-title">No products found</h3>
          <p class="empty-message">Try adjusting your search or filter criteria</p>
        </div>
      </div>

      <div class="pagination-controls" v-if="filteredProducts.length > 0">
        <button 
          class="btn-pagination"
          :disabled="currentPage === 1"
          @click="prevPage"
        >
          <span class="material-icons">chevron_left</span>
        </button>
        <span class="page-indicator">
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        <button 
          class="btn-pagination"
          :disabled="currentPage === totalPages"
          @click="nextPage"
        >
          <span class="material-icons">chevron_right</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { useWindowSize } from '@vueuse/core';
import apiService from '../services/api';

export default {
  name: 'ProductList',
  props: {
    products: {
      type: Array,
      required: true
    },
    categories: {
      type: Array,
      default: () => []
    }
  },
  emits: ['edit', 'delete'],
  setup(props, { emit }) {
    const { width } = useWindowSize();
    const searchQuery = ref('');
    const selectedCategory = ref('');
    const currentPage = ref(1);
    const itemsPerPage = ref(10);

    const isMobile = computed(() => width.value < 768);

    const filteredProducts = computed(() => {
      return props.products.filter(product => {
        const matchesSearch = product.title.toLowerCase().includes(searchQuery.value.toLowerCase());
        const matchesCategory = !selectedCategory.value || product.category === selectedCategory.value;
        return matchesSearch && matchesCategory;
      });
    });

    const totalPages = computed(() => {
      return Math.ceil(filteredProducts.value.length / itemsPerPage.value);
    });

    const paginatedProducts = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage.value;
      const end = start + itemsPerPage.value;
      return filteredProducts.value.slice(start, end);
    });

    const formatPrice = (price) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2
      }).format(price);
    };

    const formatCategoryName = (category) => {
      if (!category) return '';
      return category.split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

    const truncateDescription = (description) => {
      if (!description) return '';
      const maxLength = isMobile.value ? 30 : 50;
      return description.length > maxLength 
        ? `${description.substring(0, maxLength)}...` 
        : description;
    };

    const handleEdit = (product) => {
      emit('edit', product);
    };

    const handleDelete = (productId) => {
      emit('delete', productId);
    };

    const handleSearch = () => {
      currentPage.value = 1;
    };

    const handleCategoryChange = () => {
      currentPage.value = 1;
    };

    const handleImageError = (event) => {
      event.target.src = 'https://via.placeholder.com/80?text=No+Image';
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
      }
    };

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    };

    return {
      searchQuery,
      selectedCategory,
      filteredProducts,
      paginatedProducts,
      currentPage,
      totalPages,
      isMobile,
      formatPrice,
      formatCategoryName,
      truncateDescription,
      handleEdit,
      handleDelete,
      handleSearch,
      handleCategoryChange,
      handleImageError,
      nextPage,
      prevPage
    };
  }
};
</script>
<style scoped>
@import '@/assets/productList.css';
</style>

