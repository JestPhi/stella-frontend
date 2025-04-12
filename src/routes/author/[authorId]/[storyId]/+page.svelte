<script lang="ts">
	import { onMount } from 'svelte';
	import CoverPage from '$lib/components/CoverPage.svelte';
	import Page from './components/index.svelte';
	import Author from '$lib/components/Author.svelte';
	import storyState from './state/storyState.svelte';

	let loading = true;

	onMount(async () => {
		try {
			const response = await fetch('http://localhost:3000/story/test');
			const data = await response.json();
			storyState.story = data;
			loading = false;
		} catch (error) {
			throw new Error('An error occured');
		}
	});
</script>

<Author />
<CoverPage />

{#each storyState.story.pages as page, index (page.pageId)}
	{#key index}
		<Page {...{ ...page, pg: index }} />
	{/key}
{/each}
