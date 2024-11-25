export type Task = {
  id: number;
  name: string;
  description: string;
  reward: number;
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