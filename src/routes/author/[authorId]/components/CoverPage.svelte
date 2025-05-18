<script lang="ts">
	import { page } from '$app/state';
	import { isBlob } from '$lib/util';

	const { story } = $props();

	const blob = story?.cover?.blob;
	const blobURL = isBlob(blob) && URL.createObjectURL(blob);
	const imageURL = blobURL || story?.cover?.src;
</script>

<a href={`${page.url.pathname}/${story._id}`} class="story">
	<div class="graphic">
		<img src={imageURL} alt="Elephant" />
	</div>
	<div class="title">
		{story.cover.text}
		<div class="meta">March 3rd 2025 - 54 pages</div>
	</div>
</a>

<style>
	.story {
		align-items: center;
		box-sizing: border-box;
		color: #222;
		display: flex;
		flex-direction: column;
		padding: 0 16px;
		width: 100%;
	}
	.graphic {
		align-items: center;
		display: flex;
		justify-content: center;
		width: 100%;
	}
	.graphic img {
		width: 100%;
	}

	.title {
		box-sizing: border-box;
		font-size: 16px;
		font-weight: 600;
		padding: 12px;
		width: 100%;
	}
	.meta {
		color: #666;
		font-size: 12px;
		margin-top: 12px;
	}
</style>
