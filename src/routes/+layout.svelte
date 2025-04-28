<script lang="ts">
	import '$lib/styles.css';

	import Navigation from '$lib/components/Navigation.svelte';

	let { children } = $props();
</script>

<Navigation />
{@render children()}
