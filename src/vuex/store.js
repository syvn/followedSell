import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
	// 控制球 事件对象
	cartcontrol: {
		element: null
	},
	ratings: {
		selectType: null,
		onlyContent: false
	}
};

const mutations = {
	UPDATEPARAM(state, type, param, bool) {
	    state[type][param] = bool;
	}
};

export default new Vuex.Store({
  state,
  mutations
});
export const updateParam = makeAction('UPDATEPARAM');

function makeAction (type) {
    return ({ dispatch }, ...args) => dispatch(type, ...args);
}
