<template>
  <header class="w-full">
    <ActionBar />
  </header>
  <main class="w-full min-h-[calc(100vh-8rem)] bg-gray-100 rounded-2xl">
    <div class="flex gap-4 p-4">
      <div
        class="flex-1 flex flex-col bg-white rounded-2xl shadow-lg p-4 min-h-[calc(100vh-8rem)]"
      >
        <div class="flex items-center mb-4">
          <h2 class="text-xl font-bold">Route</h2>
          <div class="flex items-center justify-around ml-6">
            <Checkbox v-model="showCompleted" binary />
            <p class="ml-2">Show Completed</p>
          </div>
        </div>
        <RouteList :show-completed="showCompleted" class="h-full rounded-2xl" />
      </div>

      <TaskPanel class="w-1/3 bg-white rounded-2xl shadow-lg p-4" />
    </div>
  </main>
</template>

<script setup lang="ts">
import { Checkbox } from "primevue";
import ActionBar from "./components/ActionBar.vue";
import RouteList from "./components/RouteList.vue";
import TaskPanel from "./components/TaskPanel.vue";
import { ref } from "vue";

const showCompleted = ref(false);
</script>
