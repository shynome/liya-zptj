<script lang="ts">
	import XLSX from 'xlsx'
	import { state } from './state'
	function handleChange(elem: HTMLInputElement) {
		const f = elem.files[0]
		if (!f) {
			return
		}
		let reader = new FileReader()
		reader.onerror = (e) => {
			state.showError(new Error('读取文件失败'))
		}
		reader.onload = (e) => {
			let d = e.target.result
			let w = XLSX.read(d, { type: 'array' })
			if (w.SheetNames.length === 0) {
				state.showError(new Error('没有可用的数据'))
				return
			}
			for (let sheet of w.SheetNames) {
				let s = w.Sheets[sheet]
				let srcData = d as ArrayBuffer
				state.parse(s, f.name, srcData)
				break
			}
		}
		reader.readAsArrayBuffer(f)
	}
</script>

<div>
	<label for="xlsx-file">{$state.srcName ? '上传新文件' : '上传文件'} </label>
	<input
		id="xlsx-file"
		type="file"
		accept=".xlsx"
		disabled={$state.parsing}
		on:change={(e) => handleChange(e.currentTarget)}
	/>
	<a
		rel="external"
		href="https://github.com/shynome/liya-zptj"
		target="liya-zptj"
		style="float: right;margin-left: 1rem;"
	>
		Github
	</a>
	<a rel="external" href="/v1" style="float: right;">旧版</a>
	{#if $state.parsing}
		解析中...
	{/if}
</div>
{#if $state.err !== null}
	<hr />
	<div>
		出错了:
		<code>
			{$state.err?.message ?? JSON.stringify($state.err)}
		</code>
	</div>
{/if}
