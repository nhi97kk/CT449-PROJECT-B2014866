<template>
  <div class="container page">
    <div class="row">
      <h2 class="p-3 col-6">Tất cả Nhà xuất bản</h2>
      <div class="col-6 d-flex justify-content-end align-items-center">
        <router-link :to="{ name: 'publisher-add' }" class="btn btn-success"
          >Thêm nhà xuất bản</router-link
        >
      </div>
    </div>
    <publisher-search @search-publisher="refreshPublishers"></publisher-search>
    <ul class="list-group list-group-numbered">
      <div v-for="publisher in publishers" :key="publisher._id">
        <publisher-item
          :publisher="publisher"
          @delete-publisher="deletePublisher"
        ></publisher-item>
      </div>
    </ul>
    <div v-if="publishers.length === 0" class="text-center mt-5">
      <h3>Không có nhà xuất bản nào</h3>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';
import publisherService from '@/services/publisher.service.js';
import PublisherItem from '@/components/publisher/PublisherItem.vue';
import PublisherSearch from '@/components/publisher/PublisherSearch.vue';

const route = useRoute();
const publishers = ref([]);

async function refreshPublishers() {
  const response =
    route.query.tennxb !== undefined
      ? await publisherService.searchPublishers(route.query.tennxb)
      : await publisherService.getAllPublishers();

  if (response.status === 'success') {
    publishers.value = response.data.publishers;
  } else {
    publishers.value = [];
  }
}

onBeforeMount(async () => {
  await refreshPublishers();
});

async function deletePublisher() {
  await refreshPublishers();
}
</script>

<style scoped>
.page {
  max-width: 1000px;
}
</style>

