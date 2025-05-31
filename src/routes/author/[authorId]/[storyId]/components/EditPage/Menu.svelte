<script lang="ts">
	import TextArea from '$lib/components/TextArea.svelte';
	import InputImage from '$lib/components/InputImage.svelte';
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
		rows={12}
		wrap="hard"
		maxlength="280"
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
		box-sizing: border-box;
		padding: 0 16px;
		margin: 16px 0 0 0;
		width: 420px;
	}
</style>
