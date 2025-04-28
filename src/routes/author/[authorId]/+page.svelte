<script lang="ts">
	import feather from 'feather-icons';
	import Button from '$lib/components/Button.svelte';
	import Switch from '$lib/components/Switch.svelte';
	import Author from '$lib/components/Author.svelte';
	import Story from '$lib/components/Story.svelte';
	import ActionBar from '$lib/components/ActionBar.svelte';

	let authorState = $state({
		isReadOnly: false
	});
</script>

<Author />
<Story />
<Story />
<ActionBar>
	<div class="editMode ml12">
		Read Only<Switch
			on={authorState.isReadOnly}
			onclick={() => {
				authorState.isReadOnly = !authorState.isReadOnly;
			}}
		/>
	</div>
</ActionBar>

<style>
	.editMode {
		color: #888;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
