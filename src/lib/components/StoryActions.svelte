<script lang="ts">
	const { children } = $props();
</script>

<div class="storyActions">
	{@render children()}
</div>

<style>
	.storyActions {
		display: flex;
		height: 44px;
		justify-content: flex-end;
		width: 100%;
	}
</style>
