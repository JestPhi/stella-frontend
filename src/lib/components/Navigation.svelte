<script>
	import { page } from '$app/state';
	import Button from './Button.svelte';
	import Avatar from './Avatar.svelte';
	import feather from 'feather-icons';
</script>

<nav class="navigation">
	<button onclick={() => history.back()}
		>{@html feather.icons['arrow-left'].toSvg({
			height: 24,
			width: 24,
			stroke: '#888',
			viewBox: '0 0 24 24'
		})}</button
	>
	<span class="stella">Stella</span>
	<Avatar />
</nav>

<style>
	.navigation button {
		background: none;
		border: none;
		height: 48px;
		width: 48px;
		position: absolute;
		left: 0;
		padding: 0;
	}
	.navigation :global(.avatar) {
		position: absolute;
		right: 16px;
	}
	.navigation {
		align-items: center;
		background: white;
		position: sticky;
		box-sizing: border-box;
		display: flex;
		height: 56px;
		justify-content: center;
		top: 0;
		z-index: 2;
	}
</style>
