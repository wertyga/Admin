import { combineReducers } from 'redux';
import admin from './admin';
import globalError  from './globalError';
import adminProductsPage  from './products';

export default combineReducers({
    admin,
    globalError,
    adminProductsPage
});