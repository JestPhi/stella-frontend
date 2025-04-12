<script lang="ts">
	const props = $props();
	let text = $state(props.text);
</script>

<textarea id="story" name="story" rows="5" cols="33" bind:value={text}>{props.text}</textarea>
