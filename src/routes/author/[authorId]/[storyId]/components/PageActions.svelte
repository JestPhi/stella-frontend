<script lang="ts">
	import storyState from '../state/storyState.svelte';
	import appState from '../../../../../lib/state/appState.svelte';
	import Action from '$lib/components/Action/Action.svelte';
	import Button from '$lib/components/Button.svelte';
	import Menu from './Menu.svelte';
	import { moveItemUp, moveItemDown } from './helpers';

	let isVisible = $state(false);

	const props = $props();
	const { pg } = $state.snapshot(props);

	console.log(pg, storyState.story.pages.length);
</script>

{#if appState.isEditMode}
	<div class="bar">
		<Button
			disabled={pg === 0}
			onclick={() => {
				moveItemUp(storyState.story.pages, pg);
			}}>Up</Button
		>
		<Button
			disabled={pg === storyState.story.pages.length - 1}
			onclick={() => {
				moveItemDown(storyState.story.pages, pg);
			}}>Down</Button
		>
		<Action
			menu={Menu}
			{isVisible}
			onClose={(isVisibleBool: boolean) => {
				isVisible = isVisibleBool;
			}}
		>
			<button
				aria-label="new Page"
				onclick={() => {
					isVisible = !isVisible;
				}}
			>
				meow
			</button>
		</Action>
	</div>
{/if}
