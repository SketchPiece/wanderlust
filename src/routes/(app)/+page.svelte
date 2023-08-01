<script lang="ts">
	import { goto } from '$app/navigation';
	import PageLayout from '$lib/components/layouts/PageLayout.svelte';
	import { auth, firestore } from '$lib/firebase';
	import { avatarUrl } from '$lib/utils';
	import { collection, doc, query, updateDoc, where } from 'firebase/firestore';
	import { CheckCircle2, Search, XCircle } from 'lucide-svelte';
	import { Collection, docStore, userStore } from 'sveltefire';

	const user = userStore(auth);
	const userInfo = docStore<{ name: string; type: 'tourist' | 'local' }>(
		firestore,
		`users/${$user?.uid}`
	);

	$: isTourist = $userInfo?.type === 'tourist';

	const localsQuery = query(collection(firestore, 'users'), where('type', '==', 'local'));
	$: tripsQuery = query(
		collection(firestore, 'trips'),
		where('localId', '==', $user?.uid || ''),
		where('status', '==', 'pending')
	);

	async function tripAction(tripId: string, action: 'accept' | 'decline') {
		const tripRef = doc(firestore, `trips/${tripId}`);
		await updateDoc(tripRef, {
			status: action === 'accept' ? 'accepted' : 'declined'
		});
		if (action === 'accept') goto(`/chats/${tripId}`);
	}
</script>

<PageLayout>
	{#if isTourist}
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
	{:else}
		<h1 class="text-5xl font-lobster text-center my-4">Pending trips</h1>
		<div>
			<Collection ref={tripsQuery} let:data={trips}>
				<!-- {@debug trips} -->

				{#each trips as trip (trip.id)}
					<div class="bg-neutral p-4 rounded-2xl flex">
						<div class="flex items-center gap-2">
							<img src={avatarUrl(trip.touristName)} alt="avatar" class="rounded-full h-10 w-10" />

							<div>
								<p class="font-semibold">{trip.touristName}</p>
								<p>{trip.touristDescription}</p>
							</div>
						</div>

						<div class="ml-auto">
							<button class="btn btn-success" on:click={() => tripAction(trip.id, 'accept')}>
								<CheckCircle2 />
							</button>
							<button class="btn btn-error" on:click={() => tripAction(trip.id, 'decline')}>
								<XCircle />
							</button>
						</div>
					</div>
				{/each}
			</Collection>
		</div>
	{/if}
</PageLayout>
