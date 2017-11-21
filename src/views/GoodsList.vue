<template>
    <div class="temp">
        <nav-header></nav-header>
        <nav-bread>
            <span slot="bread">Goods</span>
        </nav-bread>
        <div class="accessory-result-page accessory-page">
            <div class="container">
                <div class="filter-nav">
                    <span class="sortby">Sort by:</span>
                    <a href="javascript:void(0)" class="default cur">Default</a>
                    <a href="javascript:void(0)" class="price" @click="sortGoods">Price
                        <svg class="icon icon-arrow-short">
                            <use xlink:href="#icon-arrow-short"></use>
                        </svg>
                    </a>
                    <a href="javascript:void(0)" class="filterby stopPop">Filter by</a>
                </div>
                <div class="accessory-result">
                    <!-- filter -->
                    <div class="filter stopPop" id="filter">
                        <dl class="filter-price">
                            <dt>Price:</dt>
                            <dd><a href="javascript:void(0)" @click="setPriceFilter('all')">All</a></dd>
                            <dd v-for="(item,index) in priceFilter">
                                <a href="javascript:void(0)" @click="setPriceFilter(index)"
                                   v-bind:class="{'cur':priceChecked==index}">{{item.startPrice}} -
                                    {{item.endPrice}}</a>
                            </dd>
                        </dl>
                    </div>

                    <!-- search result accessories list -->
                    <div class="accessory-list-wrap">
                        <div class="accessory-list col-4">
                            <ul>
                                <li v-for="item in goodsList">
                                    <div class="pic">
                                        <a href="#"><img :src="item.productImage" alt=""></a>
                                    </div>
                                    <div class="main">
                                        <div class="name">{{item.producName}}</div>
                                        <div class="price">{{item.salePrice}}</div>
                                        <div class="btn-area">
                                            <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy"
                                 infinite-scroll-distance="20">
                                <img src="./../assets/loading-spinning-bubbles.svg" v-if="loading">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <nav-footer></nav-footer>
    </div>
</template>

<script>
    import '@/assets/css/base.css'
    import '@/assets/css/product.css'
    import  axios from 'axios'
    import qs from 'qs';
    import NavHeader from  '@/components/NavHeader.vue'
    import NavFooter from  '@/components/NavFooter.vue'
    import NavBread from  '@/components/NavBread.vue'
    export default {
        name: 'temp',
        data () {
            return {
                goodsList: [],
                sortFlag: true,
                page: 1,
                pageSize: 8,
                busy: true,
                priceChecked: 'all',
                priceFilter: [
                    {
                        startPrice: '0.00',
                        endPrice: '100.00'
                    },
                    {
                        startPrice: '100.00',
                        endPrice: '500.00'
                    },
                    {
                        startPrice: '500.00',
                        endPrice: '1000.00'
                    },
                    {
                        startPrice: '1000.00',
                        endPrice: '5000.00'
                    }
                ],
                loading: false
            }
        },
        components: {
            NavHeader,
            NavFooter,
            NavBread
        },
        mounted: function () {
            this.getGoodList()
        },
        methods: {
            getGoodList(flag){
                var param = {
                    page: this.page,
                    pageSize: this.pageSize,
                    sortPrice: this.sortFlag ? 1 : -1,
                    priceLevel: this.priceChecked
                };
                this.loading = true;
                axios.get("http://localhost:27018/goods", {
                    params: param
                }).then((response) => {
                    this.loading = false;
                    let res = response.data;
                    if (res.status == "0") {
                        if (flag) {
                            this.goodsList = this.goodsList.concat(res.result.list);

                            if (res.result.count == 0) {
                                this.busy = true;
                            } else {
                                this.busy = false;
                            }
                        } else {
                            this.goodsList = res.result.list;
                            this.busy = false;
                        }
                    } else {
                        this.goodsList = [];
                    }
                })
            },
            sortGoods(){
                this.sortFlag = !this.sortFlag;
                this.page = 1;
                this.getGoodList();
            },
            setPriceFilter(index){
                this.priceChecked = index;
                this.page = 1;
                this.getGoodList();
            },
            loadMore(){
                this.busy = true;
                setTimeout(() => {
                    this.page++;
                    this.getGoodList(true)
                }, 500);
            },
            addCart(productId){
                console.log("productId的值"+productId)
                axios.post("http://localhost:27018/goods/addCart",qs.stringify({productId:productId})).then(function (res) {
                    console.log("最后的值："+res)
                    if (res.status == 0) {
                        alert("成功")
                    } else {
                        alert("失败")
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
