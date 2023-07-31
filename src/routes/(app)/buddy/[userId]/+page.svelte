<script lang="ts">
	import { ArrowBigLeft } from 'lucide-svelte';
	import type { PageData } from './$types';
	import { avatarUrl } from '$lib/utils';
	import { Doc, docStore, userStore } from 'sveltefire';
	import { onMount } from 'svelte';
	import { auth, firestore } from '$lib/firebase';
	import { doc, getDoc, setDoc } from 'firebase/firestore';
	import { goto } from '$app/navigation';

	export let data: PageData;

	let state: 'loading' | 'create' | 'exist' = 'loading';

	const user = userStore(auth);
	async function fetchTrip(localId: string) {
		const trip = await getDoc(doc(firestore, 'trips', localId));
		if (trip.exists()) state = 'exist';
		else state = 'create';
	}

	$: if ($user?.uid) {
		fetchTrip(data.userId);
	}

	async function handleSelect() {
		state = 'loading';
		if (!$user) return;
		const localUser = await getDoc(doc(firestore, 'users', data.userId));
		const touristUser = await getDoc(doc(firestore, 'users', $user.uid));

		await setDoc(doc(firestore, 'trips', data.userId), {
			localName: localUser.data()?.name,
			touristName: touristUser.data()?.name,
			localId: data.userId,
			touristId: $user.uid,
			active: true,
			createdAt: new Date().toISOString()
		});
		state = 'exist';
		goto(`/chats/${data.userId}`);
	}
</script>

<div class="flex items-center">
	<a href="/">
		<ArrowBigLeft class="w-10 h-10" />
	</a>
	<h1 class="text-5xl font-lobster text-center my-4 flex-1 mr-10">Buddy Profile</h1>
</div>
<div class="mt-10 px-4">
	<Doc ref={`users/${data.userId}`} let:data={user}>
		<img src={avatarUrl(user.name)} alt="avatar" class="rounded-full mx-auto w-52 h-52" />
		<h2 class="text-4xl text-bold text-center mt-5">{user.name}</h2>
		<p class="italic text-center">{user.country} - {user.city}</p>
		<div class="rounded-3xl bg-neutral px-6 py-4 mt-5">
			<h3 class="text-xl font-semibold">About me</h3>
			<p class="mt-3">
				{user.description}
			</p>
			<button
				class="btn w-full mt-4 btn-secondary"
				disabled={state === 'loading' || state === 'exist'}
				on:click={handleSelect}>{state === 'exist' ? 'Host selected' : 'Select this host'}</button
			>
		</div>
	</Doc>
</div>
