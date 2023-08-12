<script setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";
import request from "../request";

const state = ref({
  name: undefined,
  email: undefined,
  password: undefined,
  confirmPassword: undefined,
});

const signUp = async () => {
  const postData = {
    name: state.value.name,
    email: state.value.email,
    password: state.value.password,
    confirmPassword: state.value.confirmPassword,
  };
  if (state.value.password !== state.value.confirmPassword) {
    Swal.fire({
      title: "Error!",
      text: "Do you want to continue",
      icon: "error",
      confirmButtonText: "Cool",
    });
    return;
  }

  const { data, status } = await request("POST", "/register", {}, postData);
  if (status === 200) {
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: data.msg,
      showConfirmButton: false,
      timer: 1000,
    });
  }
};
</script>

<template>
  <div class="h-full bg-gray-100">
    <div class="flex h-full items-center py-16">
      <main class="w-full max-w-md mx-auto p-6">
        <div class="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm">
          <div class="p-4 sm:p-7">
            <div class="text-center">
              <h1 class="block text-2xl font-bold text-gray-800">Sign up</h1>
              <p class="mt-2 text-sm text-gray-600">
                Already have an account?
                <RouterLink
                  to="/Login"
                  class="text-blue-600 decoration-2 hover:underline font-medium"
                  >Sign in here</RouterLink
                >
              </p>
            </div>

            <div class="mt-5">
              <hr class="mb-6" />
              <!-- Form -->
              <div class="grid gap-y-4">
                <!-- Form Group -->
                <div>
                  <label for="name" class="block text-sm mb-2">Name</label>
                  <div class="relative">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Name"
                      v-model="state.name"
                      class="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-200 dark:border-gray-700 dark:text-gray-400"
                    />
                  </div>
                </div>
                <!-- End Form Group -->

                <!-- Form Group -->
                <div>
                  <label for="email" class="block text-sm mb-2"
                    >Email address</label
                  >
                  <div class="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Email"
                      v-model="state.email"
                      class="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-200 dark:border-gray-700 dark:text-gray-400"
                    />
                  </div>
                </div>
                <!-- End Form Group -->

                <!-- Form Group -->
                <div>
                  <label for="password" class="block text-sm mb-2"
                    >Password</label
                  >
                  <div class="relative">
                    <input
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Password"
                      v-model="state.password"
                      class="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-200 dark:border-gray-700 dark:text-gray-400"
                      required
                      aria-describedby="password-error"
                    />
                  </div>
                </div>
                <!-- End Form Group -->

                <!-- Form Group -->
                <div>
                  <label for="confirm-password" class="block text-sm mb-2"
                    >Confirm Password</label
                  >
                  <div class="relative">
                    <input
                      type="password"
                      id="confirm-password"
                      name="confirm-password"
                      placeholder="Confirm Password"
                      v-model="state.confirmPassword"
                      class="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-200 dark:border-gray-700 dark:text-gray-400"
                      required
                      aria-describedby="confirm-password-error"
                    />
                  </div>
                </div>
                <!-- End Form Group -->

                <!-- Checkbox -->
                <div class="flex items-center">
                  <div class="flex">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      class="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 pointer-events-none focus:ring-blue-500"
                    />
                  </div>
                  <div class="ml-3">
                    <label for="remember-me" class="text-sm"
                      >I accept the
                      <a
                        class="text-blue-600 decoration-2 hover:underline font-medium"
                        href="#"
                        >Terms and Conditions</a
                      ></label
                    >
                  </div>
                </div>
                <!-- End Checkbox -->

                <button
                  type="submit"
                  @click="signUp"
                  class="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm"
                >
                  Sign up
                </button>
              </div>
              <!-- End Form -->
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>
