<template>
  <div
    id="review-carousel"
    class="carousel slide"
    data-bs-theme="dark"
    data-bs-ride="carousel"
  >
    <div class="carousel-inner">
      <div
        :class="{ 'carousel-item': true, active: index === 0 }"
        v-for="(review, index) in reviews"
        :key="index"
        :review="review"
      >
        <blockquote class="blockquote" style="font-size: 1em">
          <i class="fas fa-quote-left"></i>
          {{ review.content }}
          <i class="fas fa-quote-right"></i>
        </blockquote>
        <figcaption class="blockquote-footer">
          {{ review.author }} <i class="fas fa-user"></i> <br />
        </figcaption>
      </div>
    </div>
    <button
      class="carousel-control-prev"
      type="button"
      data-bs-target="#review-carousel"
      data-bs-slide="prev"
    >
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button
      class="carousel-control-next"
      type="button"
      data-bs-target="#review-carousel"
      data-bs-slide="next"
    >
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
  </div>
</template>

<script setup>
import 'bootstrap/dist/js/bootstrap.min.js';
import jsonData from '@/assets/js/reviews.json';
import { onBeforeMount, ref } from 'vue';
const reviews = ref([]);

onBeforeMount(() => {
  reviews.value = jsonData.reviews;
});
</script>

<style scoped>
#review-carousel {
  margin: 0 auto;
  height: 200px;
  display: flex;
  align-items: center;
}

.carousel-inner {
  max-width: min(80%, 800px);
  margin: 0 auto;
  padding: 0 50px;
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
  color: black !important;
}
</style>

