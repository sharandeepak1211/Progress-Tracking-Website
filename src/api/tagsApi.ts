import { collection, addDoc, getDocs, deleteDoc, doc, query, where, updateDoc } from "firebase/firestore";
import { firestore } from "../config/firebase";

const COLLECTION_NAME = "tags";

export interface Tag {
	id: string;
	name: string;
	createdAt: string;
	isPinned: boolean;
}

export const tagsApi = {
	getTags: async (pinnedOnly: boolean = false) => {
		try {
			const tagsRef = collection(firestore, COLLECTION_NAME);
			const q = pinnedOnly 
				? query(tagsRef, where('isPinned', '==', true))
				: tagsRef;
			
			const snapshot = await getDocs(q);
			return snapshot.docs.map(doc => ({
				id: doc.id,
				...doc.data(),
			})) as Tag[];
		} catch (error) {
			console.error('Error fetching tags:', error);
			return [];
		}
	},

	createTag: async (name: string, isPinned: boolean = false): Promise<Tag> => {
		try {
			const tag: Omit<Tag, "id"> = {
				name,
				createdAt: new Date().toISOString(),
				isPinned,
			};

			const docRef = await addDoc(collection(firestore, COLLECTION_NAME), tag);
			return { id: docRef.id, ...tag };
		} catch (error) {
			throw new Error(`Failed to create tag: ${error}`);
		}
	},

	updateTag: async (id: string, tag: Partial<Tag>): Promise<Tag> => {
		try {
			await updateDoc(doc(firestore, COLLECTION_NAME, id), tag);
			return { id, ...tag } as Tag;
		} catch (error) {
			throw new Error(`Failed to update tag: ${error}`);
		}
	},

	deleteTag: async (id: string): Promise<void> => {
		try {
			await deleteDoc(doc(firestore, COLLECTION_NAME, id));
		} catch (error) {
			throw new Error(`Failed to delete tag: ${error}`);
		}
	},
};
