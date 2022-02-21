<template>
  <div
    class="text-white text-center font-bold p-5 mb-4"
    v-if="loginShowAlert"
    :class="loginAlertVarient"
  >
    {{ loginAlertMsg }}
  </div>
  <vee-form @submit="handleLogin" :validation-schema="loginSchema">
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <vee-field
        type="email"
        name="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Email"
      />
      <ErrorMessage class="text-red-600" name="email" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <vee-field
        type="password"
        name="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Password"
      />
      <ErrorMessage class="text-red-600" name="password" />
    </div>
    <button
      type="submit"
      :disabled="loginInSubmition"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
    >
      Submit
    </button>
  </vee-form>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loginSchema: {
        email: 'required|email',
        password: 'required|min:8|max:30',
      },
      loginInSubmition: false,
      loginShowAlert: false,
      loginAlertVarient: 'bg-blue-500',
      loginAlertMsg: '',
    };
  },
  methods: {
    handleLogin(values) {
      this.loginShowAlert = true;
      this.loginInSubmition = true;
      this.loginAlertVarient = 'bg-blue-500';
      this.loginAlertMsg = 'Please wait! authenticating credentials.';

      setTimeout(() => {
        this.loginAlertVarient = 'bg-green-500';
        this.loginAlertMsg = 'Success! logging in.';
        setTimeout(() => {
          this.loginShowAlert = false;
          this.loginInSubmition = false;
        }, 1000);
        console.log(values);
      }, 5000);
    },
  },
};
</script>
