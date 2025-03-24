<script>
	import SlideUpMenu from './SlideUpMenu.svelte';
	import { isSlideUpVisible } from './state.svelte'

	
</script>

<div class="action">
	<button
		onclick={() => {
			isSlideUpVisible.value = true;
		}}>...</button
	>
	{#if isSlideUpVisible.value}
		<SlideUpMenu>
			Insert Page Above
			Insert Page Below
			Move Page Above
			Move Page Below
			Move to Top
			Move to Bottom
		</SlideUpMenu>
	{/if}
</div>

<style>
	.action {
		display: flex;
		flex-direction: column;
	}
</style>
