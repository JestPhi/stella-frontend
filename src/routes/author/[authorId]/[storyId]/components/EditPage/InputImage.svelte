<script lang="ts">
	import { isBlob } from '$lib/util';
	import feather from 'feather-icons';
	import Button from '$lib/components/Button.svelte';

	const props = $props();
	const blobURL = isBlob(props.blob) && URL.createObjectURL(props.blob);
	const imageURL = blobURL || props.src;
	let imageFileState = $state(imageURL);

	console.log(props.src);
</script>

<div class="inputImage">
	<img id="image" src={imageURL} alt="" />

	{#if !imageFileState}<button onclick={() => document?.getElementById('input').click()}>
			{@html feather.icons['image'].toSvg({ stroke: '#888' })}
			<div class="mt6">
				{@html feather.icons['plus-circle'].toSvg({ stroke: '#888' })}
			</div>
		</button>
	{/if}

	<input
		id="input"
		type="file"
		accept="image/*;capture=camera"
		onchange={(event) => {
			const imageAreaEl = document.getElementById('image');
			const file = event.target.files[0];
			const blob = new Blob([file], { type: 'image/png' });
			imageAreaEl.src = URL.createObjectURL(blob);
			imageFileState = file;
			props.onchange(file, blob);
		}}
	/>

	{#if !!imageFileState}
		<div class="actions">
			<Button
				class="minimal mt6"
				onclick={() => {
					const imageAreaEl = document.getElementById('image');
					imageAreaEl.src = null;
					imageFileState = null;
					props.onchange(null, null);
				}}
			>
				{@html feather.icons['minus-circle'].toSvg({
					stroke: '#888'
				})}
				<span class="ml6">Remove Image</span>
			</Button>
		</div>
	{/if}
</div>

<style>
	.inputImage {
		height: 60vh;
	}
	input {
		display: none;
	}
	img {
		height: 100%;
	}
	.actions {
		color: white;
		display: flex;
		align-items: center;
		font-size: 12px;
		justify-content: flex-end;
		padding: 0 12px;
		margin-top: -36px;
	}
</style>
