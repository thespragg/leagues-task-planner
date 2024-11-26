<template>
  <Card
    class="mx-auto h-[calc(100vh-8rem)] dark:text-gray-100 w-1/3 dark:bg-neutral-700 bg-white rounded-2xl shadow-lg w-full max-w-2xl"
  >
    <template #content>
      <div class="flex flex-col h-[calc(100vh-10rem)]">
        <div class="p-4">
          <h2 class="text-xl font-semibold">Task List</h2>
          <div class="grid grid-cols-6 gap-2 mt-2">
            <ToggleButton
              v-for="(_, region) in taskStore.regionToggles"
              :key="region"
              v-model="regionModel[region]"
              @change="() => taskStore.toggleRegion(Number(region))"
            >
              <template #default> <img :src="regionIcons[region]" /></template>
            </ToggleButton>
          </div>

          <div class="flex gap-2 mt-4">
            <IconField class="w-full">
              <InputIcon class="pi pi-search" />
              <InputText
                v-model="searchQuery"
                placeholder="Search"
                class="w-full"
              />
            </IconField>
            <Select
              v-model="selectedSort"
              :options="sortOptions"
              optionLabel="label"
              placeholder="Sort by"
              class="w-48"
            />
          </div>
        </div>

        <div class="flex-1 overflow-y-auto p-4">
          <draggable
            v-model="filteredAndSortedTasks"
            :group="{
              name: 'tasks',
              pull: 'clone',
              put: false,
            }"
            item-key="name"
          >
            <template #item="{ element }">
              <div
                class="mt-1 dark:text-gray-100 p-2 dark:bg-neutral-800 border border-solid dark:border-neutral-800 border-gray-300 rounded-lg cursor-pointer"
                :class="
                  element.completed
                    ? 'bg-green-200/20'
                    : 'bg-white dark:bg-neutral-900'
                "
              >
                <div class="flex items-center justify-between">
                  <p>{{ element.name }}</p>
                  <Tag :severity="tagColour(element.reward)">{{
                    element.reward
                  }}</Tag>
                </div>
                <div
                  v-if="element.requirements != 'N/A'"
                  class="text-sm text-gray-600 dark:text-gray-200"
                >
                  {{ element.requirements }}
                </div>
              </div>
            </template>
          </draggable>
          <div v-for="task in filteredAndSortedTasks" :key="task.name"></div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script lang="ts" setup>
import draggable from "vuedraggable";
import { ToggleButton, Tag, InputText, Select, Card } from "primevue";
import { useTaskStore } from "@/stores/taskStore";
import { regionIcons } from "@/utils/regionIcons";
import { computed, ref } from "vue";
import { useRouteStore } from "@/stores/routeStore";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";
import type { Task } from "@/types";

const taskStore = useTaskStore();
const routeStore = useRouteStore();
const searchQuery = ref("");
const selectedSort = ref();

const sortOptions = [
  { label: "Name A-Z", value: "name-asc" },
  { label: "Name Z-A", value: "name-desc" },
  { label: "Reward Desc", value: "reward-desc" },
  { label: "Reward Asc", value: "reward-asc" },
];

const regionModel = computed({
  get: () => taskStore.regionToggles,
  set: (_: unknown) => {},
});

const log = (val: string) => console.log(val);

const tagColour = (value: number) => {
  if (value == 10) return "success";
  if (value == 30) return "warn";
  return "danger";
};

const tasks = computed(() =>
  taskStore.taskList.filter(
    (j) => routeStore.tasks.findIndex((x) => x.id == j.id) == -1
  )
);

const filteredAndSortedTasks = computed(() => {
  let filtered = tasks.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (task) =>
        task.name.toLowerCase().includes(query) ||
        task.requirements.toLowerCase().includes(query)
    );
  }

  if (selectedSort.value) {
    filtered = [...filtered].sort((a, b) => {
      switch (selectedSort.value.value) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "reward-desc":
          return b.reward - a.reward;
        case "reward-asc":
          return a.reward - b.reward;
        default:
          return 0;
      }
    });
  }

  return filtered;
});
</script>

<style scoped>
.p-togglebutton-checked {
  background-color: rgb(99, 224, 107);
}

.p-togglebutton.p-togglebutton-checked::before {
  background-color: rgb(160, 229, 165);
}
</style>
