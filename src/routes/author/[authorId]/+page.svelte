<script lang="ts">
	import feather from 'feather-icons';
	import Button from '$lib/components/Button.svelte';
	import Switch from '$lib/components/Switch.svelte';
	import Author from '$lib/components/Author.svelte';
	import CoverPage from './components/CoverPage.svelte';
	import AuthorActions from '$lib/components/AuthorActions.svelte';

	import AuthorData from '../../../scheme/author.json';
	import { onMount } from 'svelte';
	import storiesState from './state.svelte';
	import Action from '$lib/components/Action.svelte';
	import Menu from './components/Menu.svelte';
	import { updateStories, fetchAuthor, createStory, findStories } from '$lib/DB';
	import { v4 as uuidv4 } from 'uuid';
	import { get } from 'svelte/store';

	let storiesData = $state(AuthorData.stories);
	let mountedWithAuthor = $state(false);
	let isVisible = $state(false);
	let coverPage = $state({ blob: '', src: '', text: '' });

	onMount(async () => {
		try {
			const stories = await findStories('test');
			storiesState.stories = stories?.docs;
			mountedWithAuthor = true;
		} catch (error) {
			throw new Error();
		}
	});

	$effect(() => {
		if (!mountedWithAuthor) {
			return;
		}
		updateStories('test', $state.snapshot(storiesState.stories));
	});

	const getDisabled = (coverPage: any) => {
		if (coverPage.text && coverPage.src) {
			return false;
		}
		if (coverPage.text && coverPage.blob) {
			return false;
		}

		return true;
	};
</script>

<Author />

{#each storiesState?.stories as story, index}
	{#key storiesState?.stories[index]}
		<CoverPage {index} story={storiesState?.stories[index]} stories={storiesState?.stories} />
	{/key}
{/each}

<AuthorActions>
	<Action
		{isVisible}
		label={'Create New Story'}
		onClose={(isVisibleBool: boolean) => {
			isVisible = isVisibleBool;
		}}
	>
		<Menu
			blob={coverPage?.blob}
			src={coverPage?.src}
			text={coverPage?.text}
			onImageChange={(file: any, blob: any) => {
				coverPage.src = file?.name;
				coverPage.blob = blob;
			}}
			onTextChange={(value: string) => {
				console.log(value);
				coverPage.text = value;
			}}
			onAddStory={async () => {
				isVisible = false;

				const data = {
					_id: uuidv4(),
					userId: 'test',
					createdAt: Date.now(),
					schema: 'story.0.0.1',
					type: 'story',
					cover: coverPage
				};
				await createStory(data, 'test');

				const stories = await findStories('test');
				storiesState.stories = stories?.docs;
			}}
		/>
		{#key coverPage.text}
			<div class="actionBar">
				<Button
					onclick={async () => {
						isVisible = false;

						const data = {
							_id: uuidv4(),
							userId: 'test',
							createdAt: Date.now(),
							schema: 'story.0.0.1',
							type: 'story',
							cover: coverPage
						};
						await createStory(data, 'test');

						const stories = await findStories('test');
						storiesState.stories = stories?.docs;
					}}
					variant="outline"
					disabled={getDisabled(coverPage)}
					>Create Story {@html feather.icons['arrow-right'].toSvg({
						height: 18,
						width: 18,
						stroke: '#888',
						viewBox: '0 0 18 18'
					})}</Button
				>
			</div>
		{/key}
	</Action>

	<Button
		variant="fill"
		onclick={() => {
			isVisible = !isVisible;
		}}
	>
		{@html feather.icons['plus'].toSvg({
			height: 24,
			width: 24,
			stroke: '#888',
			viewBox: '0 0 24 24'
		})}
	</Button>
</AuthorActions>

<style>
	.actionBar {
		align-items: center;
		display: flex;
		height: 48px;
		justify-content: center;
	}
</style>
