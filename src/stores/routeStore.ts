import { type Task } from "@/types";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useRouteStore = defineStore("routes", () => {
  const tasks = ref<Task[]>([]);

  const addTask = (task: Task) => tasks.value.push(task);

  const removeTask = (task: Task) => {
    const index = tasks.value.findIndex((x) => x.id == task.id);
    if (index !== -1) {
      tasks.value = [
        ...tasks.value.slice(0, index),
        ...tasks.value.slice(index + 1),
      ];
    }
  };

  const updateTasks = (newTasks: Task[]) => (tasks.value = newTasks);

  const completeTask = (id: number) => {
    const index = tasks.value.findIndex((x) => x.id == id);
    if (index == -1) return;
    tasks.value[index].completed = true;
  };

  const revertTask = (id: number) => {
    const index = tasks.value.findIndex((x) => x.id == id);
    if (index == -1) return;
    tasks.value[index].completed = false;
  };

  const saveTasksToFile = () => {
    const tasksJson = JSON.stringify(tasks.value, null, 2);
    const blob = new Blob([tasksJson], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "osrs-route.json";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const loadTasksFromFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const loadedTasks = JSON.parse(e.target?.result as string) as Task[];
        tasks.value = loadedTasks;
      } catch (error) {
        console.error("Error loading tasks:", error);
        alert("Failed to load tasks. Please check the file format.");
      }
    };
    reader.readAsText(file);
  };

  return {
    tasks,
    addTask,
    removeTask,
    updateTasks,
    completeTask,
    revertTask,
    saveTasksToFile,
    loadTasksFromFile,
  };
});
