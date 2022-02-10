<script>
	import { state } from './state'
	import { fstore } from './filter.store'
	$: giftList = Object.keys($state.table2).sort()
	import chunk from 'lodash.chunk'
	const cap = 5
	let active = true
</script>

<table>
	<thead>
		<tr>
			<td colspan={cap}>
				隐藏礼物:
				<button on:click={() => (active = !active)}>{active ? '收起' : '展开'}</button>
			</td>
		</tr>
	</thead>
	<tbody class:active>
		{#each chunk(giftList, cap) as gl, l}
			<tr>
				{#each gl as g, i}
					<td title={g}>
						<input
							id="filter-checkbox-{l * cap + i}"
							type="checkbox"
							bind:group={$fstore}
							value={g}
						/>
						<label for="filter-checkbox-{l * cap + i}">{g}</label>
					</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>

<style>
	@import './download.css';
	label {
		cursor: pointer;
	}
	table {
		width: 80%;
	}
	table td {
		padding: 5px;
		width: 20%;
	}
	table tbody {
		display: none;
	}
	table tbody.active {
		display: block;
	}
	button {
		cursor: pointer;
	}
</style>
