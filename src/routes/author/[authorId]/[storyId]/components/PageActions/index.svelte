<script lang="ts">
	import feather from 'feather-icons';
	import Button from '$lib/components/Button.svelte';
	import { moveItemUp, moveItemDown, removeItem } from '$lib/util';
	import EditPage from '../EditPage/index.svelte';
	import StoryActions from '$lib/components/StoryActions.svelte';

	const { isReadOnly, pg, pages } = $props();
</script>

<StoryActions>
	{#if !isReadOnly}
		<div class="left"></div>
		<div class="right">
			{#if pg !== 'cover'}
				<Button
					class="minimal trash"
					onclick={() => {
						removeItem(pages, pg);
					}}
				>
					{@html feather.icons['trash-2'].toSvg({
						stroke: '#888',
						width: 18,
						height: 18
					})}
				</Button>
			{/if}
			<Button
				class="minimal"
				disabled={pg === 0}
				onclick={() => {
					moveItemUp(pages, pg);
				}}
			>
				{@html feather.icons['arrow-up'].toSvg({
					stroke: '#888',
					width: 18,
					height: 18
				})}</Button
			>
			<Button
				class="minimal"
				disabled={pg === pages.length - 1}
				onclick={() => {
					moveItemDown(pages, pg);
				}}
			>
				{@html feather.icons['arrow-down'].toSvg({
					stroke: '#888',
					width: 18,
					height: 18
				})}</Button
			>
			<EditPage page={pages[pg]} />
		</div>
	{/if}
</StoryActions>

<style>
	.left {
		display: flex;
		flex: 1;
	}

	.right {
		display: flex;
		flex: 1;
		justify-content: flex-end;
	}
</style>
