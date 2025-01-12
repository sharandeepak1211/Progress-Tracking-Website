import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";
import { firestore } from "../config/firebase";
import { ProgressEntry, ProgressStats } from "../types/progress";
import { Tag } from "./tagsApi";

const COLLECTION_NAME = "progressEntries";

export const progressApi = {
	submitProgress: async (data: Omit<ProgressEntry, "id">): Promise<ProgressEntry> => {
		try {
			const entry: Omit<ProgressEntry, "id"> = {
				...data,
			};

			const docRef = await addDoc(collection(firestore, COLLECTION_NAME), entry);
			return { id: docRef.id, ...entry };
		} catch (error) {
			throw new Error(`Failed to submit progress: ${error}`);
		}
	},

	getEntries: async (): Promise<ProgressEntry[]> => {
		try {
			const q = query(collection(firestore, COLLECTION_NAME), orderBy("date", "desc"));
			const querySnapshot = await getDocs(q);
			return querySnapshot.docs.map(
				(doc) =>
					({
						id: doc.id,
						...doc.data(),
					} as ProgressEntry)
			);
		} catch (error) {
			throw new Error(`Failed to get entries: ${error}`);
		}
	},

	getStats: async (): Promise<ProgressStats> => {
		try {
			const entries = await progressApi.getEntries();

			const dailyTrend = entries.map((entry) => ({
				date: entry.date,
				satisfaction: entry.satisfaction,
			}));

			return {
				averageSatisfaction: entries.reduce((acc, curr) => acc + curr.satisfaction, 0) / (entries.length || 1),
				totalEntries: entries.length,
				dailyTrend,
			};
		} catch (error) {
			throw new Error(`Failed to get stats: ${error}`);
		}
	},

	deleteAllProgress: async (): Promise<void> => {
		try {
			const entries = await progressApi.getEntries();
			const deletePromises = entries.map((entry) => deleteDoc(doc(firestore, COLLECTION_NAME, entry.id)));
			await Promise.all(deletePromises);
		} catch (error) {
			throw new Error(`Failed to delete all progress: ${error}`);
		}
	},

	deleteEntry: async (id: string): Promise<void> => {
		try {
			await deleteDoc(doc(firestore, COLLECTION_NAME, id));
		} catch (error) {
			throw new Error(`Failed to delete entry: ${error}`);
		}
	},

	getTags: async (): Promise<Tag[]> => {
		try {
			const tagsCollection = collection(firestore, "tags");
			const querySnapshot = await getDocs(tagsCollection);
			return querySnapshot.docs.map(
				(doc) =>
					({
						id: doc.id,
						...doc.data(),
					} as Tag)
			);
		} catch (error) {
			throw new Error(`Failed to fetch tags: ${error}`);
		}
	},
};
