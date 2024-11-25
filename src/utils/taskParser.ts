import { type Task, type AreaTasks, Region } from "@/types";

export const parseTasksJson = (jsonData: any): AreaTasks => {
  const areaTasks: Partial<AreaTasks> = {};

  Object.values(Region)
    .filter((key) => !isNaN(Number(key)))
    .forEach((region) => {
      areaTasks[region as Region] = [];
    });

  Object.entries(jsonData).forEach(([key, tasks]) => {
    const regionKey = key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
    const region = Region[regionKey as keyof typeof Region];

    if (region === undefined) {
      console.warn(`Warning: Region "${regionKey}" not found in Region enum`);
      return;
    }

    areaTasks[region] = (tasks as any[]).map((task) => ({
      id: task.Id,
      name: task.Name,
      description: task.Description,
      reward: task.Reward,
      completed: false,
      requirements: task.Requirements
    }));
  });

  return areaTasks as AreaTasks;
};
