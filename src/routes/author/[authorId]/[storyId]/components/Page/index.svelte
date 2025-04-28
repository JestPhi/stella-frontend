<script lang="ts">
	import { isBlob } from '$lib/util';

	const { pg, page } = $props();
	const blob = page?.blob;
	const blobURL = isBlob(blob) && URL.createObjectURL(blob);
	const imageURL = blobURL || page?.src;
</script>

<figure class="content">
	<img id={`page-${pg}`} class="graphic" src={imageURL} alt={'caption'} />
</figure>
<p>{page?.text}</p>

{#if pg !== 'cover'}
	<div class="bar">
		<div class="pageNumber">{pg}</div>
	</div>
{/if}

<style>
	p {
		padding: 0 12px;
		text-indent: 24px;
	}
	.content {
		margin: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.graphic {
		height: 60vh;
		width: fit-content;
	}
	.pageNumber {
		color: #888;
		text-align: center;
		margin-right: 12px;
	}
	.bar {
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}
</style>
