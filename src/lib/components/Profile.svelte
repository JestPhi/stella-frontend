<script lang="ts">
	import { menuState } from '$lib/state/menuState.svelte';

	const props = $props();
</script>

{#snippet profile()}
	<p>test</p>
{/snippet}

<button
	class="profile"
	onclick={() => {
		menuState.template = 'profile';
		console.log('fire');
	}}
>
	P
</button>

<style>
	.profile {
		align-items: center;
		display: flex;
		height: 48px;
		justify-content: center;
		width: 48px;
	}
</style>
