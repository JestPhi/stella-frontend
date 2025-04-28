<script lang="ts">
	import TextArea from '$lib/components/TextArea.svelte';
	import InputImage from './InputImage.svelte';
	import Divider from '$lib/components/Divider.svelte';
	const props = $props();
</script>

<div class="form">
	<InputImage onchange={props.onImageChange} src={props.src} blob={props.blob} />
	<Divider />
	<TextArea
		placeholder={props.placeholder}
		type="text"
		class="textArea"
		onchange={props.onTextChange}
		label="Title"
		value={props.title}
	/>
</div>

<style>
	.form {
		display: flex;
		justify-content: center;
		width: 100%;
		flex-direction: column;
		align-items: center;
	}
	.form :global(.textArea) {
		padding: 12px;
		height: 40vh;
	}
</style>
