<template>
  <ConfirmDialog></ConfirmDialog>
  <div class="grid grid-cols-6 py-4 px-6 w-full">
    <div class="flex flex-col lg:flex-row items-center">
      <InfoDialog />
      <Button
        @click="() => darkMode.toggleDarkMode()"
        icon="pi pi-sun"
        variant="text"
        raised
        rounded
        class="ml-2"
      />
      <RoutesDialog />
    </div>
    <div class="flex items-center justify-center col-span-4 lg:col-span-3 p-6 text-xs lg:text-base">
      <Card class="mr-2 h-24 lg:h-28 text-center w-full">
        <template #content>
          <div class="grid grid-cols-4">
            <div class="flex items-center flex-col">
              <p class="h-1/2">Tasks In Route:</p>
              <p class="text-lg h-1/2 font-bold ml-2">
                {{
                  routeStore.tasks.reduce(
                    (a, b) =>
                      a +
                      ((b.children || []).length > 0 ? b.children.length : 1),
                    0
                  )
                }}
              </p>
            </div>
            <div class="flex items-center flex-col">
              <p class="h-1/2">Tasks Done:</p>
              <p class="text-lg h-1/2 font-bold ml-2">
                {{
                  routeStore.tasks
                    .filter((x) => x.completed && x.reward != 0)
                    .reduce(
                      (a, b) =>
                        a +
                        ((b.children || []).length > 0 ? b.children.length : 1),
                      0
                    )
                }}
              </p>
            </div>
            <div class="flex items-center flex-col">
              <p class="h-1/2">Points in Route:</p>
              <p class="text-lg h-1/2 font-bold ml-2">
                {{ routeStore.tasks.reduce((a, b) => a + b.reward, 0) }}
              </p>
            </div>
            <div class="flex items-center flex-col">
              <p class="h-1/2">Points Done:</p>
              <p class="text-lg h-1/2 font-bold ml-2">
                {{
                  routeStore.tasks
                    .filter((x) => x.completed)
                    .reduce((a, b) => a + b.reward, 0)
                }}
              </p>
            </div>
          </div>
        </template>
      </Card>
    </div>
    <div class="flex flex-col lg:flex-row items-center justify-end col-span-1 lg:col-span-2">
      <FileUpload
        mode="basic"
        name="routeFile"
        accept=".json"
        :maxFileSize="1000000"
        class="h-10 lg:!h-12 text-xs"
        @uploader="onFileUpload"
        :auto="true"
        chooseIcon="pi pi-folder"
        chooseLabel="Load Route"
        customUpload
      />
      <Button
        icon="pi pi-save"
        class="h-10 mt-1 lg:ml-2 lg:!h-12 text-xs"
        label="Save Route"
        @click="saveTasksToFile"
      />
      <Button
        icon="pi pi-times"
        class="h-10 mt-1 lg:ml-2 lg:!h-12 text-xs"
        label="Clear Route"
        @click="confirmClear"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouteStore } from "@/stores/routeStore";
import {
  Card,
  Button,
  FileUpload,
  Toast,
  type FileUploadUploaderEvent,
} from "primevue";
import { useToast } from "primevue/usetoast";
import ConfirmDialog from "primevue/confirmdialog";
import { useConfirm } from "primevue/useconfirm";
import InfoDialog from "./dialogs/InfoDialog.vue";
import RoutesDialog from "./dialogs/RoutesDialog.vue";
import { useDarkMode } from "@/composables/useDarkMode";

const routeStore = useRouteStore();
const toast = useToast();
const darkMode = useDarkMode();

const onFileUpload = (event: FileUploadUploaderEvent) => {
  const files = Array.isArray(event.files) ? event.files : [event.files];
  if (files.length > 0) {
    routeStore.loadTasksFromFile(files[0]);
  }
  toast.add({
    severity: "success",
    summary: "Success",
    detail: "Loaded route successfully.",
    life: 3000,
  });
};

const confirm = useConfirm();

const confirmClear = () => {
  confirm.require({
    message: "Are you sure you want to clear the route?",
    header: "Confirmation",
    icon: "pi pi-exclamation-triangle",
    rejectProps: {
      label: "Cancel",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Clear",
    },
    accept: () => routeStore.clear(),
    reject: () => {},
  });
};

const saveTasksToFile = () => routeStore.saveTasksToFile();
</script>

<style>
.p-toast {
  width: 100vh !important;
}
</style>
