import {
  Form as VeeForm,
  Field as VeeField,
  defineRule,
  ErrorMessage,
  configure,
} from 'vee-validate';
import {
  required,
  alpha_spaces,
  email,
  min,
  max,
  confirmed,
  between,
} from '@vee-validate/rules';
export default {
  install(app) {
    app.component('VeeForm', VeeForm);
    app.component('VeeField', VeeField);
    app.component('ErrorMessage', ErrorMessage);

    defineRule('required', required);
    defineRule('song_required', required);
    defineRule('terms_required', required);
    defineRule('alpha_spaces', alpha_spaces);
    defineRule('min', min);
    defineRule('max', max);
    defineRule('email', email);
    defineRule('age_between', between);
    defineRule('passwords_mismatch', confirmed);

    configure({
      generateMessage(context) {
        const messages = {
          required: `The field ${context.field} is required.`,
          song_required: `The field song name is required.`,
          min: `The field ${context.field} is too short.`,
          max: `The field ${context.field} is too long.`,
          email: `The field ${context.field}  must be valid email.`,
          passwords_mismatch: `The passwords don't match.`,
          alpha_spaces: `The field ${context.field} can only include alphabets and spaces.`,
          age_between: 'Age should be between 10 to 100.',
          terms_required: 'You have to accept terms of service.',
        };
        const message = messages[context.rule.name]
          ? messages[context.rule.name]
          : `The field ${context.field} is invalid.`;
        return message;
      },
    });
  },
};
