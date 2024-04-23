<template>
  <div class="container-fluid search-bar">
    <form class="d-flex input-group" @submit.prevent="onSubmit">
      <input
        class="form-control"
        type="search"
        placeholder="Tìm kiếm sách theo tên"
        aria-label="Search"
        v-model="search"
      />
      <button class="btn search-btn" type="submit">
        <i class="fa-solid fa-magnifying-glass text-white"></i>
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const emits = defineEmits(['search-product']);
const search = ref('');

async function onSubmit() {
  await router.push({
    name: 'product-page',
    query: { name: search.value.trim() },
  });
  router.go(0);
}
</script>

<style scoped>
.search-btn {
  color: var(--color-primary);
}

.search-bar {
  max-width: 80%;
}
</style>

