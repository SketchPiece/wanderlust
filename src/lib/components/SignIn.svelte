<script lang="ts">
	import { auth } from '$lib/firebase';
	import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

	async function signInWithGoogle() {
		const provider = new GoogleAuthProvider();
		await signInWithPopup(auth, provider);
	}
</script>

<div class="w-full h-screen flex flex-col">
	<div class="flex-1 flex flex-col justify-center items-center">
		<div class="text-center">
			<h1 class="text-4xl font-lobster">Wanderlust</h1>
			<h2 class="text-lg">Your gateway to personal travel</h2>
		</div>
		<img src="/logo.png" alt="logo" class="w-full max-w-sm" />
	</div>
	<button class="btn btn-primary w-full mt-auto mb-3" on:click={signInWithGoogle}
		>Sign in with Google</button
	>
</div>
