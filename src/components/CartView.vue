<script setup>
import { reactive, ref } from "vue";
import request from "../request";
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/vue";

const isOpen = ref(false);
const loading = ref(true);
const total = ref(0);
const searchColoumn = ref("name");
const searchValue = ref("");

const toPurhase = ref([]);
const cartProducts = ref([]);
const searchArray = ref([]);

function closeModal() {
  isOpen.value = false;
}

const purchaseSingle = (id) => {
  const data = cartProducts.value.find((each) => each.cartId === id);
  console.log(data);
  console.log(data.name);
  toPurhase.value = [
    {
      cartId: data.cartId,
      id: data.id,
      name: data.name,
      price: data.price,
      quantity: data.quantity,
    },
  ];
  total.value = data.quantity * data.price;
  isOpen.value = true;
};

const purchaseAll = () => {
  let final = 0;
  cartProducts.value.forEach((each) => {
    final = final + each.price * each.quantity;
  });
  toPurhase.value = cartProducts.value;
  total.value = final;
  isOpen.value = true;
};

const getCartProducts = async () => {
  loading.value = true;
  const { data, status } = await request("GET", "/cart");
  if (status === 200) {
    cartProducts.value = data;
    searchArray.value = data;
  }
  loading.value = false;
};
getCartProducts();

const deleteFromCart = async (id) => {
  const { data, status } = await request("POST", "/cart", {}, { id: id });
  if (status === 200) {
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: data.msg,
      showConfirmButton: false,
      timer: 1000,
    });
    getCartProducts();
  }
};

const placeOrder = async () => {
  const { data, status } = await request(
    "POST",
    "/placeOrder",
    {},
    { data: toPurhase.value }
  );
  if (status === 200) {
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: data.msg,
      showConfirmButton: false,
      timer: 1000,
    });
    isOpen.value = false;
    getCartProducts();
  }
};

const performSearch = (value) => {
  const data = cartProducts.value.filter(
    (each) =>
      !each[searchColoumn.value].toLowerCase().indexOf(value.toLowerCase())
  );
  searchArray.value = data;
};
</script>

<template>
  <div class="flex h-full items-center justify-center mt-72" v-if="loading">
    <div class="spinner"></div>
  </div>
  <div v-if="!loading">
    <p class="my-8 text-3xl font-semibold">User Cart</p>
    <div class="flex gap-x-6 my-8">
      <select
        class="py-3 px-4 block w-18 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 bg-slate-200 border-gray-700 text-gray-400"
        v-model="searchColoumn"
      >
        <option selected value="name">Product Name</option>
        <option value="price">Product Price</option>
      </select>

      <input
        type="text"
        id="search"
        name="search"
        v-model="searchValue"
        v-on:input="(e) => performSearch(e.target.value)"
        placeholder="Search product in your Cart..."
        class="py-3 px-4 block w-full rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 bg-slate-200 border-gray-700 text-gray-400"
        required
      />
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-4 gap-x-6 gap-y-4">
      <div v-for="cart in searchArray">
        <div
          class="flex flex-col flex-[1_0_0%] bg-white border shadow-sm rounded-xl"
        >
          <div class="relative">
            <img
              class="w-full h-auto rounded-t-xl sm:rounded-tr-none"
              :src="cart.url"
              style="width: 100%; height: 8cm"
              alt="Image Description"
            />
            <button
              @click="() => deleteFromCart(cart.cartId)"
              class="absolute top-2 right-3 bg-gray-200 text-white p-2 rounded-full hover:bg-gray-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                style="fill: rgba(0, 0, 0, 1); transform: ; msfilter: "
              >
                <path
                  d="M5 20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8h2V6h-4V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H3v2h2zM9 4h6v2H9zM8 8h9v12H7V8z"
                ></path>
                <path d="M9 10h2v8H9zm4 0h2v8h-2z"></path>
              </svg>
            </button>
          </div>
          <div class="p-4 md:p-5">
            <div class="flex justify-between">
              <h3 class="text-lg font-bold text-gray-800">
                {{ cart.name }}
              </h3>
              <h3 class="text-lg font-bold text-gray-800">
                price : {{ cart.price }}
              </h3>
            </div>
            <p class="mt-5 text-gray-800">
              {{ cart.description }}
            </p>

            <input
              type="number"
              id="quantity"
              name="quantity"
              placeholder="Enter Quantity..."
              v-model="cart.quantity"
              class="py-3 mt-6 px-4 block w-full rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 bg-slate-200 border-gray-700 text-gray-400"
              required
            />

            <button
              type="button"
              @click="() => purchaseSingle(cart.cartId)"
              class="w-full text-white mt-5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-center" v-if="searchArray.length !== 0">
      <button
        type="button"
        @click="purchaseAll"
        class="w-72 my-10 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2"
      >
        Buy All
      </button>
    </div>

    <div>
      <TransitionRoot appear :show="isOpen" as="template">
        <Dialog as="div" @close="closeModal" class="relative z-10">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <div class="fixed inset-0 bg-black bg-opacity-25" />
          </TransitionChild>

          <div class="fixed inset-0 overflow-y-auto">
            <div
              class="flex min-h-full items-center justify-center p-4 text-center"
            >
              <TransitionChild
                as="template"
                enter="duration-300 ease-out"
                enter-from="opacity-0 scale-95"
                enter-to="opacity-100 scale-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100 scale-100"
                leave-to="opacity-0 scale-95"
              >
                <DialogPanel
                  class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
                >
                  <DialogTitle
                    as="h3"
                    class="text-lg font-semibold leading-6 text-gray-900"
                  >
                    Purchase Product
                  </DialogTitle>
                  <hr class="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700" />

                  <div class="mt-2" v-for="item in toPurhase">
                    <div class="flex justify-between mb-3">
                      <p class="font-semibold">{{ item.name }}</p>
                      <p>
                        <span class="font-semibold">price</span> :
                        {{ item.price }}
                      </p>
                    </div>

                    <p>
                      <span class="font-semibold">Quantity</span> :
                      {{ item.quantity }}
                    </p>
                    <hr
                      class="h-px my-3 bg-gray-200 border-0 dark:bg-gray-700"
                    />
                  </div>

                  <div class="flex justify-between mt-6">
                    <p class="font-semibold">Total</p>
                    <p>{{ total }}</p>
                  </div>

                  <div class="mt-8">
                    <button
                      type="button"
                      class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      @click="placeOrder"
                    >
                      Place Order
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </TransitionRoot>
    </div>
  </div>
</template>

<style>
.spinner {
  width: 56px;
  height: 56px;
  display: grid;
  animation: front-loader 4s infinite;
}

.spinner::before,
.spinner::after {
  content: "";
  grid-area: 1/1;
  border: 9px solid;
  border-radius: 50%;
  border-color: #474bff #474bff #0000 #0000;
  mix-blend-mode: darken;
  animation: front-loader 1s infinite linear;
}

.spinner::after {
  border-color: #0000 #0000 #dbdcef #dbdcef;
  animation-direction: reverse;
}

@keyframes front-loader {
  100% {
    transform: rotate(1turn);
  }
}
</style>
