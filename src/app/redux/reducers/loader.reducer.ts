import * as fromLoader from '../actions/loader.actions';

const initState = false;

export function loaderReducer(state = initState, action: fromLoader.LoaderActions): boolean {
    switch (action.type) {
        case fromLoader.LOADER_ON:
            return true;
        case fromLoader.LOADER_OFF:
            return false;
        default:
            return state;
    }
}
