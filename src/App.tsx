import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import ProgressForm from "./components/ProgressForm";
import TrendsPage from "./pages/TrendsPage";
import HistoryPage from "./pages/HistoryPage";
import Settings from "./pages/Settings";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import TagsManagement from "./pages/TagsManagement";
import { useEffect } from "react";

const queryClient = new QueryClient();

export function App() {
	useEffect(() => {
		if ("serviceWorker" in navigator) {
			navigator.serviceWorker
				.register("/service-worker.js")
				.then((registration) => {
					console.log("Service Worker registered:", registration);
				})
				.catch((error) => {
					console.error("Service Worker registration failed:", { error });
				});
		}
	}, []);

	return (
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
					<div className="container mx-auto px-4 py-12 max-w-4xl">
						<div className="text-center mb-8">
							<h1 className="text-4xl font-bold text-gray-900 mb-4">Daily Progress Tracker</h1>
							<p className="text-lg text-gray-600">Reflect on your day and track your journey towards improvement</p>
						</div>
						<Navigation />
						<Routes>
							<Route path="/" element={<ProgressForm />} />
							<Route path="/trends" element={<TrendsPage />} />
							<Route path="/history" element={<HistoryPage />} />
							<Route path="/settings" element={<Settings />} />
							<Route path="/tags" element={<TagsManagement />} />
						</Routes>
					</div>
				</div>
			</BrowserRouter>
			<Toaster position="bottom-center" />
		</QueryClientProvider>
	);
}
