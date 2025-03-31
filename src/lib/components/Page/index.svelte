<script lang="ts">
	import Action from '../Action/Action.svelte';
	import Menu from './Menu.svelte';
	import Trigger from './Trigger.svelte';
	import Button from '../Button.svelte';

	let isVisible = $state(false);

	const props = $props();

	const {
		caption,
		text,
		EXIF: { F, SS, ISO },
		src,
		pg
	} = $state.snapshot(props);
</script>

<div class="page">
	<div class="bar">
		<Button>Up</Button>
		<Button>Down</Button>
		<Action
			trigger={Trigger}
			menu={Menu}
			{isVisible}
			onclick={(isVisibleBool: boolean) => {
				isVisible = isVisibleBool;
			}}
		/>
	</div>
	<figure class="content">
		<img class="graphic" {src} alt={caption} />
		<span class="meta">{F}f/2.8 1/{SS} ISO{ISO}</span>
		<figcaption>
			{caption}
		</figcaption>
	</figure>
	<p>{text}</p>
	<div class="bar">
		<div class="pageNumber">pg {pg}</div>
	</div>
</div>

<style>
	.content {
		margin: 0;
	}
	.meta {
		display: flex;
		font-size: 12px;
		margin-bottom: 12px;
		color: #999;
		align-items: center;
		justify-content: center;
		width: 100%;
	}
	.graphic {
		margin-bottom: 4px;
		margin-top: 12px;
		width: 100%;
	}
	.pageNumber {
		text-align: center;
		margin-right: 12px;
	}
	.bar {
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}
</style>
