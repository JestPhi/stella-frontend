<script>
	import Button from './Button.svelte';
	import Avatar from './Avatar.svelte';
	import feather from 'feather-icons';
</script>

<nav class="navigation">
	<Button class="minimal">{@html feather.icons['arrow-left'].toSvg({ stroke: '#888' })}</Button>
	<span class="stella">Stella</span>
	<Avatar />
</nav>

<style>
	.navigation :global(.minimal) {
		position: absolute;
		left: 12px;
	}
	.navigation :global(.avatar) {
		position: absolute;
		right: 12px;
	}
	.navigation {
		background: white;
		position: sticky;
		box-sizing: border-box;
		display: flex;
		height: 44px;
		justify-content: center;
		padding: 12px;
		top: 0;
	}
</style>
