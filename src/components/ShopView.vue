<script setup>
import { ref } from "vue";
import request from "../request";

const allProductsCategoryWise = ref([]);
const searchArray = ref([]);
const loading = ref(true);
const getAllProductsCategoryWise = async () => {
  loading.value = true;
  if (localStorage.getItem("role") === "0") {
    const { data, status } = await request("GET", "/userDashboard");
    if (status === 200) {
      allProductsCategoryWise.value = data;
      searchArray.value = data;
    }
  }
  loading.value = false;
};
getAllProductsCategoryWise();

const addToCart = async (id) => {
  console.log(allProductsCategoryWise.value);
  const { data, status } = await request(
    "POST",
    "/addToCart",
    {},
    { product: id }
  );
  if (status === 200) {
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: data.msg,
      showConfirmButton: false,
      timer: 1500,
    });
  }
};

const performSearch = (value) => {
  const data = allProductsCategoryWise.value.filter(
    (each) => !each.category.toLowerCase().indexOf(value.toLowerCase())
  );
  searchArray.value = data;
};
</script>

<template>
  <div class="flex h-full items-center justify-center mt-72" v-if="loading">
    <div class="spinner"></div>
  </div>
  <div v-if="!loading">
    <p class="my-8 text-3xl font-semibold">Category wise list of products</p>
    <div class="my-8">
      <input
        type="text"
        id="search"
        name="search"
        placeholder="Search Category..."
        v-on:input="(e) => performSearch(e.target.value)"
        class="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-200 dark:border-gray-700 dark:text-gray-400"
        required
        aria-describedby="email-error"
      />
    </div>
    <div v-for="item in searchArray">
      <p class="my-8 text-3xl font-semibold">
        {{ item.category }}
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-4 gap-x-6 gap-y-4">
        <div v-for="p in item.product">
          <div
            class="flex flex-col flex-[1_0_0%] bg-white border shadow-sm rounded-xl"
          >
            <img
              class="rounded-t-xl"
              style="width: 100%; height: 8cm"
              :src="p.url"
              alt="Image Description"
            />
            <div class="p-4 md:p-5">
              <div class="flex justify-between">
                <h3 class="text-lg font-bold text-gray-800">
                  {{ p.name }}
                </h3>
                <h3 class="text-lg font-bold text-gray-800">
                  price : {{ p.price }}
                </h3>
              </div>
              <!-- <h3 class="text-lg font-bold text-gray-800">{{ p.name }}</h3> -->
              <p class="mt-1 text-gray-800 dark:text-gray-400">
                {{ p.description }}
              </p>
              <button
                type="button"
                @click="() => addToCart(p.id)"
                class="w-full text-white mt-5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
              >
                Add To Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
    </div>
  </div>
</template>
