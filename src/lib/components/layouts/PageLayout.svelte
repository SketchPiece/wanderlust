<script>
	import { page } from '$app/stores';
	import { cn } from '$lib/utils';
	import { MessageCircle, Search, User2 } from 'lucide-svelte';
	import { Doc, User } from 'sveltefire';
</script>

<User let:user>
	<Doc ref={`users/${user.uid}`} let:data={userInfo}>
		<div class={cn('flex flex-col h-screen px-4')}>
			<div class="flex-1">
				<slot />
			</div>

			<nav class="text-white">
				<ul class="flex justify-around bg-neutral py-5 px-3 mx-3 my-2 rounded-3xl">
					{#if userInfo.type === 'tourist'}
						<li>
							<a href="/">
								<Search
									class={cn(
										!$page.route.id?.includes('profile') &&
											!$page.route.id?.includes('chats') &&
											'text-primary'
									)}
								/>
							</a>
						</li>
					{/if}
					<li>
						<a href="/chats">
							<MessageCircle class={cn($page.route.id?.includes('chats') && 'text-primary')} />
						</a>
					</li>
					<li>
						<a href="/profile">
							<User2 class={cn($page.route.id?.includes('profile') && 'text-primary')} />
						</a>
					</li>
				</ul>
			</nav>
		</div>
	</Doc>
</User>
