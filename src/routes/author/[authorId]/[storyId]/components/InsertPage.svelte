<script lang="ts">
	import appState from '$lib/state/appState.svelte';
</script>

{#if appState.isEditMode}
	<div class="insert">
		<hr class="divider" />
		<button class="insertButton">Insert Page</button>
	</div>
{/if}

<style>
	.divider {
		width: 100%;
		height: 1px;
	}
	.insert {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		margin-bottom: 12px;
		margin-top: 12px;
	}
	.insertButton {
		background: white;
		border: none;
		margin-top: -21px;
		width: 100px;
	}
</style>
