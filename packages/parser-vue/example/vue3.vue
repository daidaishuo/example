<template>
    <div class="flex items-center justify-center h-screen bg-gray-50">
        <Card></Card>
        <div>
            <testWarp>第一个提取文案</testWarp>
            {{ msg }}
        </div>
        <div>
            {{
                count
            }}
        </div>
        <testWarp>第二个提取文案</testWarp>
    </div>
</template>


<script lang="ts" setup>
import { ref, computed } from "vue";
import Card from "./components/Card.vue";
const msg = ref("setup script");

const count = computed(() => {
    return 'hzs'
})

</script>
<style>
</style>
