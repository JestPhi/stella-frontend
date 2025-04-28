<script lang="ts">
	import appState from '$lib/state/appState.svelte';
	import Action from '$lib/components/Action.svelte';
	import Button from '$lib/components/Button.svelte';
	import Divider from '$lib/components/Divider.svelte';
	import EditPageMenu from '../EditPage/Menu.svelte';

	const { story, pg } = $props();
	let isVisible = $state(false);
	let newPageState = $state({
		blob: null,
		src: null,
		text: null,
		pageId: Date.now()
	});
</script>

<div class="insert">
	<Divider />
	<Action
		{isVisible}
		label={`Insert Page @ ${pg + 1}`}
		menu={EditPageMenu}
		menuProps={{
			blob: newPageState?.blob,
			placeholder: 'Enter Text',
			src: newPageState?.src,
			onImageChange: (file: any, blob: any) => {
				newPageState.src = file?.name;
				newPageState.blob = blob;
			},
			onTextChange: (value: string) => {
				newPageState.text = value;
			}
		}}
		onClose={(isVisibleBool: boolean) => {
			const updatedPages = story.pages.toSpliced(pg, 0, newPageState);
			story.pages = updatedPages;
			isVisible = isVisibleBool;
		}}
	>
		<Button
			class="insertButton"
			onclick={() => {
				isVisible = !isVisible;
			}}>Insert Page</Button
		>
	</Action>
</div>

<style>
	.insert {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		margin-bottom: 12px;
		margin-top: 12px;
	}

	.insert :global(.insertButton) {
		font-family: sans-serif;
		border: none;
		margin-top: -21px;
		width: 100px;
		background: whitesmoke;
		padding: 4px;
		border-radius: 4px;
		letter-spacing: 1px;
	}
</style>
