<script lang="ts">
	import { avatarUrl } from '$lib/utils';
	import { ArrowBigLeft, Plane, SendHorizonal } from 'lucide-svelte';
	import type { PageData } from './$types';
	import { Doc, collectionStore, docStore, userStore, User } from 'sveltefire';
	import { addDoc, collection, doc, orderBy, query, updateDoc } from 'firebase/firestore';
	import { auth, firestore } from '$lib/firebase';
	import { afterUpdate, beforeUpdate } from 'svelte';
	import type { User as UserType } from 'firebase/auth';

	export let data: PageData;

	// const user = userStore(auth);
	// $: userInfo = docStore<{ name: string; type: string }>(firestore, `users/${$user?.uid}`);

	let message = '';
	let loading = false;

	let messageContainer: HTMLDivElement | null = null;
	let autoscroll = false;
	let firstRender = true;

	beforeUpdate(() => {
		if (messageContainer) {
			const scrollableDistance = messageContainer.scrollHeight - messageContainer.offsetHeight;
			autoscroll = messageContainer.scrollTop > scrollableDistance - 20 || firstRender;
			firstRender = false;
		}
	});

	afterUpdate(() => {
		if (autoscroll) scrollToBottom();
	});

	const scrollToBottom = () => {
		if (messageContainer) {
			messageContainer.scrollTo(0, messageContainer.scrollHeight);
		}
	};

	async function handleMessage(user: UserType, userInfo: { name: string; type: string }) {
		if (!message || loading || !user || !userInfo) return;
		loading = true;
		const createdMessage = structuredClone(message);
		console.log(createdMessage);
		message = '';
		await addDoc(collection(firestore, `trips/${data.chatId}/messages`), {
			userId: user.uid,
			userName: userInfo.name,
			message: createdMessage,
			createdAt: new Date().toISOString()
		});
		await updateDoc(doc(firestore, `trips/${data.chatId}`), {
			last: {
				userId: user.uid,
				userName: userInfo.name,
				message: createdMessage,
				createdAt: new Date().toISOString()
			}
		});
		scrollToBottom();
		loading = false;
	}

	const messagesQuery = query(
		collection(firestore, `trips/${data.chatId}/messages`),
		orderBy('createdAt', 'asc')
	);

	const messages = collectionStore<{ id: string; userId: string; message: string }>(
		firestore,
		messagesQuery
	);
</script>

<User let:user>
	<Doc ref={`users/${user.uid}`} let:data={userInfo}>
		<Doc ref={`trips/${data.chatId}`} let:data={tripInfo}>
			<Doc
				ref={`users/${userInfo.type === 'tourist' ? tripInfo.localId : tripInfo.touristId}`}
				let:data={buddyInfo}
			>
				<div class="flex flex-col">
					<div class="w-full bg-neutral h-20 p-2 flex gap-3 items-center">
						<a href="/chats">
							<ArrowBigLeft class="w-10 h-10" />
						</a>

						<img src={avatarUrl(buddyInfo.name)} alt="avatar" class="h-full w-auto rounded-full" />
						<div class="flex flex-col justify-center">
							<p class="font-semibold">{buddyInfo.name}</p>
							{#if userInfo.type === 'tourist'}
								<p class="text-sm">{buddyInfo.country} - {buddyInfo.city}</p>
							{/if}
						</div>
						{#if userInfo.type === 'tourist'}
							<a href={`/chats/${data.chatId}/travel`} class="ml-auto pr-2">
								<Plane class="w-8 h-8" />
							</a>
						{/if}
					</div>
					<div class="messages-container py-4" bind:this={messageContainer}>
						<!-- <Collection ref={messagesQuery} let:data={messages}> -->
						{#if $messages?.length > 0}
							{#each $messages as message (message.id)}
								{#if message.userId === user.uid}
									<div class="flex">
										<p
											class="bg-accent inline-block ml-auto px-3 py-2 mx-4 my-1 rounded-ee-sm rounded-3xl"
										>
											{message.message}
										</p>
									</div>
								{:else}
									<div>
										<p
											class="bg-neutral inline-block px-3 py-2 mx-4 my-1 rounded-ss-sm rounded-3xl"
										>
											{message.message}
										</p>
									</div>
								{/if}
							{/each}
						{:else}
							<div class="grid place-items-center bg-neutral rounded-md p-3 mx-3">
								<p>No messages yet</p>
							</div>
						{/if}

						<!-- <div>
								<p class="bg-neutral inline-block px-3 py-2 m-4 rounded-ss-sm rounded-3xl">
									Hello! How are you?
								</p>
							</div>
							<div class="flex">
								<p class="bg-accent inline-block ml-auto px-3 py-2 m-4 rounded-ee-sm rounded-3xl">
									Hello! How are you?
								</p>
							</div> -->
						<!-- </Collection> -->
					</div>
					{#if tripInfo.active}
						<form
							class="flex gap-2 px-2 mt-auto"
							on:submit|preventDefault={() => handleMessage(user, userInfo)}
						>
							<input
								type="text"
								class="input input-bordered w-full rounded-xl"
								bind:value={message}
							/>
							<button class="btn btn-primary rounded-xl" type="submit">
								<SendHorizonal />
							</button>
						</form>
					{:else}
						<div class="grid place-items-center bg-neutral rounded-md p-3">
							<p>Your trip has finished</p>
						</div>
					{/if}
				</div>
			</Doc>
		</Doc>
	</Doc>
</User>

<style>
	.messages-container {
		height: calc(100vh - 8.5rem);
		overflow-y: scroll;
	}
</style>
