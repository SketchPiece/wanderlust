<script lang="ts">
	import RegisterUserInfo from '$lib/components/RegisterUserInfo.svelte';
	import SignIn from '$lib/components/SignIn.svelte';
	import { auth } from '$lib/firebase';
	import { signOut } from 'firebase/auth';
	import { User } from 'sveltefire';

	function handleSignOut() {
		signOut(auth);
	}
</script>

<div class="px-4">
	<User let:user>
		<RegisterUserInfo {user} />
		<SignIn slot="signedOut" />
	</User>
</div>
