<script lang="ts">
	import TextArea from '$lib/components/TextArea.svelte';
	import InputImage from '$lib/components/InputImage.svelte';
	import Divider from '$lib/components/Divider.svelte';
	import Button from '$lib/components/Button.svelte';
	const props = $props();
</script>

<div class="form">
	<span class="label">Create New Story</span>
	<InputImage onchange={props.onImageChange} src={props.src} blob={props.blob} />
	<Divider />
	<TextArea
		placeholder={props.placeholder}
		type="text"
		class="textArea"
		onkeypress={props.onkeypress}
		onchange={props.onTextChange}
		label="Title"
		value={props.text}
	/>
</div>

<style>
	.label {
		align-items: center;
		display: flex;
		height: 44px;
	}
	.form {
		display: flex;
		justify-content: center;
		width: 100%;
		flex-direction: column;
		align-items: center;
	}
	.form :global(.textArea) {
		box-sizing: border-box;
		padding: 12px;
		height: calc(40vh - 66px);
	}
	.form :global(.inputImage) {
		height: calc(60vh - 66px);
	}
</style>
