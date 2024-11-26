# OSRS Leagues Route Planner

![Website](https://github.com/user-attachments/assets/f243943a-81cc-4c30-9fa8-adba363ecbef)

## Overview
An application for planning and tracking routes in Old School RuneScape (OSRS) Leagues, built with Vue 3.

[https://thespragg.github.io/leagues-task-planner/](https://thespragg.github.io/leagues-task-planner/)

## Prerequisites
- Bun 1.0+
- Node.js (optional, for alternate package management)

## Setup

### Installation

First clone and install the dependancies.

```bash
git clone https://github.com/yourusername/osrs-leagues-route-planner.git
cd osrs-leagues-route-planner
bun install
```

### Development

#### Running in Development Mode

```bash
# Start development server
bun run dev
```

#### Building for production

```bash
# Build the application
bun run build

# Preview production build
bun run preview
```

### Customization

#### Task Lists

Multiple task lists are available in the `src/tasks` directory. You can modify the active task list in `src/stores/taskStore.ts`, for debugging/development it's advised to use the `tb-reloaded-tasks.json` for a fuller featured task set.

#### Thresholds

You can customize thresholds for:

- Relics
- Cup tiers
- Regions

Edit thresholds in `src/components/RouteList.vue` on lines 79-103:

- `relicThresholds`: Define points and colors for relic unlocks
- `tierThresholds`: Configure cup tier progression points
- `regionThresholds`: Set point requirements for region progression

#### To do

- [ ] Add custom tasks (used for things like "Complete national history quiz." which aren't tasks but are important for the route.)
