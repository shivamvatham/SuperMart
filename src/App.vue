<template>
  <div class="dashboard-container">
    <div class="dashboard-header">
      <h1 class="dashboard-title">
        <img src="https://cdn-icons-png.flaticon.com/512/263/263115.png" alt="Logo" class="logo" />
        SuperMart Products
      </h1>
      <button class="add-product-btn" @click="showAddForm">
        <span class="material-icons">add</span> Add Product
      </button>
    </div>

    <div class="content-wrapper">
      <ProductList
        :products="products"
        :categories="categories"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>

    <ProductForm
      v-if="showForm"
      :product="selectedProduct"
      :categories="categories"
      @submit="handleFormSubmit"
      @cancel="closeForm"
    />

    <div v-if="showForm" class="modal-overlay" @click="closeForm"></div>

    <ConfirmDialog
      v-if="showConfirm"
      title="Delete Product?"
      message="Are you sure you want to delete this product? This action cannot be undone."
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />

    <SnackbarMessage
      :message="snackbarMessage"
      :type="snackbarType"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import ProductList from '@/components/ProductList.vue';
import ProductForm from '@/components/ProductForm.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import SnackbarMessage from '@/components/SnackbarMessage.vue';
import apiService from '@/services/api';
import '@/assets/main.css'; 
import '@/assets/snackbar.css';

export default {
  name: 'App',
  components: {
    ProductList,
    ProductForm,
    ConfirmDialog,
    SnackbarMessage
  },
  setup() {
    const products = ref([]);
    const categories = ref([]);
    const showForm = ref(false);
    const selectedProduct = ref(null);
    const showConfirm = ref(false);
    const productToDelete = ref(null);
    const snackbarMessage = ref('');
    const snackbarType = ref('success');

    const fetchProducts = async () => {
      try {
        const response = await apiService.get('/products');
        products.value = response.data;
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await apiService.get('/products/categories');
        categories.value = response.data;
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const showAddForm = () => {
      selectedProduct.value = null;
      showForm.value = true;
    };

    const handleEdit = (product) => {
      selectedProduct.value = { ...product };
      showForm.value = true;
    };

    const handleDelete = (productId) => {
      productToDelete.value = productId;
      showConfirm.value = true;
    };

    const confirmDelete = async () => {
      try {
        await apiService.delete(`/products/${productToDelete.value}`);
        products.value = products.value.filter(p => p.id !== productToDelete.value);
        snackbarMessage.value = 'Product deleted successfully!';
        snackbarType.value = 'success';
      } catch (error) {
        console.error('Error deleting product:', error);
        snackbarMessage.value = 'Error deleting product.';
        snackbarType.value = 'error';
      } finally {
        showConfirm.value = false;
        productToDelete.value = null;
      }
    };

    const cancelDelete = () => {
      showConfirm.value = false;
      productToDelete.value = null;
    };

    const handleFormSubmit = async (formData) => {
      try {
        if (selectedProduct.value && selectedProduct.value.id) {
          const response = await apiService.put(`/products/${selectedProduct.value.id}`, formData);
          const index = products.value.findIndex(p => p.id === selectedProduct.value.id);
          products.value[index] = response.data;
          snackbarMessage.value = 'Product updated successfully!';
          snackbarType.value = 'success';
        } else {
          const response = await apiService.post('/products', formData);
          products.value.push(response.data);
          snackbarMessage.value = 'Product added successfully!';
          snackbarType.value = 'success';
        }
        closeForm();
      } catch (error) {
        console.error('Error saving product:', error);
        snackbarMessage.value = 'Error saving product.';
        snackbarType.value = 'error';
      }
    };

    const closeForm = () => {
      showForm.value = false;
      selectedProduct.value = null;
    };

    onMounted(() => {
      fetchProducts();
      fetchCategories();
    });

    return {
      products,
      categories,
      showForm,
      selectedProduct,
      showConfirm,
      productToDelete,
      showAddForm,
      handleEdit,
      handleDelete,
      confirmDelete,
      cancelDelete,
      handleFormSubmit,
      closeForm,
      snackbarMessage,
      snackbarType
    };
  }
};
</script>

