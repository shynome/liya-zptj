<script lang="ts">
	import { state } from './state'
	import XLSX from 'xlsx'
	import { dcsv, dcsv2 } from './table.store'
	import { fstore } from './filter.store'
	export let hiddenFinishedGift: boolean = false

	function download() {
		const wb = XLSX.utils.book_new()
		const widths = [
			{ wch: 20 },
			{ wch: 10 },
			{ wch: 25 },
			{ wch: 6 },
			{ wch: 6 },
			{ wch: 6 },
			{ wch: 150 },
		]
		let ws = XLSX.utils.table_to_sheet(document.getElementById('user-gift-table-1'))
		let ws2 = XLSX.utils.table_to_sheet(document.getElementById('user-gift-table-0'))
		ws['!cols'] = widths
		ws2['!cols'] = widths
		XLSX.utils.book_append_sheet(wb, ws, '按用户')
		XLSX.utils.book_append_sheet(wb, ws2, '按用户(原)')
		const old = XLSX.read($state.srcData)
		let ows = old.Sheets[old.SheetNames[0]]
		XLSX.utils.book_append_sheet(wb, ows, '元数据')
		XLSX.writeFile(wb, $state.srcName.replace('.xlsx', '-统计结果-按用户.xlsx'))
	}
</script>

{#if hiddenFinishedGift}
	<input id="sortByUser" type="hidden" value="下载礼物排序数据" on:click={download} />
{/if}
<table class="table" id={'user-gift-table-' + (hiddenFinishedGift ? 1 : 0)}>
	<thead>
		<tr>
			<td>呢称(首次使用)</td>
			<td>用户id(唯一凭证)</td>
			<td>中奖礼物</td>
			<td>数量</td>
			<td>分割(0)</td>
			<td>待处理</td>
			<td>中奖记录(对应行)</td>
		</tr>
	</thead>
	<tbody>
		{#each hiddenFinishedGift ? $dcsv2 : $dcsv as { u, sortedFields } (u.id)}
			<tr class="f">
				<td colspan="7" />
			</tr>
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
					<td />
					{#if i === 0}
						<td rowspan={sortedFields.length}>
							{hiddenFinishedGift ? u.getNeedSendGiftsCount($fstore) : u.needSendGiftsCount}
						</td>
					{/if}
					<td>{u.gifts[gift].pois.join(',')}</td>
				</tr>
			{/each}
		{/each}
	</tbody>
</table>

<style>
	@import './download.css';
</style>
