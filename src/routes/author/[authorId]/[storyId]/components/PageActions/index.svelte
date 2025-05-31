<script lang="ts">
	import feather from 'feather-icons';
	import Button from '$lib/components/Button.svelte';
	import { removeItem } from '$lib/util';
	import EditPage from '../EditPage/index.svelte';
	import StoryActions from '$lib/components/StoryActions.svelte';

	const { pg, pages } = $props();
</script>

<!-- TODO: there only needs tobe on toolbar -->
<StoryActions>
	{#if pg !== 'cover'}
		<Button
			variant="fill"
			onclick={() => {
				removeItem(pages, pg);
			}}
		>
			{@html feather.icons['trash-2'].toSvg({
				stroke: '#888',
				width: 18,
				height: 18
			})}
		</Button>
	{/if}
	<EditPage page={pages[pg]} />
</StoryActions>
