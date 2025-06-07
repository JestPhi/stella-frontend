<script lang="ts">
	import feather from 'feather-icons';
	import Button from '$lib/components/Button.svelte';
</script>

<Button variant="fill" onclick={() => {}}>
	{@html feather.icons['plus'].toSvg({
		height: 24,
		width: 24,
		stroke: '#888',
		viewBox: '0 0 24 24'
	})}
</Button>
