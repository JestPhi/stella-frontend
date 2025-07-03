<script lang="ts">
	import appState from '$lib/state/appState.svelte';
	import Action from '$lib/components/Action.svelte';
	import Button from '$lib/components/Button.svelte';
	import Divider from '$lib/components/Divider.svelte';
	import EditPageMenu from '../EditPage/Menu.svelte';
	import feather from 'feather-icons';

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
	<Action
		{isVisible}
		label={`Insert Page @ ${pg + 1}`}
		onClose={(isVisibleBool: boolean) => {
			const updatedPages = Array.isArray(story?.pages)
				? story?.pages?.toSpliced(pg, 0, newPageState)
				: [newPageState];
			story.pages = updatedPages;
			isVisible = isVisibleBool;
		}}
	>
		<EditPageMenu
			blob={newPageState?.blob}
			placeholder="Enter Text..."
			src={newPageState?.src}
			onImageChange={(file: any, blob: any) => {
				newPageState.src = file?.name;
				newPageState.blob = blob;
			}}
			onTextChange={(value: string) => {
				newPageState.text = value;
			}}
		/>
	</Action>

	<Button
		class="insertPageButton"
		variant="standard"
		onclick={() => {
			isVisible = !isVisible;
		}}
		>Insert Page {@html feather.icons['plus'].toSvg({
			stroke: '#888',
			height: '16px',
			width: '16px'
		})}
	</Button>
</div>

<style>
	.insert {
		display: flex;
		flex-direction: column;
		align-items: center;
		height: 44px;
		width: 100%;
		position: relative;
	}

	.insert :global(.divider) {
		position: absolute;
		bottom: 0;
	}

	.insert :global(.insertPageButton) {
		background: whitesmoke;
		border-radius: 4px 4px 0px 0px;
		color: #888;
		display: flex;
		padding: 4px 8px;
		margin-top: 20px;
	}
</style>
