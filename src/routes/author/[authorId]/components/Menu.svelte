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
		placeholder={'Add a title...'}
		type="text"
		class="textArea"
		onkeypress={props.onkeypress}
		onchange={props.onTextChange}
		label="Title"
		value={props.text}
		rows={6}
		wrap="hard"
		maxlength={280}
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
		padding: 16px;
		max-width: 420px;
	}
</style>
