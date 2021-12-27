<script lang="ts">
	import { getGiftOrder } from './table'

	import { isFinishedGift, User } from './types'
	export let csv: User[] = []
	export let hiddenFinishedGift: boolean = false

	// sortedFields
	$: dcsv = csv.map((u) => {
		let sortedFields = Object.keys(u.gifts)
			.filter((g) => {
				if (hiddenFinishedGift) {
					return !isFinishedGift(g)
				}
				return true
			})
			// 按字符排序一次
			.sort()
			.sort((a, b) => {
				return getGiftOrder(a) > getGiftOrder(b) ? -1 : 1
			})
		return {
			u,
			sortedFields,
		}
	})
</script>

<table>
	<thead>
		<td>呢称(含曾用)</td>
		<td>用户id(唯一凭证)</td>
		<td>中奖礼物</td>
		<td>数量</td>
		<td>分割(0)</td>
		<td>待处理</td>
		<td>中奖记录(对应行)</td>
	</thead>
	<tbody>
		{#each dcsv as { u, sortedFields } (u.id)}
			<tr class="f">
				<td colspan="7" />
			</tr>
			<tr>
				{#each sortedFields as gift, i (gift)}
					<tr>
						{#if i === 0}
							<td rowspan={sortedFields.length}>{u.nicknames[0]}</td>
							<td rowspan={sortedFields.length}>{u.id}</td>
						{/if}
						<td>
							<pre>{gift}</pre>
						</td>
						<td>{u.gifts[gift].count}</td>
						{#if i === 0}
							<td rowspan={sortedFields.length}>{u.needSendGiftsCount}</td>
						{/if}
						<td>{u.gifts[gift].pois.join(',')}</td>
					</tr>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>
