<template>
  <div
    class="text-white text-center font-bold p-5 mb-4"
    v-if="regShowAlert"
    :class="regAlertVarient"
  >
    {{ regAlertMsg }}
  </div>
  <vee-form
    @submit="handleRegister"
    :validation-schema="schema"
    :initial-values="userData"
  >
    <!-- Name -->
    <div class="mb-3">
      <label class="inline-block mb-2">Name</label>
      <vee-field
        type="text"
        name="name"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Name"
      />
      <ErrorMessage class="text-red-600" name="name" />
    </div>
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
    <!-- Age -->
    <div class="mb-3">
      <label class="inline-block mb-2">Age</label>
      <vee-field
        type="number"
        name="age"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      />
      <ErrorMessage class="text-red-600" name="age" />
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <vee-field name="password" :bails="false" v-slot="{ field, errors }">
        <input
          type="password"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          placeholder="Password"
          v-bind="field"
        />
        <span class="text-red-600 block" v-for="error in errors" :key="error">
          {{ error }}
        </span>
      </vee-field>
    </div>
    <!-- Confirm Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Confirm Password</label>
      <vee-field
        type="password"
        name="confirm_password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Confirm Password"
      />
      <ErrorMessage class="text-red-600" name="confirm_password" />
    </div>
    <!-- Country -->
    <div class="mb-3">
      <label class="inline-block mb-2">Country</label>
      <vee-field
        as="select"
        name="country"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      >
        <option value="" disabled>Choose Country</option>
        <option value="USA">USA</option>
        <option value="Mexico">Mexico</option>
        <option value="Germany">Germany</option>
      </vee-field>
      <ErrorMessage class="text-red-600" name="country" />
    </div>
    <!-- TOS -->
    <div class="mb-3 pl-6">
      <vee-field
        name="terms"
        type="checkbox"
        :value="true"
        class="w-4 h-4 float-left -ml-6 mt-1 rounded"
      />
      <label class="inline-block">Accept terms of service</label>
      <ErrorMessage class="block text-red-600" name="terms" />
    </div>
    <button
      type="submit"
      :disabled="regInSubmition"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
    >
      Submit
    </button>
  </vee-form>
</template>

<script>
import { mapActions } from 'vuex';
export default {
  name: 'Register',
  data() {
    return {
      schema: {
        name: 'required|alpha_spaces|min:3|max:100',
        email: 'required|email',
        password: 'required|min:8|max:30',
        confirm_password: 'passwords_mismatch:@password',
        age: 'required|age_between:10,100',
        country: 'required',
        terms: 'terms_required',
      },
      userData: {
        country: 'USA',
      },
      regInSubmition: false,
      regShowAlert: false,
      regAlertVarient: 'bg-blue-500',
      regAlertMsg: '',
    };
  },
  methods: {
    ...mapActions(['registerUser']),
    async handleRegister(values) {
      //Initialize Register
      this.regShowAlert = true;
      this.regInSubmition = true;
      this.regAlertVarient = 'bg-blue-500';
      this.regAlertMsg = 'Please wait! your account is being created.';

      //Registering User with firebase authentication

      try {
        await this.registerUser(values);
        // await this.$store.dispatch('registerUser', values);
      } catch (err) {
        this.regInSubmition = false;
        this.regAlertVarient = 'bg-red-500';
        this.regAlertMsg =
          'An unexpected error occured. Please try again later.';
        console.log('ERROR', err);
        return;
      }
      //Storing User Details in firestore
      this.regAlertVarient = 'bg-green-500';
      this.regAlertMsg = 'Success! your account is created.';
      this.regShowAlert = false;
      this.regInSubmition = false;
      window.location.reload();
    },
  },
};
</script>
