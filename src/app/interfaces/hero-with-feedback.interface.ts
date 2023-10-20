import { Hero } from './Hero.interface';

export interface HeroWithFeedBack {
    hero: Hero;
    feedbackMessages: string[];
    isHeroAlive: boolean;
}
