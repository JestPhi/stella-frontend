<script lang="ts">
	const props = $props();
</script>

<textarea
	id="story"
	name="story"
	value={props.value}
	class={props.class}
	onkeyup={(event) => {
		props.onchange(event.target.value);
	}}
	placeholder={props.placeholder}
></textarea>

<style>
	textarea {
		border: 0;
		box-sizing: border-box;
		font-family: sans-serif;
		font-size: 16px;
		overflow: none;
		width: 100%;
		padding: 12px;
		outline: none;
		resize: none;
		line-height: 1.5em;
	}

	textarea::-webkit-scrollbar {
		display: none; /* Safari and Chrome */
	}
</style>
