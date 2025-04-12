<script lang="ts">
	import PageActions from './PageActions.svelte';
	import InsertPage from './InsertPage.svelte';
	import Caption from './Caption.svelte';

	const props = $props();

	const { layout, text, pg } = $state.snapshot(props);
</script>

<div class="page">
	<InsertPage />
	<PageActions {pg} />
	<figure class="content">
		{#each layout as item}
			<img class="graphic" src={item.src} alt={item.caption} />
			<!-- <span class="meta">{F}f/2.8 1/{SS} ISO{ISO}</span> -->
			<Caption text={item.caption} />
		{/each}
	</figure>
	<p>{text}</p>
	<div class="bar">
		<div class="pageNumber">pg {pg}</div>
	</div>
</div>

<style>
	.content {
		margin: 0;
	}
	.meta {
		display: flex;
		font-size: 12px;
		margin-bottom: 12px;
		color: #999;
		align-items: center;
		justify-content: center;
		width: 100%;
	}
	.graphic {
		margin-bottom: 4px;
		margin-top: 12px;
		width: 100%;
	}
	.pageNumber {
		text-align: center;
		margin-right: 12px;
	}
	.bar {
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}
</style>
