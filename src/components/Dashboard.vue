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
  <div class="flex">
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
      <div
        v-if="validateOrder"
        class="fixed inset-0 flex items-center justify-center z-50"
      >
        <div
          class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full border border-spacing-1"
        >
          <p class="text-lg font-semibold text-gray-900">
            {{
              error.split(":")[2]
                ? "Success Order " + error.split(":")[2]
                : "Error"
            }}
          </p>
          <button
            @click="closePopup"
            class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
    <div class="p-2 w-full text-center">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold mb-4">Table Order</h1>
        <button
          @click="buyNumber"
          class="px-6 py-1 rounded-sm bg-green-400"
          type="button"
        >
          Buy
        </button>
      </div>
      <table class="min-w-full bg-white border border-gray-200">
        <thead>
          <tr class="w-full bg-gray-100 text-gray-700">
            <th class="py-2 px-4 border-b">ID</th>
            <th class="py-2 px-4 border-b">Number</th>
            <th class="py-2 px-4 border-b">Message</th>
            <th class="py-2 px-4 border-b">Time</th>
            <th class="py-2 px-4 border-b">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(product, index) in dataOrder"
            :key="index"
            class="hover:bg-gray-50"
          >
            <td class="py-2 px-4 border-b">{{ product.id }}</td>
            <td class="py-2 px-4 border-b">{{ product.number }}</td>
            <td class="py-2 px-4 border-b">
              {{ product.message ? product.message : "Loading..." }}
            </td>
            <td class="py-2 px-4 border-b">
              {{ Date.now() - product.timestamp }}
            </td>
            <td class="py-2 px-4 border-b">
              <button class="bg-green-400 rounded-full p-1 m-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-4 text-white"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>
              </button>
              <button
                @click="cancelOrder(product.id)"
                class="bg-red-400 rounded-full p-1 m-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-4 text-white"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
const key = localStorage.getItem("api_key");
const ListOrder = JSON.parse(localStorage.getItem("data"));
const data = ref(null);
const error = ref("");
const loading = ref(true);
const router = useRouter();
const country = ref(null);
const service = ref(null);
const provider = ref("any");
const showPopup = ref(false);
const dataOrder = ref([]);
const validateOrder = ref(false);
const logout = () => {
  localStorage.removeItem("api_key");
  router.push("/");
};
const closePopup = () => {
  showPopup.value = false;
  validateOrder.value = false;
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
const checkSms = async () => {
  try {
    console.log("check");
    const data = JSON.parse(localStorage.getItem("data"));
    dataOrder.value = data;
    const updatedData = await Promise.all(
      data.map(async (item) => {
        console.log(item.id);
        const GetStatus = await fetch(
          `/api/stubs/handler_api.php?api_key=${key}&action=getStatus&id=${item.id}`,
          {
            method: "GET",
          }
        ).then((res) => res.text());
        // return { ...item, message: GetStatus };
        return { ...item, message: GetStatus };
      })
    );

    dataOrder.value = updatedData;
    console.log(updatedData);
  } catch (error) {
    error.value = error.message;
  }
};
const cancelOrder = async (id) => {
  try {
    const response = await fetch(
      `/api/stubs/handler_api.php?api_key=${key}&action=setStatus&status=8&id=${id}`,
      {
        method: "GET",
      }
    ).then((res) => res.text());
    if (response.includes("ACCESS_CANCEL")) {
      const savedItems = localStorage.getItem("data");
      if (!savedItems) {
      } else {
        dataOrder.value = JSON.parse(savedItems);
        const filteredData = dataOrder.value.filter((item) => item.id !== id);
        localStorage.setItem("data", JSON.stringify(filteredData));
        dataOrder.value = filteredItems;
      }
    }
    console.log(response);
  } catch (error) {
    error.value = error.message;
  }
};
const balance = async () => {
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
};

const buyNumber = async () => {
  try {
    const apiKey = localStorage.getItem("api_key");
    const services = localStorage.getItem("service");
    const providers = localStorage.getItem("provider");
    const countrys = localStorage.getItem("country");

    if (!apiKey) {
      router.push("/");
      throw new Error("No API key found");
    }
    const buy = await fetch(
      `/api/stubs/handler_api.php?api_key=${apiKey}&action=getNumber&service=${services}&operator=${providers}&country=${countrys}`,
      {
        method: "GET",
      }
    ).then((res) => res.text());
    if (buy.includes("ACCESS_NUMBER")) {
      const GetStatus = await fetch(
        `/api/stubs/handler_api.php?api_key=${apiKey}&action=getStatus&id=${
          buy.split(":")[1]
        }`,
        {
          method: "GET",
        }
      ).then((res) => res.text());
      const dataBuy = {
        id: buy.split(":")[1],
        number: buy.split(":")[2],
        message: GetStatus,
        timestamp: Date.now(),
      };
      dataOrder.value.push(dataBuy);
      localStorage.setItem("data", JSON.stringify(dataOrder.value));
      error.value = buy;
    } else {
      error.value = buy;
    }
  } catch (error) {
    error.value = error.message;
  } finally {
    validateOrder.value = true;
  }
};

const mappedItems = () => {
  const savedItems = localStorage.getItem("data");
  if (!savedItems) {
  } else {
    dataOrder.value = JSON.parse(savedItems);
    const now = Date.now();
    const tenMinutes = 10 * 60 * 1000;
    const filteredItems = dataOrder.value.filter((value) => {
      return now - value.timestamp <= tenMinutes;
    });
    localStorage.setItem("data", JSON.stringify(filteredItems));
    dataOrder.value = filteredItems;
  }
};
let interval = null;
onMounted(() => {
  balance();
  mappedItems();
  checkSms();
  interval = setInterval(checkSms, 10000);
});
onBeforeUnmount(() => {
  if (interval) {
    clearInterval(interval);
  }
});
</script>
