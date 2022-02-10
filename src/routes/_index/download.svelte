<script lang="ts">
	import { state } from './state'
	import TableByGift from './table-by-gift.svelte'
	import TableByUser from './table-by-user.svelte'
	import Filter from './filter.svelte'
	const tabs = ['用户', '礼物', '用户(原)']
	let activeTab = tabs[0]
</script>

{#if !$state.table1}
	<div>暂无统计文件可下载</div>
{:else}
	<div>
		<dl class="dlbtns">
			<dt>下载统计数据文件:</dt>
			<dd>
				<button on:click={() => document.getElementById('sortByUser').click()}>按用户</button>
				<button on:click={() => document.getElementById('sortByGift').click()}>按礼物</button>
			</dd>
		</dl>
		<hr />
		<Filter />
		<hr />
		<ol class="navs">
			<li class="active">分类:</li>
			{#each tabs as nav}
				<li class:active={nav == activeTab} on:click={() => (activeTab = nav)}>{nav}</li>
			{/each}
		</ol>
	</div>
	<div class="tabsContent">
		<div class:active={activeTab === tabs[0]}>
			<TableByUser hiddenFinishedGift />
		</div>
		<div class:active={activeTab === tabs[1]}>
			<TableByGift />
		</div>
		<div class:active={activeTab === tabs[2]}>
			<TableByUser />
		</div>
	</div>
{/if}

<style>
	@import './download.css';
</style>
