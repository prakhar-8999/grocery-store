<script setup>
import { ref } from "vue";
import request from "../request";
const categoriesForApproval = ref([]);

const productForApproval = ref([]);

const getCategoriesForApproval = async () => {
  const { data, status } = await request("GET", "/approveCategory");
  if (status === 200) {
    categoriesForApproval.value = data;
  }
};
getCategoriesForApproval();
const getProductsForApproval = async () => {
  const { data, status } = await request("GET", "/approveProduct");
  if (status === 200) {
    productForApproval.value = data;
  }
};
getProductsForApproval();

const approveCategory = async (job, id) => {
  console.log(job, id);
  const { data, status } = await request(
    "POST",
    "/approveCategory",
    {},
    { catId: id, action: job }
  );
  if (status === 200) {
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: data.msg,
      showConfirmButton: false,
      timer: 1000,
    });
    getCategoriesForApproval();
  }
};

const approveProduct = async (job, id) => {
  const { data, status } = await request(
    "POST",
    "/approveProduct",
    {},
    { prodId: id, action: job }
  );
  if (status === 200) {
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: data.msg,
      showConfirmButton: false,
      timer: 1000,
    });
    getProductsForApproval();
  }
};
</script>

<template>
  <div>
    <p class="my-8 text-3xl font-semibold">Approve Categories</p>
    <div class="flex flex-col">
      <div class="-m-1.5 overflow-x-auto">
        <div class="p-1.5 min-w-full inline-block align-middle">
          <div class="overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Image
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase"
                  >
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  class="odd:bg-white even:bg-gray-100"
                  v-for="data in categoriesForApproval"
                >
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800"
                  >
                    <img
                      :src="data.image"
                      alt="Category Image"
                      style="width: 3cm; height: 3cm"
                    />
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {{ data.name }}
                  </td>

                  <td
                    class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium gap-x-10"
                  >
                    <div class="flex gap-x-10 justify-end">
                      <button
                        type="button"
                        @click="() => approveCategory('approve', data.id)"
                        class="text-blue-500 hover:text-blue-700"
                      >
                        Approve
                      </button>
                      <button
                        @click="() => approveCategory('reject', data.id)"
                        class="text-red-500 hover:text-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-if="categoriesForApproval.length === 0">
              <p class="text-center text-xl font-semibold text-gray-500 mt-8">
                No Categories for Approval
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="mt-36">
    <p class="my-8 text-3xl font-semibold">Approve Products</p>
    <div class="flex flex-col">
      <div class="-m-1.5 overflow-x-auto">
        <div class="p-1.5 min-w-full inline-block align-middle">
          <div class="overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Image
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Category
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                  >
                    Quantity
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase"
                  >
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr
                  class="odd:bg-white even:bg-gray-100"
                  v-for="data in productForApproval"
                >
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800"
                  >
                    <img
                      :src="data.image"
                      alt="Category Image"
                      style="width: 3cm; height: 3cm"
                    />
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {{ data.name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {{ data.category }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {{ data.price }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {{ data.quantity }}
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium gap-x-10"
                  >
                    <span class="flex gap-x-10 justify-end"
                      ><button
                        type="button"
                        class="text-blue-500 hover:text-blue-700"
                        @click="() => approveProduct('approve', data.id)"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        class="text-red-500 hover:text-red-700"
                        @click="() => approveProduct('reject', data.id)"
                      >
                        Reject
                      </button></span
                    >
                  </td>
                </tr>
              </tbody>
            </table>
            <div v-if="productForApproval.length === 0">
              <p class="text-center text-xl font-semibold text-gray-500 mt-8">
                No Products for Approval
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
