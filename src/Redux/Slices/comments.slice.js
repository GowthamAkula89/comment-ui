import { createSlice } from "@reduxjs/toolkit";
const commentsSlice = createSlice({
    name :"comments",
    initialState : {
        comments : {},
        activeSort : "popular"
    },
    reducers:{
        setComments : (state, action) => {
            state.comments = action.payload
        },
        setActiveSort : (state, action) => {
            state.activeSort = action.payload
        }
    }
})

export const { setComments, setActiveSort } = commentsSlice.actions
export default commentsSlice.reducer