<script>
	import { auth, firestore } from '$lib/firebase';
	import { FirebaseApp } from 'sveltefire';
	import '../app.css';
</script>

<FirebaseApp {auth} {firestore}>
	<div class="font-roboto max-w-lg mx-auto">
		<slot />
	</div>
</FirebaseApp>
