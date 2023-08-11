<script setup>
import { ref } from "vue";
import request from "../request";
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/vue";

const isOpen = ref(false);
const isEdit = ref({ status: false, id: 0 });
const render = ref("loading");
const job = ref(0);
const allCategories = ref([
  {
    name: "New Category 1",
    url: "https://cdn.pixabay.com/photo/2016/12/26/17/28/spaghetti-1932466_1280.jpg",
  },
  {
    name: "New Category 2",
    url: "https://cdn.pixabay.com/photo/2016/12/26/17/28/spaghetti-1932466_1280.jpg",
  },
]);
const category = ref({ name: undefined, url: undefined });
const selectedCategory = ref("Select Category Name");

function closeModal() {
  isOpen.value = false;
}
function openModal() {
  isOpen.value = true;
  category.value = { name: undefined, url: undefined };
}

const getUser = async () => {
  const { data, status } = await request("GET", "/user");
  if (status === 200) {
    render.value = "user";
  }
  render.value = "user";
};
getUser();

const getCategories = async () => {
  const { data, state } = await request("GET", "/getCategories");
  if (state === 200) {
    allCategories.value = data;
  }
};
getCategories();

const changeJob = (jobValue) => {
  job.value = jobValue;
};

const addCategory = async (e) => {
  e.preventDefault();
  const { data, status } = await request(
    "POST",
    "/addCategory",
    {},
    category.value
  );
  if (status === 200) {
    category.value = { name: undefined, url: undefined };
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: data.msg,
      showConfirmButton: false,
      timer: 1000,
    });
    closeModal();
  }
};
</script>

<template>
  <div
    class="flex h-full items-center justify-center"
    v-if="render === 'loading'"
  >
    <div class="spinner"></div>
  </div>
  <div v-if="render === 'user'">
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
        <p class="my-8 text-3xl font-semibold">Add Categorys</p>
        <div
          class="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-x-5 gap-y-4"
        >
          <div v-for="cat in allCategories">
            <div class="flex flex-col bg-white border shadow-sm rounded-xl">
              <img
                class="w-full h-auto rounded-t-xl"
                :src="cat.url"
                alt="Image
              Description"
              />
              <div class="p-4 md:p-5">
                <h3 class="text-lg font-bold text-gray-800">{{ cat.name }}</h3>

                <button
                  type="button"
                  class="text-white mt-5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
          <div
            class="flex flex-col bg-white border shadow-sm rounded-xl cursor-pointer"
            style="height: 373px"
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
                      as="h3"
                      class="text-2xl font-medium leading-6 text-gray-900"
                    >
                      Add Category
                    </DialogTitle>
                    <hr
                      class="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700"
                    />
                    <form @submit="addCategory">
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
                              v-model="category.name"
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
                              v-model="category.url"
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
          class="py-2 px-3 pr-9 block w-72 border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500"
          v-model="selectedCategory"
        >
          <option selected>Select Category Name</option>
          <option>1</option>
          <option>2</option>
          <option>3</option>
        </select>
      </div>
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
