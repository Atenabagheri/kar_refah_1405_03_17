import {
    createSlice,
} from "@reduxjs/toolkit";


interface DeleteButton {
    deleteId: string | null;
}
const initialState: DeleteButton = {
    deleteId: null,
};
const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        setDeleteButton: (state, actions) => {
            state.deleteId = actions.payload;
        }
    },
    extraReducers: () => { },
});

export const { setDeleteButton } = uiSlice.actions;

export default uiSlice.reducer;
