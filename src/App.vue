<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <keep-alive>
      <router-view :seller="seller" ></router-view>
    </keep-alive>
    
  </div>
</template>

<script>
import { urlParse } from '@/common/js/util';

import Header from '@/components/header/Header';

const ERR_OK = 0;

export default {
  components: {
    'v-header': Header
  },
  data () {
    return {
      tab: [
        { 'type': 'goods', 'name': '商品', 'selected': true },
        { 'type': 'comment', 'name': '评论', 'selected': false },
        { 'type': 'business', 'name': '商家', 'selected': false }
      ],
      seller: {
        id: (() => {
          let queryParam = urlParse();
          return queryParam.id;
        })()
      }
    };
  },
  created() {
    this.$http.get('/api/seller?id=' + this.seller.id).then((res) => {
      let data = res.data;
      if(data.errno === ERR_OK) {
        this.seller = Object.assign({}, this.seller, data.data);
      }
    });
  },
  mounted() {
    // this.$router.go('/goods');
  }
};
</script>

<style lang="stylus">
  @import "./common/stylus/mixin.styl"

  .tab
    display: flex
    width: 100%
    height: 40px;
    line-height: 40px
    border-1px(rgba(7, 17, 87, 0.1))
    .tab-item
      flex: 1
      text-align: center
      & > a
        display: block
        font-size: 14px
        color: rgb(77, 85, 93)
        &.active
          color: rgb(240, 20, 20)
</style>
