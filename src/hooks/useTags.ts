import { useQuery } from "@tanstack/react-query";
import { progressApi } from "../api/progressApi";
import { Tag, tagsApi } from "../api/tagsApi";

export function useTags() {
	try {
		return useQuery({
			queryKey: ["tags"],
			queryFn: tagsApi.getTags,
		});
	} catch (error) {
		throw new Error(`Failed to use tags query: ${error}`);
	}
}
