<script lang="ts">
	import feather from 'feather-icons';
	import Button from '$lib/components/Button.svelte';
	import { moveItemUp, moveItemDown, removeItem } from './helpers';
	import EditPage from '../EditPage/index.svelte';

	const { pg, pages } = $props();
</script>

<div class="bar">
	<div class="left">
		{#if pg !== 'cover'}
			<Button
				class="minimal trash ml12"
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
	</div>
	<div class="right">
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
			class="minimal ml12"
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
</div>

<style>
	.bar {
		display: flex;
		justify-content: space-between;
		padding: 0 12px;
	}
	.left,
	.right {
		display: flex;
	}
</style>
