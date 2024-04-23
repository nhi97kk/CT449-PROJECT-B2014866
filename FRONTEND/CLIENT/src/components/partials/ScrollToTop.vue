<template>
  <a href="#" class="router-link">
    <i class="fa-solid fa-arrow-up scroll-to-top"></i>
  </a>
</template>

<style scoped>
.scroll-to-top {
  position: fixed;
  bottom: 20px;
  right: 20px;
  font-size: 2rem;
  background-color: #dddddd;
  padding: 5px;
  opacity: 0.4;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
}

.scroll-to-top:hover {
  opacity: 1;
  background-color: inherit;
}

.show {
  display: block;
}
</style>

