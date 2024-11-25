<template>
  <header class="w-full">
    <ActionBar />
  </header>
  <main class="w-full min-h-[calc(100vh-8rem)] bg-gray-100 rounded-2xl">
    <div class="flex gap-4 p-4">
      <div
        class="flex-1 flex flex-col bg-white rounded-2xl shadow-lg p-4 min-h-[calc(100vh-8rem)]"
      >
        <div class="flex justify-between items-center p-4">
          <div class="flex items-center mb-4">
            <h2 class="text-xl font-bold">Route</h2>
            <div>
              <div class="card flex justify-content-center ml-4 text-xs">
                <Button
                  label="Custom Task"
                  icon="pi pi-plus"
                  @click="openDialog"
                />

                <Dialog
                  dismissable-mask
                  modal
                  header="Custom Task"
                  v-model:visible="dialogVisible"
                  :style="{ width: '33vw' }"
                >
                  <div class="flex flex-column gap-3">
                    <InputText
                      v-model="capturedText"
                      placeholder="Type your text here"
                      class="w-full"
                    />
                    <Button label="Submit" @click="handleSubmit" class="mt-2" />
                  </div>
                </Dialog>

                <div v-if="submittedText" class="mt-3">
                  <strong>Submitted Text:</strong> {{ submittedText }}
                </div>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-around">
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
import { Checkbox, Button, Dialog, InputText } from "primevue";
import ActionBar from "./components/ActionBar.vue";
import RouteList from "./components/RouteList.vue";
import TaskPanel from "./components/TaskPanel.vue";
import { ref } from "vue";
import { useRouteStore } from "./stores/routeStore";

const routeStore = useRouteStore();
const showCompleted = ref(false);
const dialogVisible = ref(false);
const capturedText = ref("");

const openDialog = () => {
  dialogVisible.value = true;
};

const handleSubmit = () => {
  routeStore.addTask({
    id: Math.random(),
    name: capturedText.value,
    description: "",
    reward: 0,
    completed: false,
    requirements: "N/A"
  });

  dialogVisible.value = false;
  capturedText.value = "";
};
</script>
