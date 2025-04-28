<script lang="ts">
	import InputText from '$lib/components/InputText.svelte';
	const props = $props();
</script>

<div class="form">
	<img src={props.src} alt={props.caption} class="photograph" />
	<InputText type="text" onchange={props.onCaptionChange} label="Caption" value={props.caption} />
	<InputText type="text" onchange={props.onTitleChange} label="Title" value={props.title} />
</div>

<style>
	.form {
		display: flex;
		justify-content: center;
		width: 100%;
		flex-direction: column;
		align-items: center;
	}
	.photograph {
		width: 100%;
	}
</style>
