<script lang="ts">
	import ActionBar from '$lib/components/ActionBar.svelte';
	import Navigation from '$lib/components/Navigation.svelte';
	let { children } = $props();
</script>

<Navigation />

{@render children()}
<ActionBar />
