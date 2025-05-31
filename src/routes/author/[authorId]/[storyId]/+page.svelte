<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/state';

	import Author from '$lib/components/Author.svelte';

	import Content from './components/Content/index.svelte';
	import PageActions from './components/PageActions/index.svelte';
	import InsertPage from './components/InsertPage/index.svelte';
	import storyState from './state/storyState.svelte';
	import EditPage from './components/EditPage/index.svelte';
	import { updateStory, findStory } from '$lib/DB';
	import storya from '../../../../scheme/story.json';
	import StoryActions from '$lib/components/StoryActions.svelte';

	let mountedWithStory = $state(false);

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

{#key [storyState?.story?.cover?.src]}
	<div class="page">
		<StoryActions>
			<EditPage page={storyState?.story?.cover} />
		</StoryActions>
		<Content pg={'cover'} page={storyState?.story?.cover} />
		{#if storyState?.story?.cover}
			{#key storyState?.story?.pages?.length}
				<InsertPage pg={0} story={storyState?.story} />
			{/key}
		{/if}
	</div>
{/key}

{#each storyState?.story?.pages as page, index (page.pageId)}
	<div class="page">
		<PageActions pg={index} pages={storyState?.story?.pages} />
		<Content pg={index} page={storyState?.story?.pages[index]} />
		<InsertPage pg={index + 1} story={storyState?.story} />
	</div>
{/each}
