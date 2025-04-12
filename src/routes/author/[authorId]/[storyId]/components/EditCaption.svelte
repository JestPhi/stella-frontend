<script lang="ts">
	import TextArea from '$lib/components/TextArea.svelte';
	import storyState from '../state/storyState.svelte';

	const props = $props();
</script>

<TextArea {...props} />
