<script lang="ts">
	import Button from './Button.svelte';
	import appState from '../state/appState.svelte';
</script>

<div class="actionBar">
	<Button
		onclick={() => {
			appState.isEditMode = !appState.isEditMode;
		}}>{appState.isEditMode ? 'Finish Edits' : 'Edit Story'}</Button
	>
	<div class="avatar"></div>
</div>

<style>
	.actionBar {
		background: white;
		bottom: 0;
		right: 0;
		position: fixed;
		align-items: center;
		display: flex;
		justify-content: flex-end;
		height: 44px;
		width: 100%;
	}
	.avatar {
		background: black;
		border-radius: 50%;
		height: 24px;
		width: 24px;
		margin-left: 12px;
		margin-right: 12px;
	}
</style>
