<script lang="ts">
	import { isBlob } from '$lib/util';
	import feather from 'feather-icons';
	import Button from '$lib/components/Button.svelte';

	const props = $props();
	const blobURL = isBlob(props.blob) && URL.createObjectURL(props.blob);
	const imageURL = blobURL || props.src;
	let imageFileState = $state(imageURL);

	const getImage = (image: any) => {
		if (typeof image === 'object') {
			const blob = new Blob([image], { type: 'image/png' });
			return URL.createObjectURL(blob);
		}
		return image;
	};
</script>

<div class="inputImage">
	{#if imageFileState}
		<img id="image" src={getImage(imageFileState)} alt="" />
		<Button
			class="removeImage"
			variant="outline"
			onclick={() => {
				const imageAreaEl = document.getElementById('image');
				imageFileState = null;
				props.onchange(null, null);
			}}
		>
			Remove Image
		</Button>
	{/if}
	{#if !imageFileState}
		<Button
			id="addImage"
			variant="outline"
			onclick={() => document?.getElementById('input').click()}
		>
			Add Image
		</Button>
	{/if}

	<input
		id="input"
		type="file"
		accept="image/*;capture=camera"
		onchange={(event) => {
			const imageAreaEl = document.getElementById('image');
			const file = event.target.files[0];
			const blob = new Blob([file], { type: 'image/png' });
			imageFileState = file;
			props.onchange(file, blob);
		}}
	/>
</div>

<style>
	input {
		display: none;
	}
	.inputImage :global(#addImage) {
		height: 100%;
		align-items: center;
		justify-self: center;
		width: 100%;
	}
	.addImage {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	#image {
		aspect-ratio: 1/1;
		height: 33.333vh;
		object-fit: contain;
		display: flex;
		align-items: center;
		justify-self: center;
	}
	.inputImage {
		align-items: center;
		display: flex;
		height: 33.333vh;
		justify-content: center;
		padding: 0 16px;
		position: relative;
		width: 100%;
	}

	.inputImage :global(.removeImage) {
		position: absolute;
		bottom: 0;
	}
	.inputImage :global(.removeImage span) {
		background: white;
		padding: 4px 16px;
		border-radius: 8px;
	}
	.removeImage {
		position: absolute;
		bottom: 0;
	}
</style>
