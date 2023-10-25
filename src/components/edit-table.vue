<template>
    <div>
        <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
            v-for="(item,index) in header"
            :key="'header'+index"
                prop="date"
                :label="item.name"
                :width="item.width">
                <template v-slot:default="scope">
                    <span class="table-span" v-for="(it,idx) in item.value" :key="'it'+idx">
                        <el-input
                            v-if="it.type == 'input'"
                            v-show="it.show==undefined?true:typeof(it.show)=='function'?it.show(scope):it.show"
                            @change="changeData({...scope,type:it.value,check:it.check||null})"
                            v-model="scope.row[it.value]"
                            :style="{width:it.width}"
                            :placeholder="it.placeholder"
                            :disabled="it.disabled"
                        ></el-input>
                        <el-select
                            v-if="it.type == 'select'"
                            v-show="it.show==undefined?true:typeof(it.show)=='function'?it.show(scope):it.show"
                            @change="changeData({...scope,type:it.value,check:it.check||null})"
                            :multiple="it.multiple || false"
                            v-model="scope.row[it.value]"
                            :style="{width:it.width}"
                            :disabled="it.disabled"
                            :placeholder="it.placeholder"
                            >
                                <el-option
                                    v-for="(itx, idxm) in it.arr"
                                    :key="idxm + 600"
                                    :label="itx.label"
                                    :value="itx.value"
                                    :disabled="itx.disabled"
                                ></el-option>
                        </el-select>
                        <span v-if="it.type == 'text'" v-show="it.show==undefined?true:typeof(it.show)=='function'?it.show(scope):it.show">{{it.value}}</span>
                        <span v-if="it.type == 'value'" v-show="it.show==undefined?true:typeof(it.show)=='function'?it.show(scope):it.show">{{scope.row[it.value]}}</span>
                        <span class="button" v-if="it.type == 'button'" v-show="it.show==undefined?true:typeof(it.show)=='function'?it.show(scope):it.show" @click="it.callback(scope)">{{it.value}}</span>
                    </span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
    props: {
        header:{
            type:Array,
            default:()=>[]
        },
        tableData:{
            type:Array,
            default:()=>[]
        }
    },
    components: {

    },
    data() {
        return {

        };
    },
    watch: {

    },
    computed: {

    },
    created() {

    },
    mounted() {

    },
    methods: {
        changeData(val){
            this.$emit('change',val)
        }
    },
};
</script>

<style scoped>
.table-span{
    float: left;
    margin-right: 10px;
    line-height: 40px;
}
.button{
    cursor: pointer;
    color: #2b4695;
}
</style>
