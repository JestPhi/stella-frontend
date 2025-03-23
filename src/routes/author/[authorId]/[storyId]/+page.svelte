<script lang="ts">
	import CoverPage from '$lib/components/CoverPage.svelte';
	import Page from '$lib/components/Page.svelte';
	import Author from '$lib/components/Author.svelte';

	export let data;
	console.log(data);
</script>

<Author />
<CoverPage />
<Page />
