<template>
  <div class="w-full" @dragover.prevent @drop="onDrop">
    <ul class="target-list">
      <template
        v-for="(item, index) in tasksWithDividers"
        :key="item.type === 'divider' ? `divider-${index}` : item.id"
      >
        <template v-if="item.type === 'divider'">
          <li>
            <TierDivider
              :number="item.points"
              :name="item.name"
              :color="item.color"
            />
          </li>
        </template>
        <template v-else>
          <li
            class="mt-1 px-4 py-1 w-11/12 border border-solid border-gray-300 rounded-lg cursor-pointer grid grid-cols-4"
            :class="item.completed ? 'bg-green-200/20' : 'bg-white'"
          >
            <div class="flex items-center">
              <p>{{ item.name }}</p>
            </div>
            <div class="flex items-center justify-center">
              <Tag :severity="tagColour(item.reward)">{{ item.reward }}</Tag>
            </div>
            <div class="flex items-center justify-center">
              <div>
                <Button
                  variant="outlined"
                  class="hover:!bg-green-200"
                  icon="pi pi-check"
                  @click="routeStore.completeTask(item.id)"
                  v-if="!item.completed"
                ></Button>
                <Button
                  v-else
                  variant="outlined"
                  class="hover:!bg-red-200"
                  icon="pi pi-times"
                  @click="routeStore.revertTask(item.id)"
                ></Button>
              </div>
            </div>
            <div class="flex flex-col items-center justify-center">
              <Button
                variant="outlined"
                class="!p-1 hover:!bg-gray-200 h-6 text-sm mb-1"
                icon="pi pi-arrow-up"
                @click="moveTask(index, -1)"
                v-if="!(index === 0)"
              ></Button>
              <Button
                variant="outlined"
                class="!p-1 hover:!bg-gray-200 h-6 text-sm"
                icon="pi pi-arrow-down"
                @click="moveTask(index, 1)"
                v-if="!(index === tasksWithDividers.length - 1)"
              ></Button>
            </div>
          </li>
        </template>
      </template>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { Tag, Button } from "primevue";
import { useRouteStore } from "@/stores/routeStore";
import type { ListItem, Task, TaskItem, ThresholdInfo } from "@/types";
import TierDivider from "@/components/TierDivider.vue";

const props = defineProps<{ showCompleted: boolean }>();
const routeStore = useRouteStore();

const relicThresholds: ThresholdInfo[] = [
  { points: 500, name: "Relic 2", color: "#5a98e8" },
  { points: 1200, name: "Relic 3", color: "#5a98e8" },
  { points: 2000, name: "Relic 4", color: "#5a98e8" },
  { points: 4000, name: "Relic 5", color: "#5a98e8" },
  { points: 7500, name: "Relic 6", color: "#5a98e8" },
  { points: 15000, name: "Relic 7", color: "#5a98e8" },
  { points: 24000, name: "Relic 8", color: "#5a98e8" },
];

const tierThresholds: ThresholdInfo[] = [
  { points: 2500, name: "Bronze", color: "#CD7F32" },
  { points: 5000, name: "Iron", color: "#A19D94" },
  { points: 10000, name: "Steel", color: "#43464B" },
  { points: 18000, name: "Mithril", color: "#2d4c8a" },
  { points: 28000, name: "Adamant", color: "#0f3b09" },
  { points: 42000, name: "Rune", color: "#00FFFF" },
  { points: 56000, name: "Dragon", color: "#FF0000" },
];

const regionThresholds: ThresholdInfo[] = [
  { points: 60, name: "Region 1", color: "#9954de" },
  { points: 140, name: "Region 2", color: "#9954de" },
  { points: 300, name: "Region 3", color: "#9954de" },
];

const allThresholds = [...relicThresholds, ...tierThresholds].sort(
  (a, b) => a.points - b.points
);

const tasksWithDividers = computed(() => {
  const result: ListItem[] = [];
  let pointSum = 0;
  let taskCount = 0;
  let allPrecedingTasksCompleted = true;

  const remainingThresholds = [...allThresholds];
  const remainingRegionThresholds = [...regionThresholds];

  routeStore.tasks.forEach((task) => {
    while (remainingThresholds.length > 0) {
      const nextThreshold = remainingThresholds[0];
      if (pointSum >= nextThreshold.points) {
        if (props.showCompleted || !allPrecedingTasksCompleted) {
          result.push({
            type: "divider",
            ...remainingThresholds.shift()!,
          });
        } else {
          remainingThresholds.shift();
        }
      } else {
        break;
      }
    }

    while (remainingRegionThresholds.length > 0) {
      const nextThreshold = remainingRegionThresholds[0];
      if (taskCount >= nextThreshold.points) {
        if (props.showCompleted || !allPrecedingTasksCompleted) {
          result.push({
            type: "divider",
            ...remainingRegionThresholds.shift()!,
          });
        } else {
          remainingRegionThresholds.shift();
        }
      } else {
        break;
      }
    }

    if (!task.completed) {
      allPrecedingTasksCompleted = false;
    }

    if (props.showCompleted || !task.completed) {
      result.push({ ...task, type: "task" } as TaskItem);
    }

    pointSum += task.reward;
    taskCount++;
  });

  if (
    props.showCompleted ||
    !allPrecedingTasksCompleted ||
    result.length == 0
  ) {
    remainingThresholds.forEach((threshold) => {
      result.push({
        type: "divider",
        ...threshold,
      });
    });

    remainingRegionThresholds.forEach((threshold) => {
      result.push({
        type: "divider",
        ...threshold,
      });
    });
  }

  return result;
});
const moveTask = (index: number, direction: number) => {
  const taskIndex = routeStore.tasks.findIndex(
    (task) => task.id === (tasksWithDividers.value[index] as TaskItem).id
  );

  if (
    taskIndex === -1 ||
    (direction === -1 && index === 0) ||
    (direction === 1 && index === tasksWithDividers.value.length - 1)
  ) return;

  const targetTaskIndex = routeStore.tasks.findIndex(
    (_, i) =>
      i !== taskIndex &&
      i > (direction === -1 ? taskIndex - 2 : taskIndex) &&
      i < (direction === -1 ? taskIndex : taskIndex + 2) &&
      tasksWithDividers.value.find(
        (item) => item.type === "task" && item.id === routeStore.tasks[i].id
      )
  );

  // Swap tasks in the store
  if (targetTaskIndex !== -1) {
    const tasks = [...routeStore.tasks];
    [tasks[taskIndex], tasks[targetTaskIndex]] = [
      tasks[targetTaskIndex],
      tasks[taskIndex],
    ];
    routeStore.tasks = tasks;
  }
};

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
