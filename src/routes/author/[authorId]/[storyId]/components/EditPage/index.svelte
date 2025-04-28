<script lang="ts">
	import feather from 'feather-icons';
	import Action from '$lib/components/Action.svelte';
	import Button from '$lib/components/Button.svelte';
	import Menu from './menu.svelte';

	const { page } = $props();
	let isVisible = $state(false);
</script>

<div class="action">
	<Action
		{isVisible}
		label={page?.label}
		menu={Menu}
		menuProps={{
			blob: page?.blob,
			src: page?.src,
			title: page?.text,
			onImageChange: (file: any, blob: any) => {
				page.src = file?.name;
				page.blob = blob;
			},
			onTextChange: (value: string) => {
				page.text = value;
			}
		}}
		onClose={(isVisibleBool: boolean) => {
			isVisible = isVisibleBool;
		}}
	>
		<Button
			class="minimal"
			onclick={() => {
				isVisible = !isVisible;
			}}
			>{@html feather.icons['edit-2'].toSvg({
				stroke: '#888',
				width: 18,
				height: 18
			})}</Button
		>
	</Action>
</div>

<style>
	.action {
		display: flex;
		justify-content: flex-end;
		padding: 12px;
	}
</style>
