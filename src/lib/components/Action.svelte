<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '$lib/components/Button.svelte';
	import feather from 'feather-icons';
	const props = $props();

	onMount(() => {
		if (props.isVisible) {
			document.getElementsByTagName('body')[0].classList.add('noScroll');
		}
	});
</script>

{#if props.isVisible}
	<div
		role="presentation"
		class="background"
		onclick={() => {
			props.onClose(!props.isVisible);
			document.getElementsByTagName('body')[0].classList.remove('noScroll');
		}}
	></div>
	<div class="menu">
		<div class="close">
			<Button
				variant="minimal"
				onclick={() => {
					props.onClose(!props.isVisible);
				}}
			>
				{@html feather.icons['x'].toSvg({
					stroke: '#888',
					width: 18,
					height: 18
				})}
			</Button>
		</div>
		{@render props.children()}
	</div>
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
		z-index: 3;
	}

	.close {
		display: flex;
		flex-direction: flex-end;
		justify-content: flex-end;
	}

	@keyframes slideIn {
		100% {
			transform: translateY(0px);
		}
	}

	.menu {
		background: white;
		box-sizing: border-box;
		display: block;
		align-items: flex-end;
		position: fixed;
		bottom: 0;
		left: 0;
		height: calc(100vh - 48px);
		width: 100%;
		animation: slideIn 0.25s forwards;
		transform: translateY(100%);
		z-index: 3;
	}
</style>
