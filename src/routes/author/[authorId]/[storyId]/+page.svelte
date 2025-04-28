<script lang="ts">
	import feather from 'feather-icons';
	import { onMount } from 'svelte';
	import ActionBar from '$lib/components/ActionBar.svelte';
	import Page from './components/Page/index.svelte';
	import PageActions from './components/PageActions/index.svelte';
	import InsertPage from './components/InsertPage/index.svelte';
	import Author from '$lib/components/Author.svelte';
	import storyState from './state/storyState.svelte';
	import EditPage from './components/EditPage/index.svelte';
	import { createUpdateStory, fetchStory } from '$lib/DB';
	import storya from '../../../../scheme/story.json';
	import Button from '$lib/components/Button.svelte';
	import Switch from '$lib/components/Switch.svelte';

	let mountedWithStory = $state(false);
	let isReadOnlyState = $state(false);

	onMount(async () => {
		try {
			// await createUpdateStory(storya, 'test', 'mittens');
			const story = await fetchStory('test', 'mittens');
			storyState.story = story;
			mountedWithStory = true;
		} catch (error) {
			throw new Error('An error occured');
		}
	});

	$effect(() => {
		if (!mountedWithStory) {
			return;
		}
		createUpdateStory($state.snapshot(storyState.story), 'test', 'mittens');
	});
</script>

<Author />

<div class="page">
	<EditPage page={storyState?.story?.cover} label="Cover Page" />
	{#key [storyState?.story?.cover?.src]}
		<Page pg={'cover'} page={storyState?.story?.cover} />
	{/key}
</div>

{#each storyState?.story?.pages as page, index (page.pageId)}
	<div class="page">
		{#key [...Object.values(page), index]}
			{#if !isReadOnlyState}
				<InsertPage pg={index} story={storyState?.story} />
				<PageActions pg={index} pages={storyState?.story?.pages} />
			{/if}
			<Page pg={index} page={storyState?.story?.pages[index]} />
		{/key}
	</div>
{/each}

{#if storyState?.story?.cover && !isReadOnlyState}
	{#key storyState?.story?.pages?.length}
		<InsertPage pg={storyState?.story?.pages?.length} story={storyState?.story} />
	{/key}
{/if}

<ActionBar>
	<Button class="outline">Publish Changes</Button>
	<div class="editMode ml12">
		Read Only<Switch
			on={isReadOnlyState}
			onclick={() => {
				isReadOnlyState = !isReadOnlyState;
			}}
		/>
	</div>
	<Button class="minimal ml12"
		>{@html feather.icons['settings'].toSvg({
			stroke: '#888',
			width: 18,
			height: 18
		})}</Button
	>
</ActionBar>
