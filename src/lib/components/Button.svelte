<script>
	const props = $props();
</script>

<button {...props}>{@render props.children()}</button>

<style>
	button {
		cursor: pointer;
	}
	.minimal {
		background: none;
		border: none;
		padding: 0;
	}
	.outline {
		background: none;
		border: solid 1px;
		border-radius: 4px;
		padding: 6px 12px;
	}
	.primary {
		color: red;
	}
	.secondary {
		color: blue;
	}
</style>
