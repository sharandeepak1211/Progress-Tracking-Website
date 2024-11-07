import React from "react";
import { progressApi } from "../api/progressApi";
import { Star, Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTags } from "../hooks/useTags";

export default function HistoryPage() {
	const queryClient = useQueryClient();

	const { data: entries = [], isLoading: entriesLoading } = useQuery({
		queryKey: ["entries"],
		queryFn: progressApi.getEntries,
	});

	const { data: tags = [], isLoading: tagsLoading } = useTags();

	const deleteMutation = useMutation({
		mutationFn: progressApi.deleteEntry,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["entries"] });
			toast.success("Entry deleted successfully");
		},
		onError: (error) => {
			toast.error("Failed to delete entry");
			throw new Error(`Failed to delete entry: ${error}`);
		},
	});

	const handleDelete = (id: string) => {
		deleteMutation.mutate(id);
	};

	const getTagName = (tagId: string) => {
		const tag = tags.find((t) => t.id === tagId);
		return tag ? tag.name : tagId;
	};

	if (entriesLoading || tagsLoading) {
		return (
			<div className="flex justify-center items-center py-12">
				<Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{entries.map((entry) => (
				<div key={entry.id} className="bg-white rounded-lg shadow-lg p-6">
					<div className="flex justify-between items-start mb-4">
						<div>
							<p className="text-sm text-gray-500">
								{new Date(entry.date).toLocaleDateString("en-US", {
									weekday: "long",
									year: "numeric",
									month: "long",
									day: "numeric",
								})}
							</p>
						</div>
						<div className="flex items-center gap-4">
							<div className="flex items-center">
								<Star className="w-5 h-5 text-yellow-400" />
								<span className="ml-1 font-semibold">{entry.satisfaction}</span>
							</div>
							<button onClick={() => handleDelete(entry.id)} disabled={deleteMutation.isPending} className="p-1 hover:bg-red-50 rounded-full transition-colors duration-200" title="Delete entry">
								{deleteMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin text-red-500" /> : <Trash2 className="w-5 h-5 text-red-500" />}
							</button>
						</div>
					</div>

					<div className="space-y-4">
						<div>
							<h4 className="text-md font-semibold text-gray-700 mb-2">Activities</h4>
							<p className="text-gray-600">{entry.activities}</p>
						</div>

						<div>
							<h4 className="text-md font-semibold text-gray-700 mb-2">Mistakes & Learnings</h4>
							<p className="text-gray-600">{entry.mistakes}</p>
						</div>
						{entry.tags && entry.tags.length > 0 && (
							<div>
								<h4 className="text-md font-semibold text-gray-700 mb-2">Tags</h4>
								<div className="flex flex-wrap gap-2">
									{entry.tags.map((tagId: string, index: number) => (
										<span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
											{getTagName(tagId)}
										</span>
									))}
								</div>
							</div>
						)}
					</div>
				</div>
			))}

			{entries.length === 0 && (
				<div className="text-center py-12">
					<p className="text-gray-500">No entries yet. Start tracking your progress!</p>
				</div>
			)}
		</div>
	);
}
