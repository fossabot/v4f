import allRules from "./rules/index";
import { rulesWrapper, resolveArgs, isOptionalSuccess } from "./utils";

const isFail = (isRuleSuccess, apply, strict, values) =>
  strict
    ? apply && apply.validate(values) !== isRuleSuccess
    : apply && apply.validate(values) && !isRuleSuccess;

class Field {
  #rules = null;

  #not = null;

  constructor(rules = [], not = false) {
    this.#rules = rules;
    this.#not = not;
  }

  _clone() {
    return [this.#rules, this.#not];
  }

  get not() {
    return new Field([...this.#rules], true);
  }

  validate(value, { verbose = false, values = {}, strict = true } = {}) {
    for (let i = 0; i < this.#rules.length; i += 1) {
      const {
        name,
        rule,
        args,
        not,
        options: { apply, message }
      } = this.#rules[i];

      const isRuleSuccess = not !== rule(...resolveArgs(args, values), value);

      const isOptionalRule =
        name === "required" &&
        (not || (strict && apply && !apply.validate(values)));

      if (isOptionalRule) {
        if (isOptionalSuccess(value, this.#rules[i + 1].name)) {
          break;
        }
      } else if (
        (!isRuleSuccess && !apply) ||
        (name === "required" && !not && strict && apply && !isRuleSuccess) ||
        isFail(isRuleSuccess, apply, strict, values)
      ) {
        return verbose === true ? message : false;
      }
    }
    return true;
  }
}

export default rulesWrapper(allRules)(Field);
