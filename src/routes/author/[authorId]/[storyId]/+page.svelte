<script lang="ts">
	import CoverPage from '$lib/components/CoverPage.svelte';
	import Page from '$lib/components/Page/index.svelte';
	import Author from '$lib/components/Author.svelte';
	import InsertPage from '$lib/components/InsertPage.svelte';
	import story from '../../../../scheme/story.json';
	const { order, pages } = $state(story);
	console.log(order);
</script>

<Author />
<CoverPage />
{#each order as page, index}
	<InsertPage />
	<Page {...{ ...pages?.[page], pg: index }} />
{/each}
