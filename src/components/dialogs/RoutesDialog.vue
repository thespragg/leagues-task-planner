<template>
  <Button
    @click="dialogVisible = true"
    icon="pi pi-map"
    variant="text"
    raised
    aria-label="Cancel"
    label="Routes"
    class="ml-2"
  />
  <Dialog
    dismissable-mask
    modal
    header="Info"
    v-model:visible="dialogVisible"
    :style="{ width: '33vw' }"
  >
    <DataTable
      :value="routes"
      @row-click="(ev: DataTableRowClickEvent) => confirmLoad(ev.data.data)"
      class="p-datatable-sm cursor-pointer"
      :rowHover="true"
      stripedRows
    >
      <Column field="author" header="Author" sortable></Column>
      <Column field="points" header="Points" sortable>
        <template #body="slotProps">
          {{ formatPoints(slotProps.data.points) }}
        </template>
      </Column>
    </DataTable>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import {
  Dialog,
  Button,
  type DataTableRowClickEvent,
  useConfirm,
} from "primevue";
import mazhar from "@/routes/mazhar.json";
import doubleshine from "@/routes/doubleshine.json";
import { DataTable, Column } from "primevue";
import { useRouteStore } from "@/stores/routeStore";

const confirm = useConfirm();
const routeStore = useRouteStore();

const confirmLoad = (data: any) => {
  confirm.require({
    message:
      "Are you sure you want to load this route, all changes to current route since last save will be lost?",
    header: "Confirmation",
    icon: "pi pi-exclamation-triangle",
    rejectProps: {
      label: "Cancel",
      severity: "secondary",
      outlined: true,
    },
    acceptProps: {
      label: "Load",
    },
    accept: () => {
      routeStore.loadTasksFromJson(data);
      dialogVisible.value = false;
    },
    reject: () => {},
  });
};

const dialogVisible = ref(false);
const routes = [
  {
    data: mazhar,
    author: "Mazhar (Route designed for Animal Wrangler + Dodgy Dealer)",
    points: mazhar.reduce((a, b) => a + b.reward, 0),
  },
  {
    data: doubleshine,
    author: "Doubleshine",
    points: doubleshine.reduce((a, b) => a + b.reward, 0),
  }
];

const formatPoints = (points: number) => points.toLocaleString();
</script>
