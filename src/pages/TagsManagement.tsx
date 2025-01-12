import React, { useState } from "react";
import { Pin, Plus, X } from "lucide-react";
import { tagsApi } from "../api/tagsApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";

export default function TagsManagement() {
	const queryClient = useQueryClient();
	const [newTagName, setNewTagName] = useState("");
	const [error, setError] = useState<string | null>(null);
	// const fetchTags = async () => {
	// 	try {
	// 		// eslint-disable-next-line react-hooks/rules-of-hooks
	// 		const { data: tags = [], isLoading } = useQuery({
	// 			queryKey: ["tags"],
	// 			queryFn: tagsApi.getTags,
	// 		});
	// 		setTags(tags);
	// 	} catch (error) {
	// 		setError("Failed to fetch tags");
	// 		console.error(error);
	// 	}
	// };

	const { data: tags = [], isLoading } = useQuery({
		queryKey: ["tags"],
		queryFn: () => tagsApi.getTags(false),
	});

	const handleTogglePin = async (tagId: string, isPinned: boolean) => {
		try {
			const updatedTag = await tagsApi.updateTag(tagId, { isPinned: !isPinned });
			console.log(updatedTag);
			queryClient.invalidateQueries({ queryKey: ["tags"] });
		} catch (error) {
			setError("Failed to toggle pin");
			console.error(error);
		}
	};

	const handleCreateTag = async (e: React.FormEvent) => {
		try {
			e.preventDefault();
			if (!newTagName.trim()) return;
			setNewTagName("");

			await tagsApi.createTag(newTagName.trim());
			queryClient.invalidateQueries({ queryKey: ["tags"] });
		} catch (error) {
			setError("Failed to create tag");
			console.error(error);
		}
	};

	const handleDeleteTag = async (tagId: string) => {
		try {
			await tagsApi.deleteTag(tagId);
			queryClient.invalidateQueries({ queryKey: ["tags"] });
		} catch (error) {
			setError("Failed to delete tag");
			console.error(error);
		}
	};

	return (
		<div className="max-w-2xl mx-auto p-6">
			<h1 className="text-2xl font-bold mb-6">Manage Tags</h1>

			{error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

			<form onSubmit={handleCreateTag} className="mb-6">
				<div className="flex gap-2">
					<input type="text" value={newTagName} onChange={(e) => setNewTagName(e.target.value)} placeholder="Enter new tag name" className="flex-1 rounded-lg border border-gray-300 bg-gray-50 p-2" />
					<button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2">
						<Plus className="w-4 h-4" />
						Add Tag
					</button>
				</div>
			</form>

			{isLoading ? (
				<div>Loading...</div>
			) : (
				<div className="space-y-2">
					{tags.map((tag) => (
						<div key={tag.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
							<span>{tag.name}</span>
							<div className="flex items-center gap-2">
								<motion.button
									type="button"
									onClick={() => {
										handleTogglePin(tag.id, tag.isPinned);
									}}
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
									className={`focus:outline-none ${tag.isPinned ? "text-indigo-600" : "text-gray-300"}`}
									aria-label={`Rate ${tag.isPinned ? "pinned" : "unpinned"}`}
								>
									<Pin className="w-4 h-4" fill={tag.isPinned ? "currentColor" : "none"} />
								</motion.button>
								<button onClick={() => handleDeleteTag(tag.id)} className="text-red-600 hover:text-red-800">
									<X className="w-5 h-5" />
								</button>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
