<script setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";
import request from "../request";
import router from "../router";

const state = ref({
  email: undefined,
  password: undefined,
});

const Login = async (e) => {
  e.preventDefault();
  const postData = {
    email: state.value.email,
    password: state.value.password,
  };
  console.log(postData);
  const { data, status } = await request("POST", "/login", {}, postData);
  if (status === 200) {
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: data.msg,
      showConfirmButton: false,
      timer: 1000,
    });
    localStorage.setItem("role", data.role);
    router.push({ path: "dashboard" });
  }
};
</script>

<template>
  <div class="bg-gray-100 flex h-full items-center py-16">
    <main class="w-full max-w-md mx-auto p-6">
      <div class="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm">
        <div class="p-4 sm:p-7">
          <div class="text-center">
            <h1 class="block text-2xl font-bold text-gray-800">Sign in</h1>
            <p class="mt-2 text-sm text-gray-600">
              Don't have an account yet?
              <RouterLink
                to="/"
                class="text-blue-600 decoration-2 hover:underline font-medium"
                >Sign up here</RouterLink
              >
            </p>
          </div>

          <div class="mt-5">
            <hr class="mb-6" />

            <!-- Form -->
            <form @submit="Login">
              <div class="grid gap-y-4">
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
                      v-model="state.email"
                      placeholder="Email"
                      class="py-3 px-4 block w-full border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-200 dark:border-gray-700 dark:text-gray-400"
                      required
                      aria-describedby="email-error"
                    />
                  </div>
                </div>
                <!-- End Form Group -->

                <!-- Form Group -->
                <div>
                  <div class="flex justify-between items-center">
                    <label for="password" class="block text-sm mb-2"
                      >Password</label
                    >
                    <p
                      class="text-sm cursor-pointer text-blue-600 decoration-2 hover:underline font-medium"
                    >
                      Forgot password?
                    </p>
                  </div>
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
                  <p
                    class="hidden text-xs text-red-600 mt-2"
                    id="password-error"
                  >
                    8+ characters required
                  </p>
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
                    <label for="remember-me" class="text-sm">Remember me</label>
                  </div>
                </div>
                <!-- End Checkbox -->

                <button
                  type="submit"
                  class="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm"
                >
                  Sign in
                </button>
              </div>
            </form>
            <!-- End Form -->
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
