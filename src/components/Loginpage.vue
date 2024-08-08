<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
      <h1 class="text-2xl font-bold text-center">Login</h1>
      <form @submit.prevent="login" class="space-y-4">
        <div>
          <label for="apikey" class="block text-sm font-medium text-gray-700"
            >API Key:</label
          >
          <input
            v-model="apikey"
            type="text"
            id="apikey"
            class="w-full p-2 mt-1 border border-gray-300 rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full py-2 font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
        >
          Login
        </button>
      </form>
      <div
        v-if="error"
        class="p-2 text-sm text-center text-red-500 bg-red-100 rounded-md"
      >
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const apikey = ref("");
const error = ref("");
const router = useRouter();
try {
  const keyValidate = localStorage.getItem("api_key");
  if (!keyValidate) {
    router.push("/");
  } else {
    router.push("/dashboard");
  }
} catch (error) {
  error.value = err.message;
}

const login = async () => {
  try {
    const response = await fetch(
      `/api/stubs/handler_api.php?api_key=${apikey.value}&action=getBalance`,
      { mode: "no-cors" }
    );
    const result = await response.text();
    console.log(result);
    if (result.startsWith("ERROR")) {
      throw new Error("Invalid API key");
    }
    localStorage.setItem("api_key", apikey.value);
    router.push("/dashboard");
  } catch (err) {
    error.value = err.message;
  }
};
</script>
