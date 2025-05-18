<script lang="ts">
	const { children } = $props();
</script>

<div class="actionBar">
	{@render children()}
</div>

<style>
	.actionBar {
		background: white;
		bottom: 0;
		box-sizing: border-box;
		font-size: 14px;
		padding: 0 16px;
		position: fixed;
		align-items: center;
		display: flex;
		justify-content: flex-end;
		height: 56px;
		width: 100%;
	}
</style>
