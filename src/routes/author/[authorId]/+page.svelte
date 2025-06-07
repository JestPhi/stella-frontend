<script lang="ts">
	import feather from 'feather-icons';
	import Button from '$lib/components/Button.svelte';
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
	import AddStory from './components/AddStory.svelte';
	import Avatar from '$lib/components/Avatar.svelte';
	import HomeButton from '$lib/components/HomeButton.svelte';

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
<!-- TODO re-archetecht this ish -->
<AuthorActions>
	<HomeButton />
	<AddStory />
	<Avatar />
</AuthorActions>
