export type Task = {
  id: number;
  name: string;
  description: string;
  reward: number;
  requirements: string;
  completed: boolean;
};

export type AreaTasks = {
  [key in Region]: Task[];
};

export enum Region {
    General,
    Misthalin,
    Karamja,
    Asgarnia,
    Desert,
    Fremennik,
    Kandarin,
    Morytania,
    Tirannwn,
    Wilderness,
    Kourend,
    Varlamore
}

export interface ThresholdInfo {
  points: number;
  name: string;
  color: string;
}

export interface DividerItem extends ThresholdInfo {
  type: "divider";
}

export interface TaskItem extends Task {
  type: "task";
}

export type ListItem = TaskItem | DividerItem;
