import { createSlice } from '@reduxjs/toolkit';

const initialSectionsState = {
    sectionsData: {
        1: [],
        2: [],
        3: [],
        4: [],
        5: [],
        6: [],
        7: [],
        8: [],
        9: [],
    },
}

const sectionsSlice = createSlice({
    name: 'sections',
    initialState: initialSectionsState,
    reducers: {
        setSectionData(state, action)
        {
            state.sectionsData[action.payload[0]?.section] = action.payload;
        },
        updateSectionItemData(state, action)
        {
            state.sectionsData[action.payload?.section] = state.sectionsData[action.payload?.section].map(item =>
            {
                if (item._id === action.payload._id)
                {
                    return action.payload
                } else
                {
                    return item
                }
            });
        },
    }
})

export const sectionsActions = sectionsSlice.actions

export default sectionsSlice.reducer;