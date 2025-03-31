<script>
	import Button from './Button.svelte';
</script>

<nav class="navigation">
	<button class="backButton">Back</button>
	<span class="stella">Stella</span>
</nav>

<style>
	.backButton {
		position: absolute;
		left: 12px;
	}
	.navigation {
		box-sizing: border-box;
		align-items: center;
		display: flex;
		height: 44px;
		justify-content: center;
		padding: 12px;
	}
</style>
