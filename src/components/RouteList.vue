<template>
  <div class="w-full" @dragover.prevent @drop="onDrop">
    <ul class="target-list">
      <li
        class="mt-1 p-4 border border-solid border-gray-300 rounded-lg cursor-pointer flex items-center justify-between"
        :class="item.completed ? 'bg-green-200/20' : 'bg-white'"
        v-for="item in routeStore.tasks.filter(
          (x) => showCompleted || !x.completed
        )"
        :key="item.name"
      >
        <p>{{ item.name }}</p>
        <Tag :severity="tagColour(item.reward)">{{ item.reward }}</Tag>
        <div>
          <Button
            icon="pi pi-check"
            @click="routeStore.completeTask(item.id)"
          ></Button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { Tag, Button } from "primevue";
import { useRouteStore } from "@/stores/routeStore";
import type { Task } from "@/types";

defineProps<{ showCompleted: boolean }>();

const routeStore = useRouteStore();

const onDrop = (event: DragEvent) => {
  const item: Task = JSON.parse(
    event.dataTransfer!.getData("application/json")
  );
  routeStore.addTask(item);
};

const tagColour = (value: number) => {
  if (value == 10) return "success";
  if (value == 30) return "warn";
  return "danger";
};
</script>
