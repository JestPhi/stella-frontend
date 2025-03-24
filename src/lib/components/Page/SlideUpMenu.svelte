<script lang="ts">
	import { onMount } from 'svelte';
	import { slideUpMenuState } from '../../../state.svelte';

	onMount(() => {
		if (!!slideUpMenuState.content) {
			document.getElementsByTagName('body')[0].classList.add('noScroll');
		}
	});

	let { children } = $props();
</script>

{#if slideUpMenuState.content}
	<div
		class="background"
		on:click={() => {
			slideUpMenuState.content = null;
		}}
	></div>
	<div class="menu">{@render children()}</div>
{/if}

<style>
	:global(.noScroll) {
		overflow: hidden;
	}

	@keyframes fadeIn {
		to {
			opacity: 0.5;
		}
	}

	.background {
		background: black;
		height: 100vh;
		left: 0;
		opacity: 0;
		top: 0;
		position: fixed;
		width: 100%;
		animation: fadeIn 0.25s forwards;
	}

	@keyframes slideIn {
		100% {
			transform: translateY(0%);
		}
	}

	.menu {
		background: white;
		box-sizing: border-box;
		border-radius: 12px;
		display: block;
		padding: 12px;
		position: fixed;
		bottom: 0;
		left: 0;
		height: 400px;
		margin: 12px;
		width: calc(100% - 24px);
		animation: slideIn 0.25s forwards;
		transform: translateY(100%);
	}
</style>
