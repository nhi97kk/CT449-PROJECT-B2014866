<template>
  <div class="home">
    <div class="review py-5">
      <h2 class="text-center">Thuật ngữ hay về sách</h2>
      <review-list class="mt-2"></review-list>
    </div>

    <hr />

    <div class="favourite py-5">
      <product-list
        :query="{ limit: 6, page: 1, sort: 'stockQuantity' }"
        :title="'Sách được yêu thích'"
      ></product-list>
      <more-product :query="{ sort: 'stockQuantity' }"></more-product>
    </div>

    <hr />

    <div class="new py-3">
      <product-list
        :query="{ limit: 6, page: 1, sort: '-createdAt' }"
        :title="'Sách mới cập nhật'"
      ></product-list>
      <more-product :query="{ sort: '-createdAt' }"></more-product>
    </div>

    <hr />

    <div class="contact py-5 text-center">
      <h5>Liên hệ với chúng tôi thông qua email:</h5>
      <a class="mail" href="mailto:nbooks@gmail.com">nbooks@gmail.com</a>
      hoặc các nền tảng
      <a href="#"><i class="fab fa-facebook-square social-media"></i></a>
      <a href="#"><i class="fab fa-instagram-square social-media"></i></a>
      <a href="#"><i class="fab fa-twitter-square social-media"></i></a>
      <a href="#"><i class="fab fa-youtube-square social-media"></i></a>
    </div>
  </div>
</template>

<script setup>
import ProductList from '@/components/product/ProductList.vue';
import MoreProduct from '@/components/product/MoreProduct.vue';
import ReviewList from '@/components/review/ReviewList.vue';
</script>

<style scoped>
.social-media {
  font-size: 30px;
  margin: 0 10px;
}

.social-media,
.mail {
  color: var(--color-primary);
  transition: all 0.3s ease-in-out;
  cursor: pointer;
}

.social-media:hover,
.mail:hover {
  color: #e87e7e;
}
</style>

