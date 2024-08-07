
import { configureStore } from '@reduxjs/toolkit';

import authReducer from './auth-slice';
import sectionsReducer from './sections-slice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        sections: sectionsReducer,
    }
});

export default store;