<script lang="ts">
	import feather from 'feather-icons';
	import Button from '$lib/components/Button.svelte';
</script>

<div class="floatingButton">
	<Button class="minimal"
		>{@html feather.icons['settings'].toSvg({
			stroke: '#888',
			width: 18,
			height: 18
		})}</Button
	>
</div>

<style>
	.floatingButton {
		background: white;
		height: 48px;
		width: 48px;
		position: sticky;
		left: 100%;
		bottom: 0px;
	}
</style>
