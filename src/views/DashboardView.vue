<script setup>
import { ref, toRaw, reactive } from "vue";
import request from "../request";
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/vue";

const isOpen = ref(false);
const isProductModalOpen = ref(false);
const isEdit = ref({ status: false, id: 0 });
const render = ref("loading");
const job = ref(0);
const allCategories = ref([
  // {
  //   id: 0,
  //   name: "Mobile phones",
  //   url: "https://images-cdn.ubuy.co.in/633b5984f8af8c7e5a371e0b-na-i13-pro-max-cell-phones-6-3-inch-hd.jpg",
  // },
]);
const catName = ref("");
const catUrl = ref("");
const singleProduct = reactive({
  name: undefined,
  url: undefined,
  price: undefined,
  description: undefined,
  unit: undefined,
  quantity: undefined,
});
const selectedCategory = ref("Select Category Name");
const products = ref([]);

function closeModal() {
  isOpen.value = false;
  isEdit.value.status = false;
  isEdit.value.id = 0;
  isProductModalOpen.value = false;
  singleProduct.description = undefined;
  singleProduct.name = undefined;
  singleProduct.price = undefined;
  singleProduct.quantity = undefined;
  singleProduct.unit = undefined;
  singleProduct.url = undefined;
  catName.value = undefined;
  catUrl.value = undefined;
}
function openModal(j = "") {
  if (j === "product") {
    isProductModalOpen.value = true;
  }
  isOpen.value = true;
}

const getUser = () => {
  render.value = localStorage.getItem("role");
};
getUser();

const getCategories = async () => {
  const { data, status } = await request("GET", "/addCategory");
  if (status === 200) {
    allCategories.value = data;
  }
};

const getSingleCategory = (id) => {
  isEdit.value.id = id;
  isEdit.value.status = true;
  openModal();
};
getCategories();

const changeJob = (jobValue) => {
  job.value = jobValue;
};

const addCategory = async (event) => {
  event.preventDefault();
  const { data, status } = await request(
    "POST",
    "/addCategory",
    {},
    {
      name: catName.value,
      url: catUrl.value,
    }
  );
  if (status === 200) {
    catName.value = "";
    catUrl.value = "";
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: data.msg,
      showConfirmButton: false,
      timer: 1000,
    });
    closeModal();
    getCategories();
  }
};

const editCategory = async (event) => {
  event.preventDefault();
  console.log("first");
  const { data, status } = await request(
    "PUT",
    "/editCategory",
    {},
    {
      id: isEdit.value.id,
      name: catName.value,
      url: catUrl.value,
    }
  );
  if (status === 200) {
    catName.value = "";
    catUrl.value = "";
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: data.msg,
      showConfirmButton: false,
      timer: 1000,
    });
    closeModal();
    getCategories();
  }
};

const getProducts = async (id) => {
  if (selectedCategory !== "Select Category Name") {
    const { data, status } = await request("GET", `/addProduct/${id}`);
    if (status === 200) {
      products.value = data;
    }
  }
};

const addProduct = async (event) => {
  event.preventDefault();
  if (selectedCategory === "Select Category Name") {
    Swal.fire({
      position: "center",
      icon: "error",
      title: "Please select product category",
    });
    return;
  }

  const { data, status } = await request(
    "POST",
    `/addProduct/${selectedCategory.value}`,
    {},
    { id: selectedCategory.value, ...singleProduct }
  );
  if (status === 200) {
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: data.msg,
      showConfirmButton: false,
      timer: 1000,
    });
    closeModal();
    getProducts(selectedCategory.value);
  }
};

const getSingleProduct = (id) => {
  const d = products.value.find((each) => each.id === id);
  singleProduct.name = d.name;
  singleProduct.description = d.description;
  singleProduct.price = d.price;
  singleProduct.quantity = d.quantity;
  singleProduct.unit = d.unit;
  singleProduct.url = d.url;
  isEdit.value.id = id;
  isEdit.value.status = true;
  openModal("product");
};

const editProduct = async (event) => {
  event.preventDefault();
  console.log("first");
  const { data, status } = await request(
    "PUT",
    "/editProduct",
    {},
    {
      id: isEdit.value.id,
      ...singleProduct,
    }
  );
  if (status === 200) {
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: data.msg,
      showConfirmButton: false,
      timer: 1000,
    });
    closeModal();
    getProducts(selectedCategory.value);
  }
};

const allProductsCategoryWise = ref([]);
const getAllProductsCategoryWise = async () => {
  if (localStorage.getItem("role") === "0") {
    const { data, status } = await request("GET", "/userDashboard");
    if (status === 200) {
      allProductsCategoryWise.value = data;
    }
  }
};
getAllProductsCategoryWise();
</script>

<template>
  <div
    class="flex h-full items-center justify-center"
    v-if="render === 'loading'"
  >
    <div class="spinner"></div>
  </div>

  <!-- Admin View -->
  <div v-if="render === '3'">
    <header class="text-gray-600 body-font bg-gray-100">
      <div
        class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center"
      >
        <a
          class="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            class="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
            ></path>
          </svg>
          <span class="ml-3 text-xl">Grocery Store</span>
        </a>
        <nav
          class="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center"
        >
          <span
            class="mr-5 hover:text-gray-900 cursor-pointer"
            @click="changeJob(0)"
            >Add Category</span
          >
          <span
            class="mr-5 hover:text-gray-900 cursor-pointer"
            @click="changeJob(1)"
            >Add Product</span
          >
        </nav>
        <button
          class="inline-flex items-center bg-blue-400 border-0 py-1 px-3 focus:outline-none hover:bg-blue-500 rounded text-base mt-4 md:mt-0"
        >
          Logout
          <svg
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            class="w-4 h-4 ml-1"
            viewBox="0 0 24 24"
          >
            <path d="M5 12h14M12 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
    </header>
    <div class="container mx-auto px-6">
      <div v-if="job === 0">
        <p class="my-8 text-3xl font-semibold">Add Categories</p>
        <div
          class="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-x-5 gap-y-4"
        >
          <div v-for="cat in allCategories">
            <div class="flex flex-col bg-white border shadow-sm rounded-xl">
              <div class="!w-64 !h-64">
                <img
                  class="rounded-t-xl"
                  style="width: 10cm"
                  :src="cat.url"
                  alt="Image Description"
                />
              </div>

              <div class="p-4 md:p-5">
                <h3 class="text-lg font-bold text-gray-800">{{ cat.name }}</h3>

                <button
                  type="button"
                  @click="getSingleCategory(cat.id)"
                  class="text-white mt-5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
          <div
            class="flex flex-col bg-white border shadow-sm rounded-xl cursor-pointer"
            style="height: 395px"
            @click="openModal"
          >
            <div class="flex h-full items-center justify-center">
              <div class="border shadow-sm rounded-xl py-4 px-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  style="fill: rgba(0, 0, 0, 1); transform: ; msfilter: "
                >
                  <path d="M15 2.013H9V9H2v6h7v6.987h6V15h7V9h-7z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- add category modal -->
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
                      v-if="!isEdit.status"
                      as="h3"
                      class="text-2xl font-medium leading-6 text-gray-900"
                    >
                      Add Category
                    </DialogTitle>
                    <DialogTitle
                      v-if="isEdit.status"
                      as="h3"
                      class="text-2xl font-medium leading-6 text-gray-900"
                    >
                      Update Category
                    </DialogTitle>
                    <hr
                      class="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700"
                    />
                    <form
                      @submit="
                        (event) =>
                          isEdit.status
                            ? editCategory(event)
                            : addCategory(event)
                      "
                    >
                      <div class="grid mt-8">
                        <div>
                          <label for="name" class="block text-sm mb-2"
                            >Category Name</label
                          >
                          <div class="relative">
                            <input
                              type="text"
                              id="name"
                              name="name"
                              v-model="catName"
                              placeholder="Category Name"
                              class="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-200 dark:border-gray-700 dark:text-gray-400"
                              required
                            />
                          </div>
                        </div>
                        <div class="mt-5">
                          <label for="url" class="block text-sm mb-2"
                            >Category Image Url</label
                          >
                          <div class="relative">
                            <textarea
                              id="url"
                              name="url"
                              v-model="catUrl"
                              class="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-200 dark:border-gray-700 dark:text-gray-400"
                              rows="3"
                              placeholder="Enter Category Image Url"
                              required
                            ></textarea>
                          </div>
                        </div>
                      </div>

                      <div class="mt-8" v-if="!isEdit.status">
                        <button
                          type="submit"
                          class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        >
                          Add Category
                        </button>
                      </div>
                      <div class="mt-8" v-if="isEdit.status">
                        <button
                          type="submit"
                          class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        >
                          Update Category
                        </button>
                      </div>
                    </form>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </Dialog>
        </TransitionRoot>
        <!-- add category modal -->
      </div>
      <div v-if="job === 1">
        <p class="my-8 text-3xl font-semibold">Add Products</p>
        <select
          class="py-2 px-3 pr-9 mb-8 block w-72 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500"
          v-model="selectedCategory"
          @change="(e) => getProducts(e.target.value)"
        >
          <option selected disabled>Select Category Name</option>
          <option v-for="cat in allCategories" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>

        <div
          class="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-x-5 gap-y-4"
        >
          <div v-for="p in products">
            <div class="flex flex-col bg-white border shadow-sm rounded-xl">
              <div class="!w-64 !h-64">
                <img
                  class="rounded-t-xl"
                  style="width: 10cm"
                  :src="p.url"
                  alt="Image Description"
                />
              </div>
              <div class="p-4 md:p-5">
                <div class="flex justify-between">
                  <h3 class="text-lg font-bold text-gray-800">{{ p.name }}</h3>
                  <h3 class="text-lg font-bold text-gray-800">
                    Quantity : {{ p.quantity }}
                  </h3>
                </div>
                <!-- <h3 class="text-lg font-bold text-gray-800">{{ p.name }}</h3> -->
                <p class="mt-1 text-gray-800 dark:text-gray-400">
                  {{ p.description }}
                </p>

                <button
                  type="button"
                  @click="getSingleProduct(p.id)"
                  class="text-white mt-5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
          <div
            class="flex flex-col bg-white border shadow-sm rounded-xl cursor-pointer"
            style="height: 360px"
            @click="() => openModal('product')"
          >
            <div class="flex h-full items-center justify-center">
              <div class="border shadow-sm rounded-xl py-4 px-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  style="fill: rgba(0, 0, 0, 1); transform: ; msfilter: "
                >
                  <path d="M15 2.013H9V9H2v6h7v6.987h6V15h7V9h-7z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- add Product modal -->
        <TransitionRoot appear :show="isProductModalOpen" as="template">
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
                      v-if="!isEdit.status"
                      as="h3"
                      class="text-2xl font-medium leading-6 text-gray-900"
                    >
                      Add Product
                    </DialogTitle>
                    <DialogTitle
                      v-if="isEdit.status"
                      as="h3"
                      class="text-2xl font-medium leading-6 text-gray-900"
                    >
                      Update Product
                    </DialogTitle>
                    <hr
                      class="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700"
                    />
                    <form
                      @submit="
                        (event) =>
                          isEdit.status ? editProduct(event) : addProduct(event)
                      "
                    >
                      <div class="grid mt-8">
                        <div>
                          <label for="name" class="block text-sm mb-2"
                            >Category Name</label
                          >
                          <div class="relative">
                            <input
                              type="text"
                              id="name"
                              name="name"
                              v-model="singleProduct.name"
                              placeholder="Category Name"
                              class="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-200 dark:border-gray-700 dark:text-gray-400"
                              required
                            />
                          </div>
                        </div>
                        <div class="mt-5">
                          <label for="url" class="block text-sm mb-2"
                            >Product Image Url</label
                          >
                          <div class="relative">
                            <textarea
                              id="url"
                              name="url"
                              v-model="singleProduct.url"
                              class="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-200 dark:border-gray-700 dark:text-gray-400"
                              rows="3"
                              placeholder="Enter Product Image Url"
                              required
                            ></textarea>
                          </div>
                        </div>
                        <div class="mt-5">
                          <label for="url" class="block text-sm mb-2"
                            >Product Description</label
                          >
                          <div class="relative">
                            <textarea
                              id="url"
                              name="url"
                              v-model="singleProduct.description"
                              class="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-200 dark:border-gray-700 dark:text-gray-400"
                              rows="3"
                              placeholder="Enter Product Description"
                              required
                            ></textarea>
                          </div>
                        </div>
                        <div class="mt-5">
                          <label for="price" class="block text-sm mb-2"
                            >Price</label
                          >
                          <div class="relative">
                            <input
                              type="number"
                              id="price"
                              name="price"
                              v-model="singleProduct.price"
                              placeholder="Product Price"
                              class="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-200 dark:border-gray-700 dark:text-gray-400"
                              required
                            />
                          </div>
                        </div>
                        <div class="mt-5">
                          <label for="quantity" class="block text-sm mb-2"
                            >Quantity</label
                          >
                          <div class="relative">
                            <input
                              type="number"
                              id="quantity"
                              name="quantity"
                              v-model="singleProduct.quantity"
                              placeholder="Product Quantiry"
                              class="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-200 dark:border-gray-700 dark:text-gray-400"
                              required
                            />
                          </div>
                        </div>
                        <div class="mt-5">
                          <label for="unit" class="block text-sm mb-2"
                            >Unit</label
                          >
                          <div class="relative">
                            <select
                              class="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-200 dark:border-gray-700 dark:text-gray-400"
                              v-model="singleProduct.unit"
                            >
                              <option selected>Select Product Unit</option>
                              <option value="kg">kg</option>
                              <option value="Nos">Nos</option>
                              <option value="litre">litre</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div class="mt-8" v-if="!isEdit.status">
                        <button
                          type="submit"
                          class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        >
                          Add Product
                        </button>
                      </div>
                      <div class="mt-8" v-if="isEdit.status">
                        <button
                          type="submit"
                          class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        >
                          Update Product
                        </button>
                      </div>
                    </form>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </Dialog>
        </TransitionRoot>
        <!-- add category modal -->
      </div>
    </div>
  </div>
  <!-- Admin View -->

  <div v-if="render === '0'">
    <header class="text-gray-600 body-font bg-gray-100">
      <div
        class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center"
      >
        <a
          class="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            class="w-10 h-10 text-white p-2 bg-indigo-500 rounded-full"
            viewBox="0 0 24 24"
          >
            <path
              d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
            ></path>
          </svg>
          <span class="ml-3 text-xl">Grocery Store</span>
        </a>
        <nav
          class="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center"
        >
          <span
            class="mr-5 hover:text-gray-900 cursor-pointer"
            @click="changeJob(0)"
            >Shop Here</span
          >
          <span
            class="mr-5 hover:text-gray-900 cursor-pointer"
            @click="changeJob(1)"
            >Your Cart</span
          >
        </nav>
        <button
          class="inline-flex items-center bg-blue-400 border-0 py-1 px-3 focus:outline-none hover:bg-blue-500 rounded text-base mt-4 md:mt-0"
        >
          Logout
          <svg
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            class="w-4 h-4 ml-1"
            viewBox="0 0 24 24"
          >
            <path d="M5 12h14M12 5l7 7-7 7"></path>
          </svg>
        </button>
      </div>
    </header>

    <div class="container px-6 mx-auto">
      <!-- Shop -->
      <div v-if="job === 0">
        <p class="my-8 text-3xl font-semibold">
          Category wise list of products
        </p>
        <div class="my-8">
          <input
            type="text"
            id="search"
            name="search"
            placeholder="Enter product to search..."
            class="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-200 dark:border-gray-700 dark:text-gray-400"
            required
            aria-describedby="email-error"
          />
        </div>
        <div v-for="item in allProductsCategoryWise">
          <p class="my-8 text-3xl font-semibold">
            {{ item.category }}
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-4 gap-x-6 gap-y-4">
            <div v-for="p in item.product">
              <div class="flex flex-col bg-white border shadow-sm rounded-xl">
                <div class="!w-64 !h-64">
                  <img
                    class="rounded-t-xl"
                    style="width: 10cm"
                    :src="p.url"
                    alt="Image Description"
                  />
                </div>
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
                    class="w-full text-white mt-5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>

          <hr class="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
        </div>
      </div>
      <!-- Shop -->

      <!-- Your Cart -->
      <div v-if="job === 1">lmakdnkasnd</div>
      <!-- Your Cart -->
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
