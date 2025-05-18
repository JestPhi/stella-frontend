<script lang="ts">
	import feather from 'feather-icons';
	import Button from '$lib/components/Button.svelte';
	import { moveItemUp, moveItemDown, removeItem } from '$lib/util';
	import StoryActions from '$lib/components/StoryActions.svelte';

	const { index, stories } = $props();
</script>

<StoryActions>
	<Button
		class="minimal"
		disabled={index === 0}
		onclick={() => {
			moveItemUp(stories, index);
		}}
	>
		{@html feather.icons['chevron-up'].toSvg({
			stroke: index === 0 ? '#888' : '#444',
			width: 24,
			height: 24,
			viewBox: '0 0 24 24'
		})}</Button
	>
	<Button
		class="minimal"
		disabled={index === stories.length - 1}
		onclick={() => {
			moveItemDown(stories, index);
		}}
	>
		{@html feather.icons['chevron-down'].toSvg({
			stroke: index === stories.length - 1 ? '#888' : '#444',
			width: 24,
			height: 24,
			viewBox: '0 0 24 24'
		})}</Button
	>
</StoryActions>

<style>
</style>
