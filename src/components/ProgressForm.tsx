import React, { useState } from "react";
import { Send, Star } from "lucide-react";
import { progressApi } from "../api/progressApi";
import { useNavigate } from "react-router-dom";
import { useTags } from "../hooks/useTags";

export default function ProgressForm() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		satisfaction: 0,
		activities: "",
		mistakes: "",
		tags: [] as string[],
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { data: tags = [] } = useTags();

	const handleTagToggle = (tagId: string) => {
		setFormData((prev) => {
			const newTags = prev.tags.includes(tagId) ? prev.tags.filter((id) => id !== tagId) : [...prev.tags, tagId];
			return { ...prev, tags: newTags };
		});
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			await progressApi.submitProgress(formData);
			navigate("/trends");
		} catch (error) {
			console.error("Failed to submit progress:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const renderStars = () => {
		return [1, 2, 3, 4, 5].map((rating) => (
			<button
				key={rating}
				type="button"
				onClick={() => {
					setFormData((prev) => ({ ...prev, satisfaction: rating }));
				}}
				className={`transform transition-all duration-200 hover:scale-100 group focus:outline-none ${rating <= formData.satisfaction ? "text-yellow-400" : "text-gray-300"}`}
				aria-label={`Rate ${rating} stars`}
			>
				<Star className="w-8 h-8 transition-transform hover:scale-110" fill={rating <= formData.satisfaction ? "currentColor" : "none"} />
			</button>
		));
	};

	const renderTags = () => (
		<div className="flex flex-wrap gap-2">
			{tags.map((tag) => (
				<button key={tag.id} type="button" onClick={() => handleTagToggle(tag.id)} className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${formData.tags.includes(tag.id) ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}>
					{tag.name}
				</button>
			))}
		</div>
	);

	return (
		<div className="bg-white rounded-xl shadow-xl p-8">
			<form onSubmit={handleSubmit} className="space-y-8">
				<div className="space-y-4">
					<label className="block">
						<span className="text-lg font-medium text-gray-700">How satisfied are you with today's progress?</span>
						<div className="flex items-center justify-center gap-2 mt-2">{renderStars()}</div>
					</label>

					<label className="block">
						<span className="text-lg font-medium text-gray-700">What did you do today?</span>
						<textarea value={formData.activities} onChange={(e) => setFormData({ ...formData, activities: e.target.value })} className="mt-2 block w-full rounded-lg border-gray-300 bg-gray-50 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" rows={4} placeholder="Share your accomplishments..." required />
					</label>

					<label className="block">
						<span className="text-lg font-medium text-gray-700">Have you made any mistakes?</span>
						<textarea value={formData.mistakes} onChange={(e) => setFormData({ ...formData, mistakes: e.target.value })} className="mt-2 block w-full rounded-lg border-gray-300 bg-gray-50 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" rows={4} placeholder="Reflect on areas for improvement..." required />
					</label>
				</div>

				<label className="block">
					<span className="text-lg font-medium text-gray-700">Tags</span>
					<div className="mt-2">{renderTags()}</div>
				</label>

				<button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium disabled:opacity-50">
					{isSubmitting ? "Submitting..." : "Submit Progress"}
					<Send className="w-5 h-5" />
				</button>
			</form>
		</div>
	);
}
