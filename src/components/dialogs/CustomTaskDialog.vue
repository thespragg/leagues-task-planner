<template>
  <div v-if="!task || (task && (task.children?.length > 0 || task.reward == 0))" class="card flex justify-content-center text-xs ml-2">
    <Button
      v-if="task"
      size="small"
      variant="outlined"
      class="hover:!bg-gray-700 h-9"
      icon="pi pi-pencil"
      @click="openDialog"
    ></Button>
    <Button
      v-else
      label="Custom Task"
      icon='pi pi-pencil'
      @click="openDialog"
    />

    <Dialog
      dismissable-mask
      modal
      :header="task ? 'Edit Task' : 'Custom Task'"
      v-model:visible="dialogVisible"
      :style="{ width: '33vw' }"
    >
      <div class="flex flex-col gap-3">
        <div class="flex items-center">
          <InputText v-model="capturedText" placeholder="Task" class="w-full" />
          <Tag class="w-12 h-12 ml-2" severity="info">
            <p class="text-xl">{{ totalReward }}</p>
          </Tag>
        </div>

        <div class="task-selection-container">
          <p class="text-neutral-400 mb-2">
            Custom tasks can complete multiple League tasks. Select tasks that
            should be completed:
          </p>

          <div v-if="taskStore.hasRegionSelected()" class="mb-3">
            <IconField class="w-full">
              <InputIcon class="pi pi-search" />
              <InputText
                v-model="searchQuery"
                placeholder="Search tasks..."
                class="w-full"
              />
            </IconField>
          </div>

          <div
            v-if="taskStore.hasRegionSelected()"
            class="task-list custom-scrollbar"
          >
            <div
              v-for="task in filteredTasks"
              :key="task.id"
              class="mt-1 dark:text-gray-100 p-2 dark:bg-neutral-800 border border-solid dark:border-neutral-800 border-gray-300 rounded-lg cursor-pointer"
              :class="{ 'border-primary bg-primary/5': isSelected(task) }"
              @click="toggleTask(task)"
            >
              <div class="flex items-center justify-between">
                <div class="flex-grow">
                  <h3 class="font-medium text-sm">{{ task.name }}</h3>
                  <p
                    v-if="task.description"
                    class="text-neutral-500 text-xs mt-1"
                  >
                    {{ task.description }}
                  </p>
                </div>
                <Tag class="mr-4" :severity="tagColour(task.reward)">{{
                  task.reward
                }}</Tag>
                <div
                  class="w-5 h-5 border rounded-full flex items-center justify-center"
                  :class="{ 'bg-primary border-primary': isSelected(task) }"
                >
                  <i
                    v-if="isSelected(task)"
                    class="pi pi-check text-white text-xs"
                  ></i>
                </div>
              </div>
            </div>

            <div
              v-if="filteredTasks.length === 0"
              class="text-center py-4 text-neutral-500"
            >
              No tasks match your search
            </div>
          </div>

          <div
            v-else
            class="border border-yellow-200 bg-yellow-50 rounded p-3 text-yellow-700 text-sm"
          >
            <i class="pi pi-exclamation-triangle mr-2"></i>
            No regions selected. Please select a region to view available tasks.
          </div>
        </div>

        <div class="mt-2">
          <p class="text-sm font-medium mb-2">
            Selected Tasks ({{ selectedTasks.length }}):
          </p>
          <div class="selected-tasks-container custom-scrollbar">
            <div class="flex flex-wrap gap-2">
              <span
                v-for="task in selectedTasks"
                :key="task.id"
                class="inline-flex items-center bg-primary/10 text-primary rounded-full px-3 py-1 text-xs"
              >
                {{ task.name }} [{{ task.reward }}]
                <i
                  class="pi pi-times ml-2 cursor-pointer"
                  @click.stop="removeTask(task)"
                ></i>
              </span>
            </div>
          </div>
        </div>

        <Button
          :label="task ? 'Update Task' : 'Create Custom Task'"
          @click="handleSubmit"
          class="mt-4"
        />
      </div>
    </Dialog>
  </div>
</template>

<script lang="ts" setup>
import { Button, Dialog, InputText, IconField, InputIcon, Tag } from "primevue";
import { useRouteStore } from "@/stores/routeStore";
import { computed, ref, watch, onMounted } from "vue";
import { useTaskStore } from "@/stores/taskStore";
import type { Task } from "@/types";

const props = defineProps<{
  task?: Task;
}>();

const selectedTasks = ref<Task[]>([]);
const taskStore = useTaskStore();
const routeStore = useRouteStore();
const dialogVisible = ref(false);
const capturedText = ref("");
const searchQuery = ref("");

const initializeForm = () => {
  if (props.task) {
    capturedText.value = props.task.name;
    selectedTasks.value = taskStore.taskList.filter((t) =>
      props.task?.children?.includes(t.id)
    );
  }
};

watch(
  () => props.task,
  (newTask) => {
    if (dialogVisible.value && newTask) {
      initializeForm();
    }
  }
);

const tasks = computed(() =>
  taskStore.taskList.filter(
    (j) =>
      routeStore.tasks.findIndex((x) => x.id == j.id) == -1 &&
      routeStore.tasks.flatMap((x) => x.children).findIndex((x) => x == j.id) ==
        -1 &&
      j.id !== props.task?.id
  )
);

const filteredTasks = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return tasks.value.filter(
    (task) =>
      task.name.toLowerCase().includes(query) ||
      (task.description && task.description.toLowerCase().includes(query))
  );
});

const isSelected = (task: Task) => {
  return selectedTasks.value.some((t) => t.id === task.id);
};

const toggleTask = (task: Task) => {
  const index = selectedTasks.value.findIndex((t) => t.id === task.id);
  if (index === -1) {
    selectedTasks.value.push(task);
  } else {
    selectedTasks.value.splice(index, 1);
  }
};

const removeTask = (task: Task) => {
  selectedTasks.value = selectedTasks.value.filter((t) => t.id !== task.id);
};

const openDialog = () => {
  dialogVisible.value = true;
  if (!props.task) {
    capturedText.value = "";
    selectedTasks.value = [];
  } else {
    initializeForm();
  }
  searchQuery.value = "";
};

const handleSubmit = () => {
  if (capturedText.value.trim() && selectedTasks.value.length > 0) {
    const taskData = {
      id: props.task?.id ?? Math.random(),
      name: capturedText.value,
      description: props.task?.description ?? "",
      reward: totalReward.value,
      completed: props.task?.completed ?? false,
      requirements: props.task?.requirements ?? "N/A",
      children: selectedTasks.value.map((x) => x.id),
    };

    if (props.task) {
      routeStore.updateTask(taskData);
    } else {
      routeStore.addTask(taskData);
    }

    dialogVisible.value = false;
    capturedText.value = "";
    selectedTasks.value = [];
    searchQuery.value = "";
  }
};

const tagColour = (value: number) => {
  if (value == 10) return "success";
  if (value == 30) return "warn";
  return "danger";
};

const totalReward = computed(() =>
  selectedTasks.value.reduce((a, b) => a + b.reward, 0)
);
</script>

<style scoped>
.task-list {
  max-height: 150px;
  overflow-y: auto;
  padding-right: 4px;
}

.selected-tasks-container {
  max-height: 100px;
  overflow-y: auto;
  padding-right: 4px;
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.task-item:hover .task-remove {
  opacity: 1;
}

.task-remove {
  opacity: 0;
  transition: opacity 0.2s;
}
</style>
