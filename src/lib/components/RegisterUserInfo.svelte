<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth, firestore } from '$lib/firebase';
	import { avatarUrl, cn } from '$lib/utils';
	import type { User } from 'firebase/auth';
	import { setDoc } from 'firebase/firestore';
	import { docStore } from 'sveltefire';
	export let user: User;

	const userInfo = docStore(firestore, `users/${user.uid}`);

	$: {
		if ($userInfo) goto('/');
	}

	let userInfoForm = {
		name: '',
		country: '',
		city: '',
		description: '',
		type: 'tourist'
	};

	function handleTypeChange(newType: string) {
		userInfoForm.type = newType;
	}

	async function handleSave() {
		if (!userInfo.ref) return;
		if (userInfoForm.type === 'tourist')
			userInfoForm = {
				...userInfoForm,
				country: '',
				city: '',
				type: 'tourist'
			};

		await setDoc(userInfo.ref, userInfoForm);
	}
</script>

<div class="pt-10">
	<h1 class="text-4xl font-lobster text-center">Wanderlust</h1>
	<h2 class="text-lg text-center">Register your account</h2>
	<img
		src={avatarUrl(userInfoForm.name)}
		alt="avatar"
		class="w-40 h-40 rounded-full mx-auto mt-4"
	/>
	<div class="grid place-items-center mt-4">
		<div class="bg-neutral py-2 px-3 inline-block rounded-lg">
			<button
				class={cn(
					userInfoForm.type === 'tourist' && 'bg-primary text-black',
					'px-4 py-2 rounded-lg'
				)}
				on:click={() => handleTypeChange('tourist')}
			>
				Tourist
			</button>
			<button
				class={cn(userInfoForm.type === 'local' && 'bg-primary text-black', 'px-4 py-2 rounded-lg')}
				on:click={() => handleTypeChange('local')}>Local</button
			>
		</div>
	</div>
	<div class="grid px-10 gap-4 mt-4">
		<label>
			<p class="font-semibold">Username</p>
			<input type="text" class="input input-bordered w-full" bind:value={userInfoForm.name} />
		</label>
		{#if userInfoForm.type === 'local'}
			<label>
				<p class="font-semibold">Country</p>
				<input type="text" class="input input-bordered w-full" bind:value={userInfoForm.country} />
			</label>
			<label>
				<p class="font-semibold">City</p>
				<input type="text" class="input input-bordered w-full" bind:value={userInfoForm.city} />
			</label>
		{/if}
		<label>
			<p class="font-semibold">{userInfoForm.type === 'tourist' ? 'Bio' : 'Description'}</p>
			<textarea class="textarea textarea-bordered w-full" bind:value={userInfoForm.description} />
		</label>

		<button class="btn btn-primary" on:click={handleSave}>Save</button>
	</div>
</div>
