<script>
	const props = $props();
</script>

<button {...props}> {@render props.children()}</button>

<style>
	.primary {
		color: red;
	}
	.secondary {
		color: blue;
	}
</style>
