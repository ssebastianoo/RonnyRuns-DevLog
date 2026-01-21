<script lang="ts">
	import '../layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { Search } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import config from '../config';

	let { children } = $props();

	let showSearch = $state(false);
	let searchValue = $state('');
	let inputRef = $state<HTMLInputElement>();

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			goto('/search?query=' + encodeURIComponent(searchValue), {
				keepFocus: true,
				invalidateAll: true
			});
		}
	}

	function handleClickOutside(event: MouseEvent) {
		if (
			showSearch &&
			inputRef &&
			!inputRef.contains(event.target as Node) &&
			!(event.target as HTMLElement).closest('button')
		) {
			showSearch = false;
		}
	}

	onMount(() => {
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});
</script>

<svelte:head>
	<title>{config.siteTitle}</title>

	<meta name="description" content={config.siteDescription} />

	<!-- Canonical -->
	<link rel="canonical" href={config.siteUrl} />

	<!-- Open Graph -->
	<meta property="og:type" content="website" />
	<meta property="og:title" content={config.siteTitle} />
	<meta property="og:description" content={config.siteDescription} />
	<meta property="og:url" content={config.siteUrl} />
	<meta property="og:site_name" content={config.siteTitle} />

	<!-- Optional preview image -->
	<!-- <meta property="og:image" content={config.siteImage} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" /> -->

	<!-- Twitter -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={config.siteTitle} />
	<meta name="twitter:description" content={config.siteDescription} />
	<!-- <meta name="twitter:image" content={config.siteImage} /> -->

	<!-- Theme / UX -->
	<meta name="theme-color" content="#ff66aa" />

	<link rel="icon" href={favicon} />
</svelte:head>

<div class="relative">
	<div
		class="absolute top-0 left-0 -z-10 h-50 w-full bg-linear-to-b from-primary/50 to-transparent"
	></div>
	<div class="mx-auto w-full max-w-5xl">
		<nav class="flex items-center gap-6 p-5">
			<a class="text-foreground hover:underline" href="/">home</a>
			<a class="text-foreground hover:underline" href="/about">about</a>
			<a class="text-foreground hover:underline" href="/social">social</a>
			<div class="flex items-center gap-2">
				{#if showSearch}
					<input
						bind:this={inputRef}
						type="text"
						class="-my-px rounded bg-card px-2 py-px outline-1 outline-accent"
						placeholder="Cerca..."
						bind:value={searchValue}
						onkeypress={handleKeyPress}
					/>{/if}
				<button
					onclick={() => {
						if (!showSearch) {
							showSearch = true;
							setTimeout(() => {
								inputRef?.focus();
							}, 0);
						} else
							goto('/search?query=' + encodeURIComponent(searchValue), { invalidateAll: true });
					}}
					class="-m-1 cursor-pointer rounded-full p-1 hover:bg-accent/50"
					><Search size={17} /></button
				>
			</div>
		</nav>
		<div class="mx-5 bg-background p-5">
			{@render children()}
		</div>
		<footer class="p-5 text-center text-sm text-muted">
			<p>uwu</p>
		</footer>
	</div>
</div>
