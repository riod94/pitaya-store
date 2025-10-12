"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5, // 5 minutes
			gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
			refetchOnWindowFocus: false,
			refetchOnReconnect: true,
			retry: (failureCount, error) => {
				// Don't retry on 4xx errors except 429 (rate limit)
				if (error && typeof error === 'object' && 'status' in error) {
					const status = (error as any).status;
					if (status >= 400 && status < 500 && status !== 429) {
						return false;
					}
				}
				return failureCount < 3;
			},
		},
		mutations: {
			retry: 1,
		},
	},
});

interface QueryProviderProps {
	children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
	return (
		<QueryClientProvider client={queryClient}>
			{children}
		</QueryClientProvider>
	);
}
