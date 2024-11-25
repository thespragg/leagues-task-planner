<template>
  <div class="grid grid-cols-3 py-4 px-6 w-full">
    <div class="flex items-center">
      <Button
        size="small"
        icon="pi pi-info"
        variant="text"
        raised
        rounded
        aria-label="Cancel"
      />
    </div>
    <div class="flex items-center justify-center">
      <Card class="mr-2">
        <template #content>
          <div class="flex items-center justify">
            <p>Points in Route:</p>
            <p class="text-lg font-bold ml-2">
              {{ routeStore.tasks.reduce((a, b) => a + b.reward, 0) }}
            </p>
          </div>
        </template>
      </Card>
      <Card>
        <template #content>
          <div class="flex items-center">
            <p>Points Completed:</p>
            <p class="text-lg font-bold ml-2">
              {{
                routeStore.tasks
                  .filter((x) => x.completed)
                  .reduce((a, b) => a + b.reward, 0)
              }}
            </p>
          </div>
        </template>
      </Card>
    </div>
    <div class="flex items-center justify-end">
      <Toast />
      <FileUpload
        mode="basic"
        name="routeFile"
        accept=".json"
        :maxFileSize="1000000"
        @uploader="onFileUpload"
        :auto="true"
        chooseIcon="pi pi-folder"
        chooseLabel="Load Route"
        customUpload
      />
      <Button
        icon="pi pi-save"
        class="ml-2"
        label="Save Route"
        @click="saveTasksToFile"
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
import { ref } from "vue";

const routeStore = useRouteStore();
const toast = useToast();
const fileupload = ref();

const upload = () => {
  console.log("upload");
  fileupload.value.upload();
};

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

const saveTasksToFile = () => {
  routeStore.saveTasksToFile();
};
</script>
