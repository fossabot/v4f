type Options = {
  message: string;
};

type Rules = {
  required(options: Options): Rules;
  equals(value: any, options: Options): Rules;
};

type IteratorRules<T = StringRules | ArrayRules> = {
  min(value: Number, options: Options): IteratorRules<T> & Rules & T;
  max(value: Number, options: Options): IteratorRules<T> & Rules & T;
  lengthEquals(value: Number, options: Options): IteratorRules<T> & Rules & T;
  lengthBetween(
    min: Number,
    max: Number,
    options: Options
  ): IteratorRules<T> & Rules & T;
};

type NumberRules = {
  between(min: Number, max: Number, options: Options): NumberRules & Rules;
};

type StringRules = {
  startsWith(
    startValue: String,
    options: Options
  ): StringRules & Rules & IteratorRules<StringRules>;
  endsWith(
    endValue: String,
    options: Options
  ): StringRules & Rules & IteratorRules<StringRules>;
};

type ArrayRules = {};

type NumberRules = {
  between(min: Number, max: Number, options: Options): NumberRules & Rules;
};

type BaseRules = {
  string(options: Options): StringRules & IteratorRules<StringRules> & Rules;
  number(options: Options): Rules;
  boolean(options: Options): Rules;
  object(options: Options): Rules;
};
type TypeSchema = {
  validate(values: Object, options: Options): Object | Boolean;
};

export function field(): BaseRules;
export function typeSchema(schema: Object): BaseRules;
