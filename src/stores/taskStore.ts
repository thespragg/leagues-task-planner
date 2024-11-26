import { Region, type AreaTasks } from "@/types";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import tasksData from "@/tasks/raging-echoes-tasks.json";
import { parseTasksJson } from "@/utils/taskParser";
import { toggleArrayItem } from "@/utils/toggleArrayItem";

export const useTaskStore = defineStore("tasks", () => {
  const tasksByRegion = ref<AreaTasks>(parseTasksJson(tasksData));
  const filteredRegions = ref<Region[]>([]);

  const toggleRegion = (region: Region) =>
    (filteredRegions.value = toggleArrayItem(filteredRegions.value, region));

  const hasRegionSelected = () => {
    return Object.values(regionToggles.value).some((value) => value);
  };

  const taskList = computed(() => {
    const res = [];
    for (const key of filteredRegions.value) {
      res.push(...tasksByRegion.value[key]);
    }
    return res;
  });

  const regionToggles = computed(() => {
    return Object.keys(Region)
      .filter((key) => !isNaN(Number(key)))
      .reduce((acc, key) => {
        const region = Number(key) as Region;
        acc[region] = filteredRegions.value.includes(region);
        return acc;
      }, {} as { [key in Region]: boolean });
  });

  return {
    hasRegionSelected,
    toggleRegion,
    taskList,
    regionToggles,
  };
});
