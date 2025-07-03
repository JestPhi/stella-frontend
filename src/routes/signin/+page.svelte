<script lang="ts">
	import '$lib/styles.css';
	import { GoogleAuthProvider } from 'firebase/auth';
	import { signInWithRedirect, getRedirectResult, signInWithPopup } from 'firebase/auth';
	import FaceBookIcon from '$lib/components/icons/Facebook.svelte';
	import { getContext } from 'svelte';

	const provider = new GoogleAuthProvider();
	const auth = getContext('AUTH');

	signInWithPopup(auth, provider)
		.then((result) => {
			// This gives you a Google Access Token. You can use it to access the Google API.
			const credential = GoogleAuthProvider.credentialFromResult(result);
			const token = credential.accessToken;
			// The signed-in user info.
			const user = result.user;
			// IdP data available using getAdditionalUserInfo(result)
			// ...
		})
		.catch((error) => {
			// Handle Errors here.
			const errorCode = error.code;
			const errorMessage = error.message;
			// The email of the user's account used.
			const email = error.customData.email;
			// The AuthCredential type that was used.
			const credential = GoogleAuthProvider.credentialFromError(error);
			// ...
		});

	// getRedirectResult(auth)
	// 	.then((result) => {
	// 		// This gives you a Google Access Token. You can use it to access Google APIs.
	// 		const credential = GoogleAuthProvider.credentialFromResult(result);
	// 		const token = credential.accessToken;

	// 		// The signed-in user info.
	// 		const user = result.user;
	// 		// IdP data available using getAdditionalUserInfo(result)
	// 		// ...
	// 		console.log('User signed in:', user);
	// 	})
	// 	.catch((error) => {
	// 		// Handle Errors here.
	// 		const errorCode = error.code;
	// 		const errorMessage = error.message;
	// 		// The email of the user's account used.
	// 		const email = error.customData.email;
	// 		// The AuthCredential type that was used.
	// 		const credential = GoogleAuthProvider.credentialFromError(error);
	// 		// ...
	// 		console.error('Error during sign-in:', errorCode, errorMessage, email, credential);
	// 	});
</script>

<div class="home">
	<div class="logo">Stella</div>
	<div class="card">
		<div class="fw600 mb16">Sign in with</div>
		<button
			class="authOption"
			onclick={() => {
				signInWithRedirect(auth, provider);
			}}>Google</button
		>
		<button class="authOption"><FaceBookIcon /> <span class="ml8">Facebook</span></button>
		<button class="authOption">Apple</button>
	</div>
</div>

<style>
	.home {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh;
	}
	.blurb {
		font-size: 24px;
	}
	.authOption {
		align-items: center;
		display: flex;
		background: white;
		border-radius: 8px;
		border: none;
		justify-content: center;
		height: 44px;
		width: 100%;
		margin: 4px 0;
	}
	.card {
		align-items: center;
		background: whitesmoke;
		border-radius: 8px;
		display: flex;
		flex-direction: column;
		width: 280px;
		padding: 16px;
	}
	.signIn {
	}
</style>
