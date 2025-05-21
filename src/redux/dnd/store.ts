import { configureStore } from "@reduxjs/toolkit"
import { cardsSlice } from "./slice"

export const store = configureStore({
  reducer: {
    users: cardsSlice.reducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
