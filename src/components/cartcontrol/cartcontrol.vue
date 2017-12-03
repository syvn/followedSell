<template>
	<div class="cartcontrol">
		<transition name="move">
			<div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart" transition="move">
				<span class="inner icon-remove_circle_outline"></span>
			</div>
		</transition>
		
		<div class="cart-count" v-show="food.count>0">
			{{food.count}}
		</div>
		<div class="car-add icon-add_circle" @click.stop.prevent="addCart"></div>
	</div>
</template>
<script>
	import { updateParam } from '@/vuex/store.js';

	export default {
		props: {
			food: {
				type: Object
			}
		},
		data() {
			return {};
		},
		vuex: {
			getters: {
				cartcontrolEle: state => state.cartcontrol.element
			},
			actions: { updateParam }
		},
		methods: {
			addCart(ev) {
				let target = ev.target;
				if(!this.food.count) {
					this.$set(this.food, 'count', 1);
				}else {
					this.food.count++;
				}
				this.updateParam('cartcontrol', 'element', target);
			},
			decreaseCart() {
				if(this.food.count) {
					this.food.count--;
				}else {
					// this.food.count++;
				}
			}
		}
	};
</script>
<style lang="stylus">
	.cartcontrol
		font-size: 0
		.cart-decrease
			display: inline-block
			padding: 6px
			transition: all .4s linear
			&.move-transition
				opacity: 1
				transform: translate3D(0,0,0)
			.inner
				font-size: 24px
				line-height: 24px
				color: rgb(0, 160, 220)
			&.move-enter,
			&.move-leave
				opacity: 0
				transform: translate3D(24px,0,0)
		// .cart-decrease
		.cart-count
			display: inline-block
			vertical-align: top
			width: 12px
			padding-top: 6px
			line-height: 24px
			text-align: center
			font-size: 10px
			color: rgb(147, 153, 159)
		.car-add
			display: inline-block
			padding: 6px
			transition: all .4s linear
			font-size: 24px
			line-height: 24px
			color: rgb(0, 160, 220)
</style>