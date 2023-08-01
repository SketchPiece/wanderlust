<script lang="ts">
	import { avatarUrl } from '$lib/utils';
	import { ArrowBigLeft } from 'lucide-svelte';
	import type { PageData } from './$types';
	import { Doc } from 'sveltefire';
	import { doc, updateDoc } from 'firebase/firestore';
	import { firestore } from '$lib/firebase';

	export let data: PageData;

	let loading = false;

	async function handleFinishTrip() {
		loading = true;
		await updateDoc(doc(firestore, `trips/${data.chatId}`), {
			active: false
		});
		loading = false;
	}
</script>

<Doc ref={`trips/${data.chatId}`} let:data={tripInfo}>
	<Doc ref={`users/${tripInfo.localId}`} let:data={buddyInfo}>
		<div class="flex items-center p-2">
			<a href={`/chats/${data.chatId}`}>
				<ArrowBigLeft class="w-10 h-10" />
			</a>
			<h1 class="text-5xl font-lobster text-center my-4 flex-1 mr-10">Travel Info</h1>
		</div>
		<div class="mt-10 px-4">
			<h2 class="text-center my-2 font-semibold text-3xl">Your travel buddy</h2>
			<img src={avatarUrl(buddyInfo.name)} alt="avatar" class="rounded-full mx-auto w-52 h-52" />
			<h2 class="text-4xl text-bold text-center mt-5">{buddyInfo.name}</h2>
			<p class="italic text-center">{buddyInfo.country} - {buddyInfo.city}</p>
			<div class="rounded-3xl bg-neutral px-6 py-4 mt-5">
				<h3 class="text-xl font-semibold">About me</h3>
				<p class="mt-3">
					{buddyInfo.description}
				</p>
				<button
					class="btn w-full mt-4 btn-error"
					disabled={!tripInfo.active}
					on:click={handleFinishTrip}
					>{tripInfo.active ? 'Finish trip' : 'Finished trip'}
				</button>
			</div>
		</div>
	</Doc>
</Doc>
