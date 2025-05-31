<script lang="ts">
	import { page } from '$app/state';
	import { isBlob } from '$lib/util';

	const { story } = $props();

	const blob = story?.cover?.blob;
	const blobURL = isBlob(blob) && URL.createObjectURL(blob);
	const imageURL = blobURL || story?.cover?.src;
</script>

<div class="story">
	<a href={`${page.url.pathname}/${story._id}`}>
		<img class="graphic" src={imageURL} alt="Elephant" />
		<div class="title">
			{story.cover.text}
			<div class="meta">March 3rd 2025 - 54 pages</div>
		</div>
	</a>
</div>

<style>
	.story {
		align-items: center;
		box-sizing: border-box;
		color: #222;
		height: 100vh;
		padding: 96px 0 0;
		width: 100%;
	}
	.story a {
		display: flex;
		flex-direction: column;
		width: 100%;
	}
	.graphic {
		aspect-ratio: 1/1;
		align-items: center;
		display: flex;
		height: 60vh;
		justify-content: center;
		object-fit: contain;
		padding: 0 16px;
	}

	.title {
		box-sizing: border-box;
		font-size: 16px;
		font-weight: 600;
		padding: 12px;
		width: 100%;
		text-align: center;
	}
	.meta {
		color: #666;
		font-size: 12px;
		margin-top: 12px;
	}
</style>
