<template>
    <div class="temp">
        <div class="nav-breadcrumb-wrap">
            <div class="container">
                <nav class="nav-breadcrumb">
                    <a href="/">Home</a>
                    <slot name="bread"></slot>
                    <slot name="myCart"></slot>
                    <slot name="address"></slot>
                </nav>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'temp',
        data () {
            return {
                //数据
            }
        }
    }
</script>
<style scoped>
    .nav-breadcrumb {
        width: 12%;
    }
</style>
