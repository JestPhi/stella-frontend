<script lang="ts">
	import Action from '../Action/Action.svelte';
	import Trigger from './Trigger.svelte';
	import Menu from './Menu.svelte';
	import Button from '../Button.svelte';
	import pageState from '../../../routes/author/[authorId]/[storyId]/state.svelte';
</script>

<div class="actionBar">
	<!-- <Action
		trigger={Trigger}
		menu={Menu}
		{isVisible}
		onclick={(isVisibleBool: boolean) => {
			isVisible = isVisibleBool;
		}}
	/> -->
	<Button
		onclick={() => {
			pageState.isEditMode = !pageState.isEditMode;
		}}>{pageState.isEditMode ? 'Finish Edits' : 'Edit Story'}</Button
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
