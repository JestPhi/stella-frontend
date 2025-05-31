<script>
	import { page } from '$app/state';
	import Button from './Button.svelte';
	import Avatar from './Avatar.svelte';
	import feather from 'feather-icons';
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
	<span class="stella">Stella</span>
	<Avatar />
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
