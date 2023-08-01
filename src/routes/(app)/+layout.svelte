<script lang="ts">
	import { goto } from '$app/navigation';
	import { auth, firestore } from '$lib/firebase';
	import { onAuthStateChanged } from 'firebase/auth';
	import { doc, getDoc } from 'firebase/firestore';
	import { onMount } from 'svelte';

	onMount(() => {
		onAuthStateChanged(auth, async (user) => {
			if (!user) return goto('/signin');
			const userInfo = await getDoc<any, any>(doc(firestore, `users/${user.uid}`));
			if (userInfo.data().type === 'local') return goto('/chats');
		});
	});
</script>

<slot />
