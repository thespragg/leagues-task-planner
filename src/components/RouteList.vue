<template>
  <draggable
    class="w-full flex-1 rounded-2xl"
    :list="tasksWithDividers"
    group="tasks"
    item-key="name"
    @move="handleMove"
    @update="handleUpdate"
  >
    <template #item="{ element }">
      <template v-if="element.type === 'divider'">
        <li>
          <TierDivider
            :number="element.points"
            :name="element.name"
            :color="element.color"
          />
        </li>
      </template>
      <template v-else>
        <div
          class="mt-1 dark:text-gray-100 px-4 py-1 w-11/12 border border-solid dark:border-neutral-800 border-gray-300 rounded-lg cursor-pointer grid grid-cols-4"
          :class="
            element.completed
              ? 'bg-green-200/20'
              : 'bg-white dark:bg-neutral-900'
          "
        >
          <div class="flex items-center">
            <p>{{ element.name }}</p>
          </div>
          <div class="flex items-center justify-center">
            <Tag :severity="tagColour(element.reward)">{{
              element.reward
            }}</Tag>
          </div>
          <div class="flex items-center justify-center">
            <div>
              <Button
                variant="outlined"
                class="hover:!bg-green-200"
                icon="pi pi-check"
                @click="routeStore.completeTask(element.id)"
                v-if="!element.completed"
              ></Button>
              <Button
                v-else
                variant="outlined"
                class="hover:!bg-red-200"
                icon="pi pi-times"
                @click="routeStore.revertTask(element.id)"
              ></Button>
            </div>
            <Button
              variant="outlined"
              class="hover:!bg-red-200 ml-2"
              icon="pi pi-trash"
              @click="routeStore.removeTask(element)"
              v-if="!element.completed"
            ></Button>
          </div>
        </div>
      </template>
    </template>
  </draggable>
</template>

<script setup lang="ts">
import draggable from "vuedraggable";
import { computed } from "vue";
import { Tag, Button } from "primevue";
import { useRouteStore } from "@/stores/routeStore";
import type { ListItem, TaskItem, ThresholdInfo } from "@/types";
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
    if (task.reward > 0) taskCount++;
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

const tagColour = (value: number) => {
  if (value == 10) return "success";
  if (value == 30) return "warn";
  return "danger";
};

const handleMove = (evt: any) => {
  const draggedItem = evt.dragged;

  if (draggedItem.type === "divider") {
    return false;
  }

  if (draggedItem.completed) {
    return false;
  }

  return true;
};

const handleUpdate = (evt: any) => {
  const { oldIndex, newIndex } = evt;

  const oldIndexDividers = countTo(
    tasksWithDividers.value,
    oldIndex,
    (x) => x.type == "divider"
  );

  const newIndexDividers = countTo(
    tasksWithDividers.value,
    oldIndex,
    (x) => x.type == "divider"
  );

  const adjustedNewIndex = newIndex - newIndexDividers;
  const movedItem = routeStore.tasks[oldIndex - oldIndexDividers];
  const adjustedIndex = oldIndex - oldIndexDividers;

  console.log({
    movedItem,
    adjustedIndex,
    adjustedNewIndex,
    actual: routeStore.tasks.findIndex((x) => x.id == movedItem.id),
  });

  routeStore.reorderTasks(
    oldIndex - oldIndexDividers,
    newIndex - newIndexDividers
  );
};

const countTo = <T>(
  arr: T[],
  index: number,
  predicate: (item: T) => boolean
): number => {
  let count = 0;
  for (let i = 0; i <= index; i++) {
    if (predicate(arr[i])) {
      count++;
    }
  }
  return count;
};
</script>
