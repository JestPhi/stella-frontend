<script>
	import Action from './Action.svelte';
</script>

<div class="page">
	<figure>
		<img
			class="graphic"
			src="https://a32d5790-fb8c-4145-a825-c1fa2a2e4eb2.mdnplay.dev/shared-assets/images/examples/elephant.jpg"
			alt="Elephant"
		/>
		<figcaption>
			Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
			labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
			laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
			voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
			non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
		</figcaption>
	</figure>
	<div class="pageFooter">
		<div class="pageNumber">1</div>
		<Action />
	</div>
</div>

<style>
	.graphic {
		width: 100%;
	}
	.pageNumber {
		text-align: center;
	}
	.pageFooter {
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}
</style>
