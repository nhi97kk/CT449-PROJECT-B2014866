<template>
  <header class="sticky-top">
    <div class="py-3 text-white">
      <div class="container-md">
        <div class="row">
          <div class="col-8 col-md-3 order-1">
            <router-link
              :to="'/'"
              class="d-flex py-2 text-white text-decoration-none"
            >
              <span id="brand"
                >NBooks
                <i class="fa-solid fa-house d-none d-md-inline-block"></i>
              </span>
            </router-link>
          </div>
          <div
            class="col-12 col-md-6 order-last order-md-2 d-flex justify-content-center align-items-center"
          >
            <search-bar></search-bar>
          </div>
          <div
            class="d-flex justify-content-end align-items-center col-4 col-md-3 order-3"
          >
            <router-link :to="{ name: 'cart-page' }" class="px-2 cart-link"
              ><i class="fa-solid fa-cart-shopping"></i
            ></router-link>
            <user-info-dropdown></user-info-dropdown>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import SearchBar from '@/components/partials/SearchBar.vue';
import UserInfoDropdown from '@/components/partials/UserInfoDropdown.vue';
</script>

<style scoped>
header {
  background-color: var(--color-primary-opacity);
}

#brand {
  font-size: 1.5em;
  padding: 2px 0;
  font-weight: 600;
}

.user-link {
  font-weight: 600;
  transition: all 0.3s;
  font-size: 14px;
}

.user-link:hover {
  opacity: 0.8;
}

a:hover {
  cursor: pointer;
}

.cart-link {
  color: var(--color-quaternary);
  transition: all 0.3s;
}

.cart-link:hover {
  color: #fff;
}
</style>

