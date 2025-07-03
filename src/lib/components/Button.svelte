<script>
	const props = $props();
</script>

<button onclick={props.onclick} class={props.class}
	><div class={['inner', props.variant ? props.variant : 'default'].join(' ')}>
		{@render props.children()}
	</div></button
>

<style>
	button {
		align-items: center;
		background: none;
		border: none;
		box-sizing: border-box;
		cursor: pointer;
		display: flex;
		height: 44px;
		justify-content: center;
		min-width: 44px;
		padding: 0;
	}
	.inner {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.minimal {
		background: none;
		border: none;
		padding: 0;
		height: 44px;
	}
	.default {
		background: white;
		border-radius: 4px;
		padding: 6px 12px;
	}
	.outline {
		background: white;
		border: solid 1px;
		border-radius: 4px;
		padding: 6px 12px;
	}
	.fill {
		background: white;
		border: solid 1px white;
		height: 44px;
		width: 44px;
	}
</style>
