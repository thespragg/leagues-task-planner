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
              <div class="flex items-center mb-4 dark:text-gray-100">
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
                        <Button
                          label="Submit"
                          @click="handleSubmit"
                          class="mt-2"
                        />
                      </div>
                    </Dialog>
                  </div>
                </div>
              </div>
              <div class="flex items-center justify-around">
                <Checkbox v-model="showCompleted" binary />
                <p class="ml-2">Show Completed</p>
              </div>
            </div>
            <div class="overflow-y-auto h-[calc(100vh-17rem)]">
              <RouteList :show-completed="showCompleted" />
            </div>
          </template>
        </Card>

        <TaskPanel />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import {
  Checkbox,
  Button,
  Dialog,
  InputText,
  useToast,
  Toast,
  Card,
} from "primevue";
import ActionBar from "./components/ActionBar.vue";
import RouteList from "./components/RouteList.vue";
import TaskPanel from "./components/TaskPanel.vue";
import { onMounted, ref } from "vue";
import { useRouteStore } from "./stores/routeStore";

const routeStore = useRouteStore();
const showCompleted = ref(false);
const dialogVisible = ref(false);
const capturedText = ref("");
const toast = useToast();

onMounted(() =>
  toast.add({
    severity: "error",
    summary: "Region & Relic Tiers",
    detail:
      "Currently only Region 1 and T1 have been released, until the remaining thresholds are released the site will be using TB Reloaded thresholds.",
  })
);

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
    requirements: "N/A",
  });

  dialogVisible.value = false;
  capturedText.value = "";
};
</script>
