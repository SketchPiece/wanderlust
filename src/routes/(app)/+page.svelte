<script lang="ts">
	import PageLayout from '$lib/components/layouts/PageLayout.svelte';
	import { firestore } from '$lib/firebase';
	import { avatarUrl } from '$lib/utils';
	import { collection, query, where } from 'firebase/firestore';
	import { Search } from 'lucide-svelte';
	import { Collection } from 'sveltefire';

	const localsQuery = query(collection(firestore, 'users'), where('type', '==', 'local'));
</script>

<PageLayout>
	<h1 class="text-5xl font-lobster text-center my-4">Search</h1>
	<div class="relative px-2">
		<input
			type="text"
			class="input input-bordered w-full pl-12"
			placeholder="Search your treavel buddy"
		/>
		<Search class="absolute left-4 top-3" />
	</div>
	<div class="grid grid-cols-2 gap-4 mt-3 px-2">
		<Collection ref={localsQuery} let:data={locals}>
			{#each locals as local (local.id)}
				<a class="bg-neutral p-4 rounded-2xl" href={`/buddy/${local.id}`}>
					<img src={avatarUrl(local.name)} alt="avatar" class="rounded-full" />
					<div class="mt-2">
						<p class="font-semibold">{local.name}</p>
						<p>{local.country} - {local.city}</p>
					</div>
				</a>
			{/each}
		</Collection>
	</div>
</PageLayout>
