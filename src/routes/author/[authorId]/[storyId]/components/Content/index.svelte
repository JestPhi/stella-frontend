<script lang="ts">
	import { isBlob } from '$lib/util';

	const { pg, page } = $props();
	const blob = page?.blob;
	const blobURL = isBlob(blob) && URL.createObjectURL(blob);
	const imageURL = blobURL || page?.src;
</script>

<div class="content">
	<img id={`page-${pg}`} class="graphic" src={imageURL} alt={'caption'} />
	<p>{page?.text}</p>
	{#if pg !== 'cover'}
		<div class="bar">
			<div class="pageNumber">{pg}</div>
		</div>
	{/if}
</div>

<style>
	.content {
		box-sizing: border-box;
		flex-direction: column;
		margin: 0;
		display: flex;
		height: calc(100vh - 144px);
		justify-content: center;
	}
	.content :global(p) {
		padding: 16px;
		margin: 0 auto;
		white-space: pre-wrap;
		max-width: 420px;
	}
	.graphic {
		aspect-ratio: 1/1;
		object-fit: contain;
		padding: 0 16px;
		max-height: 66.666vh;
	}
	.pageNumber {
		color: #888;
		margin-right: 12px;
	}
	.bar {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 16px 0 32px;
	}
</style>
