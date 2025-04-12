<script lang="ts">
	import Action from '$lib/components/Action/Action.svelte';
	import appState from '../../../../../lib/state/appState.svelte';
	import EditCaption from './EditCaption.svelte';

	let isVisible = $state(false);

	const { children } = $props();
</script>

<!-- svelte-ignore a11y_figcaption_parent -->
<figcaption>
	{#if appState.isEditMode}
		<Action
			menu={EditCaption}
			{isVisible}
			onClose={(isVisibleBool: boolean) => {
				isVisible = isVisibleBool;
			}}
		>
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				onclick={() => {
					isVisible = !isVisible;
				}}
			>
				{@render children()}
			</div>
		</Action>
	{:else}
		{@render children()}
	{/if}
</figcaption>
