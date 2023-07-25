import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk action to fetch products from API
export const fetchCartProducts = createAsyncThunk(
  "api/postData",
  async (singleItem) => {
    const postRequest = await axios.post(
      `http://localhost:3001/cart`,
      singleItem
    );
    console.log("postRequest: ", postRequest);
    return postRequest.data;
  }
);

// fetchcart is used here to fetching data.
export const fetchCart = createAsyncThunk("api/fetchData", async () => {
  const response = await axios.get("http://localhost:3001/cart");
  return response.data;
});

// Redux Toolkit slice
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [],
    cartCount: 0,
    isLoading: false,
    error: null,
  },
  reducers: {
    addToCart: (state, action) => {
      const productId = action.payload;
      const product = fetchCartProducts(action.payload);
      state.cartItems.push(productId);
      state.cartCount ++;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchCartProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCartProducts.fulfilled, (state, action) => {
        // state.cart.push(...action.payload);
        state.isLoading = false;
      })
      .addCase(fetchCartProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })

      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        // state.cartItems.push(...action.payload);
        // state.cartCount=action.payload.length;
        state.isLoading = false;
        console.log(action.payload);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      });
  },
});

// Actions generated by Redux Toolkit slice
export const { addToCart } = cartSlice.actions;

// Selectors

export const selectCart = (state) => state.products.cart;
export const selectIsLoading = (state) => state.products.isLoading;
export const selectError = (state) => state.products.error;

export default cartSlice.reducer;
