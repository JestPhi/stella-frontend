<script>
	import { setContext } from 'svelte';
	import '$lib/styles.css';
	import { initializeApp } from 'firebase/app';
	import { getAuth, onAuthStateChanged } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import Menu from '$lib/components/Menu.svelte';

	const firebaseConfig = {
		apiKey: 'AIzaSyCjax-slr22hK8fhz4UH8TPdwPFBspnCos',
		authDomain: 'stella-f5652.firebaseapp.com',
		projectId: 'stella-f5652',
		storageBucket: 'stella-f5652.firebasestorage.app',
		messagingSenderId: '656826535955',
		appId: '1:656826535955:web:109ac457f30f132395efe6',
		measurementId: 'G-27DBFQ4ES0'
	};

	const app = initializeApp(firebaseConfig);
	const auth = getAuth(app);

	onAuthStateChanged(auth, (user) => {
		if (user) {
			// User is signed in.
			const uid = user.uid;
			// Access other user properties as needed.
			console.log('User is signed in:', uid);
			goto('/author/test');
		} else {
			// User is signed out.
			console.log('User is signed out');
			goto('/signin');
		}
	});

	let { children } = $props();

	setContext('AUTH', auth);
</script>

{@render children()}
<Menu />
