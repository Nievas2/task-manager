import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

const DEFAULT_STATE = [
  {
    id: "1",
    name: "1",
  },
  {
    id: "2",
    name: "2",
  },
  {
    id: "3",
    name: "3",
  },
]

export interface Card {
  name: string
}

export interface CardWithId extends Card {
  id: string
}

const initialState: CardWithId[] = (() => {
  const persistedState = localStorage.getItem("__redux__state__")
  return persistedState ? JSON.parse(persistedState).cards : DEFAULT_STATE
})()

export const cardsSlice = createSlice({
  name: "cards",
  initialState,
  reducers: {
    addNewCard: (state, action: PayloadAction<Card>) => {
      const id = crypto.randomUUID()
      state.push({ id, ...action.payload })
    },
    deleteCardById: (state, action: PayloadAction<string>) => {
      const id = action.payload
      return state.filter((card) => card.id !== id)
    },
  },
})

export default cardsSlice.reducer

export const { addNewCard, deleteCardById } = cardsSlice.actions
