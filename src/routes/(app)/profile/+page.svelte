<script lang="ts">
	import PageLayout from '$lib/components/layouts/PageLayout.svelte';
	import { auth } from '$lib/firebase';
	import { avatarUrl } from '$lib/utils';
	import { signOut } from 'firebase/auth';
	import { Doc, User } from 'sveltefire';

	function handleLogout() {
		signOut(auth);
	}
</script>

<PageLayout>
	<User let:user>
		<Doc ref={`users/${user.uid}`} let:data={userInfo}>
			<h1 class="text-5xl font-lobster text-center my-4">Profile</h1>
			<div class="mt-10 px-2">
				<img src={avatarUrl('Nick')} alt="avatar" class="rounded-full mx-auto w-52 h-52" />
				<h2 class="text-4xl text-bold text-center mt-5">{userInfo.name}</h2>
				<div class="rounded-3xl bg-neutral px-6 py-4 mt-5">
					<h3 class="text-xl font-semibold">Bio</h3>
					<p class="mt-3">
						{userInfo.description}
					</p>
					<button class="btn btn-error w-full mt-4" on:click={handleLogout}>Logout</button>
				</div>
			</div>
		</Doc>
	</User>
</PageLayout>
