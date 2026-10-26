<script setup lang="ts">
defineProps<{ n: string | number }>()
</script>

<template>
  <div class="counter">
    <span class="label">approvals</span>
    <span class="num">#{{ n }}</span>
  </div>
</template>

<style scoped>
.counter {
  position: absolute;
  top: 1.6rem;
  right: 2rem;
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  font-family: var(--mono);
  color: var(--muted);
}
.label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
}
.num {
  font-size: 1.4rem;
  color: var(--accent);
  font-weight: 600;
}
</style>
