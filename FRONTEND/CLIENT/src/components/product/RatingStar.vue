<template>
  <div class="pb-2">
    <i class="fa fa-star checked" :class="{ lg: lg }"></i>
    <i class="fa fa-star checked" :class="{ lg: lg }"></i>
    <i class="fa fa-star checked" :class="{ lg: lg }"></i>
    <i class="fa fa-star checked" :class="{ lg: lg }"></i>
    <i class="fa fa-star checked" :class="{ lg: lg }"></i>
  </div>
</template>

<script setup>
const props = defineProps(['lg']);
</script>

<style scoped>
i:not(.checked) {
  color: rgb(255, 255, 255);
  font-size: 16px;
}
i.checked {
  color: rgb(255, 204, 110);
  font-size: 16px;
}

i.lg {
  font-size: 26px;
  padding: 10px 0;
}
</style>

