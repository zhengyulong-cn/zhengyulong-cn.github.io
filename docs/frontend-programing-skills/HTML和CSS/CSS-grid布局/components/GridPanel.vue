<template>
  <div ref="containerRef" class=" grid grid-flow-row w-96 h-56 border-4 border-black grid-cols-[repeat(3,_80px)] grid-rows-[repeat(2,_80px)] justify-start content-start justify-items-start items-start">
    <div class=" w-16 h-16 bg-emerald-400 flex justify-center items-center">1</div>
    <div class=" w-16 h-16 bg-emerald-400 flex justify-center items-center">2</div>
    <div class=" w-16 h-16 bg-emerald-400 flex justify-center items-center">3</div>
    <div class=" w-16 h-16 bg-emerald-400 flex justify-center items-center">4</div>
    <div class=" w-16 h-16 bg-emerald-400 flex justify-center items-center">5</div>
  </div>
  <div class="p-4 border-4 border-black rounded-md mt-4">
    <div class=" text-center font-mono">Grid布局调试面板</div>
    <div v-for="(value, key) of options" :key="key">
      <div class=" font-bold">{{ key }}</div>
      <el-radio-group v-model="selectData[key]" @change="handleChange(key, $event)">
        <template v-for="item of value" :key="item">
          <el-radio-button :label="item">{{ item }}</el-radio-button>
        </template>
      </el-radio-group>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"
import type { Ref } from 'vue'
import data from './data.json'
type OptionsT = 'justifyContent' | 'alignContent' | 'justifyItems'| 'alignItems' | 'gridAutoFlow'
const containerRef: Ref<HTMLDivElement | null> = ref(null)
const options: Ref<Record<OptionsT, string[]>> = ref(data)
const selectData: Ref<Partial<Record<OptionsT, string>>> = ref({
  justifyContent: 'start',
  alignContent: 'start',
  justifyItems: 'start',
  alignItems: 'start',
  gridAutoFlow: 'row',
})
const handleChange = (key: OptionsT, value: string) => {
  console.log(key, value)
  if(containerRef.value) {
    containerRef.value.style[key] = value
  }
}
</script>
