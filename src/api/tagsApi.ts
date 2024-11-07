import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { firestore } from "../config/firebase";

const COLLECTION_NAME = "tags";

export interface Tag {
	id: string;
	name: string;
	createdAt: string;
}

export const tagsApi = {
	getTags: async () => {
		try {
			const tagsCollection = collection(firestore, "tags");
			const querySnapshot = await getDocs(tagsCollection);
			return querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			})) as Tag[];
		} catch (error) {
			throw new Error(`Failed to fetch tags: ${error}`);
		}
	},

	createTag: async (name: string): Promise<Tag> => {
		try {
			const tag: Omit<Tag, "id"> = {
				name,
				createdAt: new Date().toISOString(),
			};

			const docRef = await addDoc(collection(firestore, COLLECTION_NAME), tag);
			return { id: docRef.id, ...tag };
		} catch (error) {
			throw new Error(`Failed to create tag: ${error}`);
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
