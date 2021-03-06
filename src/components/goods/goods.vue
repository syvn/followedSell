<template>
	<div class="goods">
		<div class="menu-wrapper" ref = "menuWrapper">
			<ul>
				<li v-for="(item, index) in goods" class="menu-item" :class="{'current':currentIndex === index}" @click="selectMenu(index)">
					<span class="text">
						<span v-show="item.type > 0" class="icon" :class="classMap[item.type]"></span>
						{{item.name}}
					</span>
				</li>
			</ul>
		</div>
		<div class="foods-wrapper" ref ="foodsWrapper">
			<ul>
				<li v-for="item in goods" class="foods-list food-list-hook">
					<h1 class="title">
						{{item.name}}
					</h1>
					<ul>
						<li @click="selectFood(food, $event)" v-for="food in item.foods" class="food-item">
							<div class="icon">
								<img width="57" height="57" :src="food.icon" alt="">
							</div>
							<div class="content">
								<h2 class="name">
									{{food.name}}
								</h2>
								<p class="desc">{{food.description}}</p>
								<div class="extra">
									<span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}份</span>
								</div>
								<div class="price">
									<span class="now">￥{{food.price}}</span>
									<span class="old" v-show="food.oldPrice">{{food.oldPrice}}</span>
								</div>
								<div class="cartcontrol-wrapper">
									<v-cartcontrol :food="food"></v-cartcontrol>
								</div>
							</div>

						</li>
					</ul>
				</li>
			</ul>
		</div>
		<v-shopcart :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></v-shopcart>
		<v-food :food="selectedFood" ref="food"></v-food>
	</div>
</template>
<script>
	import BScroll from 'better-scroll';
	import ShopCart from '@/components/shopcart/shopcart';
	import cartcontrol from '@/components/cartcontrol/cartcontrol';
	import food from '@/components/food/food';

	const ERR_OK = 0;

	export default {
		props: ['seller'],
		components: {
			'v-shopcart': ShopCart,
			'v-cartcontrol': cartcontrol,
			'v-food': food
		},
		events: {
			'cart.add'(target) {
				this._drop(target);
			}
		},
		vuex: {
			getters: {
			}
		},
		data() {
			return {
				goods: [],
				listHeight: [],
				scroolY: 0,
				selectedFood: {}
			};
		},
		computed: {
			currentIndex() {
				for(let i = 0; i < this.listHeight.length; i++) {
					let height1 = this.listHeight[i];
					let height2 = this.listHeight[i + 1];
					if(!height2 || (this.scroolY >= height1 && this.scroolY < height2)) {
						return i;
					}
				}
				return 0;
			},
			selectFoods() {
				let foods = [];
				this.goods.forEach((good) => {
					good.foods.forEach((food) => {
						if(food.count) {
							foods.push(food);
						}
					});
				});
				return foods;
			}
		},
		created() {
			this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
			this.$http.get('/api/goods').then((res) => {
				let data = res.data;
				if(data.errno === ERR_OK) {
					this.goods = data.data;
					this.$nextTick(() => {
						this.initScroll();
						this.calculateHeight();
					});
				}else {
					console.log(this.goods);
				}
			});
		},
		methods: {
			initScroll() {
				this.menuScroll = new BScroll(this.$refs.menuWrapper, {
					click: true
				});

				this.foodScroll = new BScroll(this.$refs.foodsWrapper, {
					click: true,
					probeType: 3
				});
				this.foodScroll.on('scroll', (pos) => {
					this.scroolY = Math.abs(Math.round(pos.y));
				});
			},
			calculateHeight() {
				let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
				let height = 0;
				this.listHeight.push(height);
				for(let i = 0; i < foodList.length; i++) {
					let item = foodList[i];
					height += item.clientHeight;
					if (height % 2 !== 0) { // 全部设为偶数, 方便与 滚动条高度对比
						height -= 1;
					}
					this.listHeight.push(height);
				}
			},
			selectMenu(index) {
				let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook');
				let el = foodList[index];
				this.foodScroll.scrollToElement(el, 300);
			},
			_drop(target) {
				this.$refs.shopcart.drop(target);
			},
			selectFood(food, event) {
				this.selectedFood = food;
				console.log(this.$refs.food);
				this.$refs.food.show();
			}
		},
		mounted() {
		}
	};
</script>
<style lang="stylus">
	@import "../../common/stylus/mixin.styl"
	.goods
		position: absolute
		top: 174px
		bottom: 46px
		display: flex
		width: 100%
		overflow: hidden
		.menu-wrapper
			flex: 0 0 80px
			width: 80px
			background: #f3f5f7
			.menu-item
				display: table
				padding: 0 12px
				width: 56px
				height: 54px
				line-height: 14px
				&.current
					position: relative
					z-index: 10
					margin-top: -1px
					font-weight: 700
					background: #fff;
					.text
						border-none()
				.icon
					display: inline-block
					width: 12px
					height: 12px
					margin-right: 2px
					vertical-align: top
					background-size: 12px 12px
					background-repeat: no-repeat
					&.decrease
						bg-image('decrease_3')
					&.discount
						bg-image('discount_3')
					&.guarantee
						bg-image('guarantee_3')
					&.invoice
						bg-image('invoice_3')
					&.special
						bg-image('special_3')
				.text
					display: table-cell
					width: 56px
					vertical-align: middle
					border-1px(rgba(7, 17, 27, 0.2))
					font-size: 12px
					
		.foods-wrapper
			flex: 1
			.title
				padding-left: 14px
				height: 26px
				line-height: 26px
				border-left: 2px solid #d9dde1
				color: rgb(147, 153, 159)
				font-size: 12px
				background: #f3f5f7
			.food-item
				display: flex
				margin: 18px
				padding-bottom: 18px
				border-1px(rgba(7, 17, 27, 0.2))
				&:last-child
					border-none()
					margin-bottom: 0
				.icon
					flex: 0 0 57px
					margin-right: 10px
				.content
					flex: 1
					position: relative
					.name
						margin: 2px 0 8px 0
						height: 14px
						font-size: 14px
						color: rgb(7, 17, 27)
					.desc,
					.extra
						line-height: 10px
						font-size: 10px
						color: rgb(147, 153, 159)
					.desc
						margin-bottom: 8px
						line-height: 12px
					.extra
						.count
							margin-right: 12px
					.price
						font-weight: 700
						line-height: 24px
						.now
							margin-right: 8px
							font-size: 12px
							color: rgb(240, 20, 20)
						.old
							text-decoration: line-through
							font-size: 10px
							color: rgb(147, 153, 159)
					.cartcontrol-wrapper 
						position: absolute
						right: 0
						bottom: 12px
		
</style>