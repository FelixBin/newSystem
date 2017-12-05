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
        <!--没有登录提示框-->
        <Modal v-bind:mdShow="mdShow" v-on:close="closeModal">
            <p slot="message">
                请先登录，否则无法加入购物车！
            </p>
            <div slot="btnGroup">
                <a href="javascript:;" class="btn btn--m" @click="mdShow=false">关闭</a>
            </div>
        </Modal>
        <!--登录后的提示框-->
        <Modal v-bind:mdShow="mdShowCart" v-on:close="closeModal">
            <p slot="message">
                <svg class="icon-cart">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-cart"></use>
                </svg>
                <span>加入购物车成功</span>
            </p>
            <div slot="btnGroup">
                <a href="javascript:;" class="btn btn--m" @click="mdShowCart=false">
                    继续购物
                </a>
                <router-link href="javascript:;" class="btn btn--m" to="/cart">
                    查看购物车
                </router-link>
            </div>
        </Modal>


        <nav-footer></nav-footer>
    </div>
</template>

<script>
    import '@/assets/css/base.css'
    import '@/assets/css/product.css'
    import qs from 'qs';
    import NavHeader from  '@/components/NavHeader.vue'
    import NavFooter from  '@/components/NavFooter.vue'
    import NavBread from  '@/components/NavBread.vue'
    import Modal from  '@/components/Modal.vue'
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
                mdShow: false,
                mdShowCart: false,
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
            NavBread,
            Modal
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
                this.$axios.get("http://localhost:27017/goods/list", {
                    params: param
                }, {
                    withCredentials: true
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
                this.$axios.post("http://localhost:27017/goods/addCart", qs.stringify({productId: productId}, {
                    withCredentials: true
                })).then((res) => {
                    if (res.data.status == 0) {
                        this.mdShowCart = true;
                        this.$store.commit('updateCartCount',1)
                    } else {
                        this.mdShow = true;
                    }
                })
            },
            closeModal(){
                this.mdShow = false;
                this.mdShowCart = false;
            }
        }
    }
</script>
<style scoped>
    .btn:hover {
        background-color: #ee7a23;
        transition: all .3s ease-out;
    }

</style>
