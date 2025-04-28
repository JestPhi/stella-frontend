<script lang="ts">
	import Action from '$lib/components/Action.svelte';
	import appState from '../../state/appState.svelte';
	import EditText from './Edit.svelte';

	let isVisible = $state(false);
	const { text, onchange, children } = $props();
</script>

<!-- svelte-ignore a11y_figcaption_parent -->

{#if appState.isEditMode}
	<Action
		menu={EditText}
		menuProps={{
			text: text,
			onchange: (event: any) => {
				onchange(event.target.value);
			}
		}}
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
