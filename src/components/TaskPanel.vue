<template>
  <div>
    <h2 class="text-xl font-bold mb-4 text-center">Task List</h2>
    <div class="grid grid-cols-6 gap-2">
      <ToggleButton
        v-for="(_, region) in taskStore.regionToggles"
        :key="region"
        v-model="regionModel[region]"
        @change="() => taskStore.toggleRegion(Number(region))"
      >
        <template #default> <img :src="regionIcons[region]" /></template>
      </ToggleButton>
    </div>
    <div class="mt-2">
      <div
        class="mt-1 p-2 border border-solid border-gray-300 rounded-lg cursor-pointer"
        draggable="true"
        @dragstart="onDragStart($event, task)"
        v-for="task in tasks"
        :key="task.name"
      >
        <div class="flex items-center justify-between">
          <p>{{ task.name }}</p>
          <Tag :severity="tagColour(task.reward)">{{ task.reward }}</Tag>
        </div>
        <div v-if="task.requirements != 'N/A'" class="text-sm text-gray-600">
          {{ task.requirements }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ToggleButton, Tag, Button } from "primevue";
import { useTaskStore } from "@/stores/taskStore";
import { regionIcons } from "@/utils/regionIcons";
import { computed } from "vue";
import type { Task } from "@/types";
import { useRouteStore } from "@/stores/routeStore";

const taskStore = useTaskStore();
const routeStore = useRouteStore();

const regionModel = computed({
  get: () => taskStore.regionToggles,
  set: (_: unknown) => {},
});

const tagColour = (value: number) => {
  if (value == 10) return "success";
  if (value == 30) return "warn";
  return "danger";
};

const onDragStart = (event: DragEvent, item: Task) => {
  event.dataTransfer!.effectAllowed = "copy";
  event.dataTransfer!.setData("application/json", JSON.stringify(item));
};

const tasks = computed(() =>
  taskStore.taskList.filter(
    (j) => routeStore.tasks.findIndex((x) => x.id == j.id) == -1
  )
);
</script>

<style scoped>
.p-togglebutton-checked {
  background-color: rgb(99, 224, 107);
}

.p-togglebutton.p-togglebutton-checked::before {
  background-color: rgb(160, 229, 165);
}
</style>
