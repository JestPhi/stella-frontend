<script lang="ts">
	import { onMount } from 'svelte';
	import feather from 'feather-icons';
	import Button from './Button.svelte';

	const props = $props();

	onMount(() => {
		if (props.isVisible) {
			document.getElementsByTagName('body')[0].classList.add('noScroll');
		}
	});
</script>

{@render props.children()}

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
		<div class="actions">
			<span>{props.label}</span>
		</div>
		<props.menu {...props.menuProps} />
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
		z-index: 1;
	}

	@keyframes slideIn {
		100% {
			transform: translateY(44px);
		}
	}

	.menu {
		background: white;
		box-sizing: border-box;
		border-radius: 12px;
		display: block;
		align-items: flex-end;
		position: fixed;
		bottom: 0;
		left: 0;
		height: 100vh;
		width: 100%;
		animation: slideIn 0.25s forwards;
		transform: translateY(100%);
		z-index: 1;
	}
	.menu :global(.close) {
		position: absolute;
		right: 0;
		margin-right: 6px;
	}
	.actions {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 12px;
	}
</style>
