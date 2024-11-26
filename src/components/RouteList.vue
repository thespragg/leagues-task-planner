<template>
  <draggable
    class="w-full flex-1 rounded-2xl"
    :list="tasksWithDividers"
    :group="{ name: 'tasks', put: true }"
    item-key="name"
    @add="handleAdd"
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
          class="mt-1 dark:text-gray-100 px-4 py-1 w-full border border-solid rounded-lg cursor-pointer grid grid-cols-6"
          :class="[
            element.completed
              ? 'bg-green-200/20'
              : 'bg-white dark:bg-neutral-900',
            element.reward == 0 || element.children?.length > 0
              ? 'border-yellow-300/20'
              : 'dark:border-neutral-800 border-gray-300',
          ]"
        >
          <div class="flex col-span-4 items-center">
            <p>{{ element.name }}</p>
          </div>
          <div
            v-if="element.reward != 0"
            class="flex items-center justify-center"
          >
            <Tag :severity="tagColour(element.reward)">{{
              element.reward
            }}</Tag>
          </div>
          <div class="flex items-center justify-center">
            <div>
              <Button
                size="small"
                variant="outlined"
                class="hover:!bg-gray-700"
                icon="pi pi-check"
                @click="routeStore.completeTask(element.id)"
                v-if="!element.completed"
              ></Button>
              <Button
                v-else
                size="small"
                variant="outlined"
                class="hover:!bg-gray-700"
                icon="pi pi-times"
                @click="routeStore.revertTask(element.id)"
              ></Button>
            </div>
            <Button
              size="small"
              variant="outlined"
              class="hover:!bg-gray-700 ml-2"
              icon="pi pi-trash"
              @click="routeStore.removeTask(element)"
              v-if="!element.completed"
            ></Button>
            <CustomTaskDialog :task="element" />
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
import type { ListItem, Task, TaskItem, ThresholdInfo } from "@/types";
import TierDivider from "@/components/TierDivider.vue";
import CustomTaskDialog from "./dialogs/CustomTaskDialog.vue";

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
    if (task.reward > 0)
      taskCount += task.children?.length > 0 ? task.children.length : 1;
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

const handleAdd = (ev: any) => {
  const { newIndex } = ev;

  const newIndexDividers = countTo(
    tasksWithDividers.value,
    newIndex,
    (x) => x.type == "divider"
  );

  const item = tasksWithDividers.value[newIndex] as Task;
  routeStore.updateTasks([
    ...routeStore.tasks.slice(0, newIndex - newIndexDividers),
    item,
    ...routeStore.tasks.slice(newIndex - newIndexDividers),
  ]);
};

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
    newIndex,
    (x) => x.type == "divider"
  );

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
