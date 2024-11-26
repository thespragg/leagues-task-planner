<template>
  <div class="flex items-center w-full gap-2 py-4">
    <div class="flex-grow h-px" :style="{ backgroundColor: color }"></div>
    <div
      class="px-4 py-2 w-64 text-sm font-medium rounded-full flex justify-between items-center gap-1"
      :style="{
        backgroundColor: `${color}15`,
        color: color,
        borderColor: `${color}40`,
      }"
    >
      <span>{{ name }}</span>
      <span class="font-bold">
        {{ number.toLocaleString() }} {{ name.includes('Region') ? 'tasks' : 'points' }}
      </span>
    </div>
    <div class="flex-grow h-px" :style="{ backgroundColor: color }"></div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  number: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: '#6366f1',
  },
});
</script>
