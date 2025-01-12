export interface ProgressEntry {
	id: string;
	date: string;
	satisfaction: number;
	activities: string;
	mistakes: string;
	tags: string[];
}

export interface ProgressStats {
	averageSatisfaction: number;
	totalEntries: number;
	dailyTrend: Array<{
		date: string;
		satisfaction: number;
	}>;
}

export interface Tag {
	id: string;
	name: string;
	isPinned: boolean;
	createdAt: string;
}
