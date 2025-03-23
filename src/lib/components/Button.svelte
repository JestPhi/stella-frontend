<script>
	let buttonProps = {
		class: [$$restProps.class]
	};
</script>

<button {...buttonProps}> <slot /> </button>

<style>
	.primary {
		color: red;
	}
	.secondary {
		color: blue;
	}
</style>
