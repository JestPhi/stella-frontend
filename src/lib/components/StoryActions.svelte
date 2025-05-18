<script lang="ts">
	const { children } = $props();
</script>

<div class="pageActions">
	{@render children()}
</div>

<style>
	.pageActions {
		display: flex;
		height: 48px;
		justify-content: flex-end;
		padding: 0 16px;
	}
</style>
