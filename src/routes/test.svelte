<script lang="ts">
	import { a } from './test.store'
</script>

<div>
	a: {$a.a}
	<br />
	b: {$a.b}
</div>
<div>
	<button on:click={() => a.update((a) => ({ ...a, a: a.a + 1 }))}>update</button>
	<button on:click={() => a.set({ ...$a, a: 0 })}>set</button>
</div>
