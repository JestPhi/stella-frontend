<script>
	import SlideUpMenu from './SlideUpMenu.svelte';
	import { slideUpMenuState } from '../../../state.svelte';
</script>

<div class="action">
	<button
		on:click={() => {
			slideUpMenuState.content = 'content';
		}}>...</button
	>

	<SlideUpMenu></SlideUpMenu>
</div>

<style>
	.action {
		display: flex;
		flex-direction: column;
	}
</style>
