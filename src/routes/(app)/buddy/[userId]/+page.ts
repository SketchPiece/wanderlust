import type { PageLoad } from './$types';

export const load = (async ({ params }) => {
	return {
		userId: params.userId
	};
}) satisfies PageLoad;
