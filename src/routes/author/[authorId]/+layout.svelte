<script lang="ts">
	import '$lib/styles.css';
	import Navigation from '$lib/components/Navigation.svelte';

	let { children } = $props();

	import '$lib/styles.css';
	import { GoogleAuthProvider } from 'firebase/auth';
	import { initializeApp } from 'firebase/app';
	import { getAuth, signInWithRedirect, getRedirectResult, signInWithPopup } from 'firebase/auth';
	import FaceBookIcon from '$lib/components/icons/Facebook.svelte';

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
	const provider = new GoogleAuthProvider();
	const auth = getAuth(app);

	import { onAuthStateChanged } from 'firebase/auth';

	onAuthStateChanged(auth, (user) => {
		if (user) {
			// User is signed in.
			const uid = user.uid;
			// Access other user properties as needed.
			console.log('User is signed in:', uid);
		} else {
			// User is signed out.
			console.log('User is signed out');
		}
	});
</script>

<Navigation />
{@render children()}
