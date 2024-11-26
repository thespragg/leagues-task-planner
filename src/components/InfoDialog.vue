<template>
  <Button
    @click="dialogVisible = true"
    size="small"
    icon="pi pi-info"
    variant="text"
    raised
    rounded
    aria-label="Cancel"
  />
  <Dialog
    dismissable-mask
    modal
    header="Info"
    v-model:visible="dialogVisible"
    :style="{ width: '33vw' }"
  >
    <div class="flex flex-col gap-3">
      <p>This is a tool for laying out a Raging Echoes route, currently only
      General/Karamja/Misthalin tasks are released, the rest will be added once
      they are released.</p>
      <hr />
      <p>Version: <span class="font-bold">2.1.0</span></p>
      <p>Changelog:</p>
      <ul>
        <li>- [2.1.0] Added routes dialog for loading community routes</li>
        <li>- [2.0.0] Added searching & ordering to task list</li>
        <li>- [1.0.0] Released initial version</li>
      </ul>
      <hr />
      <p>
        Created by
        <a class="underline" href="https://github.com/thespragg"
          >Alistair Spragg</a
        >
      </p>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Dialog, Button } from "primevue";

const dialogVisible = ref(false);
</script>
