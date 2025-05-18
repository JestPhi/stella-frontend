<script>
	const props = $props();
</script>

<button {...props}>{@render props.children()}</button>

<style>
	button {
		align-items: center;
		cursor: pointer;
		display: flex;
		justify-content: center;
		min-width: 48px;
	}
	.minimal {
		background: none;
		border: none;
		padding: 0;
		height: 48px;
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
