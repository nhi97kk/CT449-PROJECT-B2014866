<template>
  <div class="d-flex flex-column">
    <div class="nav nav-pills flex-column mb-auto">
      <router-link
        :to="{ name: 'user-profile' }"
        class="sidebar-link"
        aria-current="page"
      >
        Tài khoản
      </router-link>
      <router-link :to="{ name: 'order-page' }" class="sidebar-link">
        Lịch sử mượn
      </router-link>
      <router-link :to="{ name: 'cart-page' }" class="sidebar-link">
        Giỏ sách
      </router-link>
      <router-link :to="{ name: 'change-password' }" class="sidebar-link">
        Đổi mật khẩu
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.sidebar-link {
  color: #000;
  text-decoration: none;
  padding: 10px 5px;
  transition: all 0.3s;
  font-size: 1.3rem;
}

.sidebar-link:hover:not(.router-link-active) {
  color: var(--color-secondary);
  border-radius: 1px;
}

.sidebar-link.router-link-active {
  color: var(--color-secondary);
  text-shadow: 1px 1px 1px #343434;
}
</style>

