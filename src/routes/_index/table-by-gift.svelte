<script lang="ts">
	import type { DataStore2, Item2 } from './types'
	import { state } from './state'
	import { getGiftOrder } from './table'
	import XLSX from 'xlsx'
	const tabs = Object.keys($state.table2) // 按字符排序一次
		.sort()
		.sort((a, b) => {
			return getGiftOrder(a) > getGiftOrder(b) ? -1 : 1
		})
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
		let tables = document.querySelectorAll('#gift-tables table')
		let i = 0
		for (let sheet of tabs) {
			let ws = XLSX.utils.table_to_sheet(tables[i++])
			ws['!cols'] = widths
			XLSX.utils.book_append_sheet(wb, ws, sheet)
		}
		const old = XLSX.read($state.srcData)
		let ows = old.Sheets[old.SheetNames[0]]
		XLSX.utils.book_append_sheet(wb, ows, '元数据')
		XLSX.writeFile(wb, $state.srcName.replace('.xlsx', '-统计结果-按礼物.xlsx'))
	}

	let activeTab = tabs[0]
	function genItems(tab: string) {
		let table = $state.table2[tab]
		let items: Item2[] = []
		for (let k in table) {
			let u = table[k]
			items.push(u)
		}
		items.sort((a, b) => {
			return a.count > b.count ? -1 : 1
		})
		return items
	}
</script>

<div id="gift-tables">
	<input id="sortByGift" type="button" value="下载礼物排序数据" on:click={download} />
	<ol class="navs">
		{#each tabs as tab}
			<li class:active={activeTab === tab} on:click={() => (activeTab = tab)}>{tab}</li>
		{/each}
	</ol>
	<div class="tabsContent">
		{#each tabs as tab}
			<div class:active={activeTab === tab}>
				<table class="table">
					<thead>
						<tr>
							<td>呢称</td>
							<td>用户id(唯一凭证)</td>
							<td>礼物</td>
							<td>数量</td>
							<td>分割(0)</td>
							<td>分割(0)</td>
							<td>中奖记录(对应行)</td>
						</tr>
					</thead>
					<tbody>
						{#each genItems(tab) as t}
							<tr>
								<td>{t.nickname}</td>
								<td>{t.id}</td>
								<td>{t.gift}</td>
								<td>{t.count}</td>
								<td />
								<td />
								<td>{t.records.join(',')}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/each}
	</div>
</div>

<style>
	@import './download.css';
</style>
