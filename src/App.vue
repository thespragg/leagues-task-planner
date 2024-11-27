<template>
  <div class="h-screen bg-gray-100 dark:bg-neutral-800">
    <Toast position="bottom-center" />
    <header class="w-full">
      <ActionBar />
    </header>
    <main class="w-full min-h-[calc(100vh-8rem)] rounded-2xl">
      <div class="flex gap-4 p-4 h-full">
        <Card
          class="flex-1 flex flex-col bg-white rounded-2xl shadow-lg p-4 h-[calc(100vh-8rem)]"
        >
          <template #content>
            <div class="flex justify-between items-center p-4">
              <div class="flex items-center dark:text-gray-100 w-2/3">
                <h2 class="text-xl font-bold mr-4">Route</h2>
                <CustomTaskDialog />
              </div>
              <div class="flex items-center justify-around w-1/3">
                <Checkbox v-model="showCompleted" binary />
                <p class="ml-2">Show Completed</p>
              </div>
            </div>
            <div class="overflow-y-auto h-[calc(100vh-17rem)]">
              <RouteList :show-completed="showCompleted" />
            </div>
          </template>
        </Card>

        <TaskPanel class="h-[calc(100vh-8rem)]" />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { Checkbox, useToast, Toast, Card } from "primevue";
import ActionBar from "./components/ActionBar.vue";
import RouteList from "./components/RouteList.vue";
import TaskPanel from "./components/TaskPanel.vue";
import { ref } from "vue";
import CustomTaskDialog from "./components/dialogs/CustomTaskDialog.vue";

const showCompleted = ref(false);
</script>
