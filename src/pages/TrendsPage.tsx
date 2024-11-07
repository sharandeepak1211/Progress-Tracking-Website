import React from "react";
import { progressApi } from "../api/progressApi";
import TrendChart from "../components/TrendChart";
import { Trophy } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

export default function TrendsPage() {
	const { data: stats, isLoading } = useQuery({
		queryKey: ["stats"],
		queryFn: progressApi.getStats,
	});

	if (isLoading) {
		return (
			<div className="flex justify-center items-center py-12">
				<Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
			</div>
		);
	}

	return (
		<div className="space-y-8">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="bg-white p-6 rounded-lg shadow-lg">
					<div className="flex items-center justify-between mb-4">
						<h3 className="text-lg font-semibold text-gray-700">Average Satisfaction</h3>
						<Trophy className="w-6 h-6 text-yellow-500" />
					</div>
					<p className="text-3xl font-bold text-indigo-600">{stats?.averageSatisfaction.toFixed(1)} / 5.0</p>
				</div>
				<div className="bg-white p-6 rounded-lg shadow-lg">
					<h3 className="text-lg font-semibold text-gray-700 mb-4">Total Entries</h3>
					<p className="text-3xl font-bold text-indigo-600">{stats?.totalEntries}</p>
				</div>
			</div>
			{stats && <TrendChart data={stats.dailyTrend} />}
		</div>
	);
}
