import React, { useState } from "react";
import { Calendar, Send, Star } from "lucide-react";
import { progressApi } from "../api/progressApi";
import { useNavigate } from "react-router-dom";
import { usePinnedTags } from "../hooks/useTags";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


export default function ProgressForm() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
				satisfaction: 0,
				activities: "",
				mistakes: "",
				tags: [] as string[],
				date: new Date(),
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { data: tags = [] } = usePinnedTags();

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
			await progressApi.submitProgress({
				...formData,
				date: formData.date.toISOString(),
			});
			navigate("/trends");
		} catch (error) {
			console.error("Failed to submit progress:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const renderStars = () => {
		return [1, 2, 3, 4, 5].map((rating) => (
			<motion.button
				key={rating}
				type="button"
				onClick={() => {
					setFormData((prev) => ({ ...prev, satisfaction: rating }));
				}}
				whileHover={{ scale: 1.1 }}
				whileTap={{ scale: 0.9 }}
				className={`focus:outline-none ${rating <= formData.satisfaction ? "text-yellow-400" : "text-gray-300"}`}
				aria-label={`Rate ${rating} stars`}
			>
				<Star className="w-8 h-8" fill={rating <= formData.satisfaction ? "currentColor" : "none"} />
			</motion.button>
		));
	};

	const renderTags = () => (
		<div className="flex flex-wrap gap-2">
			{tags.map((tag) => (
				<motion.button key={tag.id} type="button" onClick={() => handleTagToggle(tag.id)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${formData.tags.includes(tag.id) ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
					{tag.name}
				</motion.button>
			))}
		</div>
	);

	const CustomInput = React.forwardRef(({ value, onClick }: { value: string; onClick: () => void }, ref: React.Ref<HTMLButtonElement>) => (
		<button
			type="button"
			className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
			onClick={onClick}
			ref={ref}
		>
			<Calendar className="w-5 h-5" />
			{value}
		</button>
	));

	return (
		<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl mx-auto">
			<h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Daily Progress</h2>
			<form onSubmit={handleSubmit} className="space-y-8">
				<div className="space-y-6">
					<div>
						<label className="block text-lg font-medium text-gray-700 mb-2">
							Select Date
						</label>
						<DatePicker
							selected={formData.date}
							onChange={(date: Date | null) => setFormData(prev => ({ ...prev, date: date || new Date() }))}
							customInput={<CustomInput value="" onClick={() => {}} />}
							dateFormat="MMMM d, yyyy h:mm aa"
							showTimeSelect
							timeFormat="HH:mm"
							timeInputLabel="Time:"
							maxDate={new Date()}
							required
						/>
					</div>

					<div>
						<label className="block text-lg font-medium text-gray-700 mb-2">How satisfied are you with today's progress?</label>
						<div className="flex items-center justify-center gap-2">{renderStars()}</div>
					</div>

					<div>
						<label className="block text-lg font-medium text-gray-700 mb-2">What did you accomplish today?</label>
						<textarea value={formData.activities} onChange={(e) => setFormData({ ...formData, activities: e.target.value })} className="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-50 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200" rows={4} placeholder="Share your achievements..." required />
					</div>

					<div>
						<label className="block text-lg font-medium text-gray-700 mb-2">What challenges did you face?</label>
						<textarea value={formData.mistakes} onChange={(e) => setFormData({ ...formData, mistakes: e.target.value })} className="mt-1 block w-full rounded-lg border border-gray-200 bg-gray-50 p-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200" rows={4} placeholder="Reflect on areas for improvement..." required />
					</div>
				</div>

				<div>
					<label className="block text-lg font-medium text-gray-700 mb-2">Tags</label>
					<div className="mt-1">{renderTags()}</div>
				</div>

				<motion.button type="submit" disabled={isSubmitting} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-6 rounded-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed">
					{isSubmitting ? "Submitting..." : "Submit Progress"}
					<Send className="w-5 h-5" />
				</motion.button>
			</form>
		</motion.div>
	);
}
