import { useQuery } from "@tanstack/react-query";
import { tagsApi } from "../api/tagsApi";

export interface Tag {
	id: string;
	name: string;
	isPinned: boolean;
}

export function useAllTags() {
	return useQuery<Tag[]>({
		queryKey: ["tags"],
		queryFn: () => tagsApi.getTags(false),
	});
}

export function usePinnedTags() {
	return useQuery<Tag[]>({
		queryKey: ["pinnedTags"],
		queryFn: () => tagsApi.getTags(true),
	});
}
