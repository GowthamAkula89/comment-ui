import { createSlice } from "@reduxjs/toolkit";
const commentsSlice = createSlice({
    name :"comments",
    initialState : {
        comments : {}
    },
    reducers:{
        setComments : (state, action) => {
            state.comments = action.payload
        }
    }
})

export const { setComments } = commentsSlice.actions
export default commentsSlice.reducer