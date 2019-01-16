import { isEmpty } from "./utils";

const booleanValidate = (schema, values) => {
  const rules = Object.entries(schema);
  for (let i = 0; i < rules.length; i += 1) {
    const [name, rule] = rules[i];
    if (!rule.validate(values[name])) {
      return false;
    }
  }
  return true;
};

const msgValidate = (schema, values) => {
  const errors = {};
  Object.entries(schema).forEach(([name, rule]) => {
    const result = rule.validate(values[name], {
      message: true
    });
    if (result !== true) errors[name] = result;
  });
  return isEmpty(errors) ? null : errors;
};

export default schema => {
  function Validator() {}

  function validate(values, { message = false } = {}) {
    if (message) {
      return msgValidate(schema, values);
    }
    return booleanValidate(schema, values);
  }

  Object.entries(schema).forEach(([name, rule]) => {
    Validator.prototype[name] = rule;
  });

  Validator.prototype.validate = validate;

  return new Validator();
};
