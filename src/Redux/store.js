import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./Slices";
const store = configureStore({
    reducer:rootReducer
})
export default store;