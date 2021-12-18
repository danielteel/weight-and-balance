export default function selectedMenuReducer(state, action, payload) {
    return {page: action, ...payload};
}