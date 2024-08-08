<template>
  <nav class="bg-gray-800 text-white p-4">
    <div class="container mx-auto flex justify-between items-center">
      <div class="text-2xl font-bold">
        <router-link to="/" class="hover:text-gray-400"
          >SMSHUB CLONE</router-link
        >
      </div>
      <div v-if="data">
        <ul class="flex space-x-4">
          <li class="hover:text-gray-400 bg-gray-500 p-1 rounded-md">
            Balance : ${{ data.split(":")[1] }}
          </li>
          <button
            @click="logout"
            class="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-4 rounded"
          >
            Logout
          </button>
        </ul>
      </div>
      <div v-if="loading">
        <p>Loading ....</p>
      </div>
    </div>
  </nav>
  <div class="h-screen w-64 bg-gray-800 text-white p-4">
    <div class="text-2xl font-bold mb-4">Settings</div>
    <form @submit.prevent="saveSettings">
      <div class="mb-4">
        <label for="country" class="block mb-2">Country</label>
        <input
          type="text"
          id="country"
          v-model="country"
          class="w-full p-2 text-gray-800"
          required
        />
      </div>
      <div class="mb-4">
        <label for="service" class="block mb-2">Service</label>
        <input
          type="text"
          id="service"
          v-model="service"
          class="w-full p-2 text-gray-800"
          required
        />
      </div>
      <div class="mb-4">
        <label for="provider" class="block mb-2">Provider</label>
        <input
          type="text"
          id="provider"
          v-model="provider"
          class="w-full p-2 text-gray-800"
        />
      </div>
      <button
        type="submit"
        class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
      >
        Save
      </button>
      <button
        @click="reset"
        type="submit"
        class="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded mt-4"
      >
        Reset
      </button>
    </form>
    <div
      v-if="showPopup"
      class="fixed inset-0 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <p class="text-lg font-semibold text-gray-900">Save Success!</p>
        <button
          @click="closePopup"
          class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
const data = ref(null);
const error = ref("");
const loading = ref(true);
const router = useRouter();
const country = ref(null);
const service = ref(null);
const provider = ref(null);
const showPopup = ref(false);
const logout = () => {
  // Hapus item dari localStorage
  localStorage.removeItem("api_key");

  // Arahkan pengguna ke halaman login atau home
  router.push("/"); // Ganti '/login' dengan rute yang sesuai
};
const closePopup = () => {
  showPopup.value = false;
};
const saveSettings = () => {
  try {
    localStorage.setItem("country", country.value);
    localStorage.setItem("service", service.value);
    localStorage.setItem("provider", provider.value);
  } catch (error) {
    error.value = err.message;
  } finally {
    showPopup.value = true;
  }
};
const reset = () => {
  try {
    localStorage.removeItem("country");
    localStorage.removeItem("service");
    localStorage.removeItem("provider");
  } catch (error) {
    error.value = err.message;
  } finally {
    showPopup.value = true;
  }
};
onMounted(async () => {
  try {
    const apiKey = localStorage.getItem("api_key");
    if (!apiKey) {
      router.push("/");
      throw new Error("No API key found");
    }

    const response = await fetch(
      `/api/stubs/handler_api.php?api_key=${apiKey}&action=getBalance`,
      {
        method: "GET",
      }
    ).then((res) => res.text());

    if (response.includes("ACCESS_BALANCE")) {
      data.value = response;
    } else {
      router.push("/");
    }
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
});
</script>
