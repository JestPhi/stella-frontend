<script>
	import { getContext } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import Button from './Button.svelte';
	import Avatar from './Avatar.svelte';
	import feather from 'feather-icons';
	import Profile from './Profile.svelte';
	import { signOut } from 'firebase/auth';

	const auth = getContext('AUTH');
</script>

<nav class="navigation">
	<Button variant="fill" onclick={() => history.back()}
		>{@html feather.icons['arrow-left'].toSvg({
			height: 24,
			width: 24,
			stroke: '#888',
			viewBox: '0 0 24 24'
		})}</Button
	>
	<!-- <button
		class="stella"
		onclick={() => {
			signOut(auth)
				.then(() => {
					// Sign-out successful.
					console.log('sign out');
				})
				.catch((error) => {
					// An error happened.
					console.log(error);
				});
		}}>Sign out</button
	> -->
	<Profile />
</nav>

<style>
	.navigation {
		align-items: center;
		background: white;
		position: sticky;
		box-sizing: border-box;
		display: flex;
		height: 48px;
		justify-content: space-between;
		top: 0;
		z-index: 2;
	}
</style>
