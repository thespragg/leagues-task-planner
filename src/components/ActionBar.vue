<template>
  <div class="py-4 px-6 flex w-full items- justify-between">
    <div class="flex items-center">
      <div class="pr-6">
        <div class="flex items-center space-x-4">
          <div class="flex flex-col border border-gray-200 border-solid p-2 rounded-lg">
            <Toast />
            <FileUpload
              ref="fileupload"
              mode="basic"
              name="taskFile"
              url="upload"
              accept=".json"
              customUpload
              @uploader="onFileUpload"
              class="p-button-secondary"
            />
            <Button label="Load Route" @click="upload" class="mt-1"/>
          </div>
          <Button
            label="Save Route"
            @click="saveTasksToFile"
          />
        </div>
      </div>
    </div>
    <div class="flex items-center">
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
  console.log("upload")
  fileupload.value.upload()};

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
