import React, { useState } from "react";
import { X } from "lucide-react";

interface AddQuestionModalProps {
	onClose: () => void;
	onSubmit: (questionData: unknown) => void;
}

export function AddQuestionModal({ onClose, onSubmit }: AddQuestionModalProps) {
	try {
		const [questionData, setQuestionData] = useState({
			text: "",
			type: "text",
			options: [] as string[],
		});

		const handleSubmit = (e: React.FormEvent) => {
			e.preventDefault();
			onSubmit(questionData);
		};

		return (
			<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
				<div className="bg-white p-6 rounded-lg w-full max-w-md">
					<div className="flex justify-between items-center mb-4">
						<h3 className="text-xl font-bold">Add New Question</h3>
						<button onClick={onClose}>
							<X className="w-6 h-6" />
						</button>
					</div>

					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label className="block text-sm font-medium mb-1">Question Text</label>
							<input type="text" value={questionData.text} onChange={(e) => setQuestionData({ ...questionData, text: e.target.value })} className="w-full rounded-lg border p-2" required />
						</div>

						<div>
							<label className="block text-sm font-medium mb-1">Question Type</label>
							<select value={questionData.type} onChange={(e) => setQuestionData({ ...questionData, type: e.target.value })} className="w-full rounded-lg border p-2">
								<option value="text">Short Answer</option>
								<option value="rating">Rating Scale</option>
								<option value="mcq">Multiple Choice</option>
							</select>
						</div>

						{questionData.type === "mcq" && (
							<div>
								<label className="block text-sm font-medium mb-1">Options (one per line)</label>
								<textarea
									value={questionData.options.join("\n")}
									onChange={(e) =>
										setQuestionData({
											...questionData,
											options: e.target.value.split("\n").filter(Boolean),
										})
									}
									className="w-full rounded-lg border p-2"
									rows={4}
								/>
							</div>
						)}

						<button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700">
							Add Question
						</button>
					</form>
				</div>
			</div>
		);
	} catch (error) {
		throw new Error(`Failed to render AddQuestionModal ${error}`);
	}
}
