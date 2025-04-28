<script lang="ts">
	import storyState from '../../state/storyState.svelte';
	import { isBlob } from '$lib/util';

	const blob = storyState?.story?.cover?.blob;
	const blobURL = isBlob(blob) && URL.createObjectURL(blob);
	const imageURL = blobURL || storyState?.story?.cover?.src;
</script>

<figure class="content">
	<img id="coverImage" src={imageURL} alt={storyState?.story?.cover?.caption} />
</figure>
<div class="title">{storyState?.story?.cover?.text}</div>

<style>
	#coverImage {
		max-height: 60vh;
		max-width: fit-content;
	}
	.content {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
	}

	.title {
		text-align: center;
		font-size: 24px;
		margin-top: 12px;
	}
</style>
