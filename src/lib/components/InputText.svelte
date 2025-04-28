<script lang="ts">
	const props = $props();
	let value = $state(props.value);
</script>

<div class={['inputText', props.class].join(' ')}>
	<label for="cheese" class="mb6">{props.label}</label>
	<input
		type="text"
		bind:value
		onchange={(event) => {
			props.onchange(event?.target?.value);
		}}
	/>
</div>

<style>
	label {
		font-size: 14px;
		color: #888;
	}
	.inputText {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		padding: 6px;
		width: 100%;
	}

	.inputText:global(.minimal) input {
		border: none;
	}

	input {
		font-size: 16px;
		outline: none;
	}
</style>
