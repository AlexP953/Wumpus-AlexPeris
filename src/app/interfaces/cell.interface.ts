export type EnemyType = 'well' | 'monster';

export interface Enemy {
    type: EnemyType;
    isAlive: boolean;
}

export interface Cell {
    hasHero: boolean;
    hasGold: boolean;
    hasBeenVisited: boolean;
    enemies?: Enemy;
}
