<script lang="ts">
	const props = $props();
</script>

<button
	onclick={props.onclick}
	class={`switchButton ${props.on === true ? 'on' : 'off'}`}
	aria-label={`${props.label} ${props.on === true ? 'on' : 'off'}`}><div class="switch" /></button
>

<style>
	.switchButton {
		background: #888;
		border-radius: 9px;
		border: none;
		cursor: pointer;
		height: 18px;
		margin-left: 6px;
		padding: 0;
		width: 30px;
	}
	.switchButton.on {
		background: black;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}
	.switch {
		background: white;
		border-radius: 50%;
		height: 12px;
		width: 12px;
		margin: 0 2px;
	}
</style>
