<script lang="ts">
	import { page } from '$app/state';
	import feather from 'feather-icons';
	import { onMount } from 'svelte';
	import AuthorActions from '$lib/components/AuthorActions.svelte';
	import Page from './components/Page/index.svelte';
	import PageActions from './components/PageActions/index.svelte';
	import InsertPage from './components/InsertPage/index.svelte';
	import Author from '$lib/components/Author.svelte';
	import storyState from './state/storyState.svelte';
	import EditPage from './components/EditPage/index.svelte';
	import { updateStory, findStory } from '$lib/DB';
	import storya from '../../../../scheme/story.json';
	import Button from '$lib/components/Button.svelte';
	import Switch from '$lib/components/Switch.svelte';
	import StoryActions from '$lib/components/StoryActions.svelte';
	import Divider from '$lib/components/Divider.svelte';
	import DividerBold from '$lib/components/DividerBold.svelte';

	let mountedWithStory = $state(false);
	let isReadOnlyState = $state(false);

	onMount(async () => {
		try {
			const story = await findStory(page.params.authorId, page.params.storyId);
			storyState.story = story?.docs[0];

			mountedWithStory = true;
		} catch (error) {
			throw new Error('An error occured');
		}
	});

	$effect(() => {
		if (!mountedWithStory) {
			return;
		}

		updateStory($state.snapshot(storyState.story), 'test', page.params.storyId);
	});
</script>

<Author />
<DividerBold class="mt32" />
<div class="page">
	<StoryActions>
		{#if !isReadOnlyState}
			<EditPage page={storyState?.story?.cover} label="Cover Page" />
		{/if}
	</StoryActions>
	{#key [storyState?.story?.cover?.src]}
		<div class="coverPage">
			<Page pg={'cover'} page={storyState?.story?.cover} />
		</div>
	{/key}
</div>

{#each storyState?.story?.pages as page, index (page.pageId)}
	<div class="page">
		<InsertPage pg={index} story={storyState?.story} isReadOnly={isReadOnlyState} />
		<PageActions pg={index} pages={storyState?.story?.pages} isReadOnly={isReadOnlyState} />
		<Page pg={index} page={storyState?.story?.pages[index]} />
	</div>
{/each}

{#if storyState?.story?.cover && !isReadOnlyState}
	{#key storyState?.story?.pages?.length}
		<InsertPage pg={storyState?.story?.pages?.length} story={storyState?.story} />
	{/key}
{/if}

<AuthorActions>
	<div class="actions">
		<div class="left"></div>
		<div class="center">
			<Button class="outline">Publish Changes</Button>
		</div>
		<!-- <div class="editMode ml12">
		Read Only<Switch
			on={isReadOnlyState}
			onclick={() => {
				isReadOnlyState = !isReadOnlyState;
			}}
		/>
	</div> -->
		<div class="right">
			<Button class="minimal ml12"
				>{@html feather.icons['settings'].toSvg({
					stroke: '#888',
					width: 18,
					height: 18
				})}</Button
			>
		</div>
	</div>
</AuthorActions>

<style>
	.actions {
		display: flex;
		align-items: center;
		width: 100%;
	}
	.center {
		flex: 1;
	}
	.left {
		flex: 1;
	}
	.right {
		display: flex;
		flex: 1;
		align-items: flex-end;
		justify-content: flex-end;
	}
	.coverPage :global(p) {
		font-size: 24px;
	}
</style>
