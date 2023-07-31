<script lang="ts">
	import PageLayout from '$lib/components/layouts/PageLayout.svelte';
	import { auth, firestore } from '$lib/firebase';
	import { avatarUrl } from '$lib/utils';
	import { collection, query, where } from 'firebase/firestore';
	import { Collection, docStore, userStore } from 'sveltefire';

	const user = userStore(auth);
	const userInfo = docStore<{ name: string; type: 'tourist' | 'local' }>(
		firestore,
		`users/${$user?.uid}`
	);

	$: isTourist = $userInfo?.type === 'tourist';

	$: tripsQuery = query(
		collection(firestore, 'trips'),
		where(!isTourist ? 'localId' : 'touristId', '==', $user?.uid || '')
	);
</script>

<PageLayout>
	<h1 class="text-5xl font-lobster text-center my-4">Chats</h1>
	<div class="grid gap-2">
		<Collection ref={tripsQuery} let:data={trips}>
			{#each trips as trip}
				<a class="bg-neutral flex p-4 h-20 rounded-xl gap-4" href={`/chats/${trip.id}`}>
					<img
						src={avatarUrl(isTourist ? trip.localName : trip.touristName)}
						alt="avatar"
						class="h-full w-auto rounded-full"
					/>
					<div>
						<p class="font-semibold">{isTourist ? trip.localName : trip.touristName}</p>
						{#if trip.last}
							<p class="text-sm">{trip.last.userName}: {trip.last.message}</p>
						{:else}
							<p class="text-sm">No messages yet</p>
						{/if}
					</div>
				</a>
			{/each}
		</Collection>
	</div>
</PageLayout>
