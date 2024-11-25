<template>
  <div class="py-4 px-6 flex w-full items- justify-between">
    <div class="flex items-center">
      <div class="pr-6">
        <Button>Import Route</Button>
      </div>
    </div>
    <div class="flex">
      <Card class="mr-2">
        <template #content>
          <div class="flex items-center">
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
import { Card, Button, Checkbox } from "primevue";

const routeStore = useRouteStore();
</script>
