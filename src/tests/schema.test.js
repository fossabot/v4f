import { Schema, Field } from "../index";

const valideData = {
  username: "username",
  password: "password",
  email: "xns@live.fr",
  isAdmin: true,
  url: "http://github.repo"
};

const notValideData = {
  username: "xns",
  password: "password",
  email: 3,
  isAdmin: "true"
};
const User = Schema({
  username: Field()
    .string({ message: "string" })
    .minLength(6, { message: "minLength" })
    .required({ message: "required" }),
  password: Field()
    .string({ message: "string" })
    .minLength(6, { message: "minLength" })
    .required({ message: "required" }),
  email: Field()
    .string({ message: "string" })
    .required({ message: "required" }),
  isAdmin: Field()
    .boolean({ message: "boolean" })
    .required({ message: "required" }),
  url: Field()
    .string({ message: "string" })
    .required({ message: "required" })
});

const Address = Schema({
  country: Field()
    .string({ message: "string" })
    .required({ message: "required" }),
  city: Field()
    .string({ message: "string" })
    .required({ message: "required" }),
  zipCode: Field()
    .number({ message: "number" })
    .between(75000, 90000, { message: "between" })
    .required({ message: "required" })
});

const Client = Schema({
  name: Field()
    .string({ message: "string" })
    .required({ message: "required" }),
  address: Address
});

test("Validate Schema with no options and valide data should be true", () => {
  expect(User.validate(valideData)).toBe(true);
});

test("Validate Schema with no options and not valide data should be false", () => {
  expect(User.validate(notValideData)).toBe(false);
});

test("Validate Schema with message options and valide data should be null", () => {
  expect(User.validate(valideData, { message: true })).toBe(null);
});

test("Validate Schema with message options and not valide data should be object...", () => {
  expect(User.validate(notValideData, { message: true })).toEqual({
    username: "minLength",
    email: "string",
    url: "string",
    isAdmin: "boolean"
  });
});

test("Validate nested schema with no options with valide data should be true", () => {
  expect(
    Client.validate({
      name: "client",
      address: { country: "france", city: "paris", zipCode: 75020 }
    })
  ).toBe(true);
});

test("Validate nested schema with options message true with not valide data should be object...", () => {
  expect(
    Client.validate(
      {
        name: 1,
        address: { country: null, city: "paris", zipCode: 750 }
      },
      { message: true }
    )
  ).toEqual({
    name: "string",
    address: { country: "string", zipCode: "between" }
  });
});

test("Validate nested schema with no options with not valide data should be false", () => {
  expect(
    Client.validate({
      name: "client",
      address: { country: null, city: "paris", zipCode: 750 }
    })
  ).toBe(false);
});

test("Validate one username Field of schema with no options with 'username' should be true ", () => {
  expect(User.username.validate("username")).toBe(true);
});

test("Validate one username Field of schema with no options with 'use' should be false ", () => {
  expect(User.username.validate("username")).toBe(true);
});

test("Validate one username Field of schema with options message true with 3 should be 'string'", () => {
  expect(User.username.validate(3, { message: true })).toBe("string");
});

test("Validate one Field of nested schema with no options with valide data should be true", () => {
  expect(Client.address.zipCode.validate(75020)).toBe(true);
});

test("Validate one Field of nested schema with no options with notValide data should be true", () => {
  expect(Client.address.zipCode.validate(20)).toBe(false);
});

test("Validate one Field of nested schema with message options and not valide data should be 'minLength'", () => {
  expect(Client.address.zipCode.validate(20, { message: true })).toBe(
    "between"
  );
});
