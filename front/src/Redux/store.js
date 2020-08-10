import {createStore,applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducers from './Reducers';
import rootSaga from './Sagas';

const configureStore = () => {
    const sagaMiddleware = createSagaMiddleware();
    // const mainEnhancer = compose(persistState(["auth"]), applyMiddleware(sagaMiddleware));

    return {
        ...createStore(rootReducers, {}, applyMiddleware(sagaMiddleware)),
        runSaga: sagaMiddleware.run(rootSaga)
    };
};

export default configureStore;