<script lang="ts">
	import ActionBar from '$lib/components/ActionBar.svelte';
	import Navigation from '$lib/components/Navigation.svelte';

	let { children } = $props();
</script>

<Navigation />
<div class="content">
	{@render children()}
</div>
<ActionBar />

<style>
	.content {
		margin-bottom: 44px;
	}
</style>
