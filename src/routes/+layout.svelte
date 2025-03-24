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
	:global(html) {
		scrollbar-width: none;
	}
	:global(body) {
		overflow-x: hidden;
		margin: 0;
		
	}
	.content {
		margin-bottom: 44px;
		padding: 12px
	}
</style>
