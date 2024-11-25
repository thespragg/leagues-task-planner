import { type Task } from "@/types";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useRouteStore = defineStore("routes", () => {
  const tasks = ref<Task[]>([]);

  const addTask = (task: Task) => tasks.value.push(task);

  const removeTask = (task: Task) => {
    const index = tasks.value.indexOf(task);
    if (index !== -1) {
      tasks.value = [
        ...tasks.value.slice(0, index),
        ...tasks.value.slice(index + 1),
      ];
    }
  };

  const updateTasks = (newTasks: Task[]) => 
    (tasks.value = newTasks);

  const completeTask = (id: number) => {
    const index = tasks.value.findIndex(x=>x.id == id);
    if(index == -1) return;
    tasks.value[index].completed = true;
  }

  return {
    tasks,
    addTask,
    removeTask,
    updateTasks,
    completeTask
  };
});
