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
    <div class="flex items-center justify-center py-4">
      <Checkbox inputId="hide-in-route" v-model="hideInRoute" binary />
      <label for="hide-in-route" class="ml-2">
        Hide Tasks already in route
      </label>
    </div>
    <div>
      <div
        class="mt-1 p-2 border border-solid border-gray-300 rounded-lg cursor-pointer flex items-center justify-between"
        draggable="true"
        @dragstart="onDragStart($event, task)"
        v-for="task in taskStore.taskList"
        :key="task.name"
      >
        <p>{{ task.name }}</p>
        <Tag :severity="tagColour(task.reward)">{{ task.reward }}</Tag>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ToggleButton, Checkbox, Tag } from "primevue";
import { useTaskStore } from "@/stores/taskStore";
import { regionIcons } from "@/utils/regionIcons";
import { computed, ref } from "vue";
import type { Task } from "@/types";

const hideInRoute = ref<boolean>(true);
const taskStore = useTaskStore();

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
  event.dataTransfer!.effectAllowed = 'copy'
  event.dataTransfer!.setData('application/json', JSON.stringify(item))
}
</script>

<style scoped>
.p-togglebutton-checked {
  background-color: rgb(99, 224, 107);
}

.p-togglebutton.p-togglebutton-checked::before {
  background-color: rgb(160, 229, 165);
}
</style>
