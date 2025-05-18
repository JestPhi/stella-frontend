<script lang="ts">
	import feather from 'feather-icons';
	import Button from '$lib/components/Button.svelte';
	import Switch from '$lib/components/Switch.svelte';
	import Author from '$lib/components/Author.svelte';
	import CoverPage from './components/CoverPage.svelte';
	import AuthorActions from '$lib/components/AuthorActions.svelte';
	import StoryActions from './components/StoryActions.svelte';
	import AuthorData from '../../../scheme/author.json';
	import { onMount } from 'svelte';
	import storiesState from './state.svelte';
	import Action from '$lib/components/Action.svelte';
	import Menu from './components/Menu.svelte';
	import { updateStories, fetchAuthor, createStory, findStories } from '$lib/DB';
	import { v4 as uuidv4 } from 'uuid';

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
</script>

<Author />

{#each storiesState?.stories as story, index}
	{#key storiesState?.stories[index]}
		<StoryActions stories={storiesState?.stories} {index} />
		<CoverPage story={storiesState?.stories[index]} />
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
				class="outline"
				disabled={coverPage.text.length === 0}>Add Story</Button
			>
		{/key}
	</Action>

	<Button
		class="outline"
		onclick={() => {
			isVisible = !isVisible;
		}}>Add Story</Button
	>
</AuthorActions>

<style>
</style>
