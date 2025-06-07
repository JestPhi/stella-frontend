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
		position: fixed;
		align-items: center;
		display: flex;
		justify-content: space-between;
		height: 48px;
		width: 100%;
		z-index: 2;
	}
</style>
