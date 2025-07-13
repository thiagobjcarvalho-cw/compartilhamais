<script setup lang="ts">
import { ref } from "vue";

const message = ref("Olá, Fábio!");
</script>

<template>
  <div class="example">
    <p>{{ message }}</p>
  </div>
</template>

<style scoped>
.example {
  padding: 1rem;
  background: #f5f5f5;
}
</style>
