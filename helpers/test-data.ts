import { faker } from '@faker-js/faker';

const PHONE_NUMBER = '0883883883';

export interface BillingInfo {
    firstname: string;
    lastname: string;
    company: string;
    country: string;
    streetaddress: string;
    apaddress: string;
    towncity: string;
    postcode: string;
    phone: string;
    email: string;
}

export interface RegistrationUser {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export function buildBillingInfo(overrides: Partial<BillingInfo> = {}): BillingInfo {
    return {
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        company: faker.company.name(),
        // Only Bulgaria is configured as a shipping zone in WooCommerce admin;
        // other countries fail with "No shipping method has been selected".
        country: 'BG',
        streetaddress: faker.location.streetAddress(),
        apaddress: faker.location.secondaryAddress(),
        towncity: faker.location.city(),
        postcode: faker.location.zipCode('####'),
        phone: PHONE_NUMBER,
        email: faker.internet.email(),
        ...overrides,
    };
}

export function buildRegistrationUser(overrides: Partial<RegistrationUser> = {}): RegistrationUser {
    return {
        username: faker.person.lastName(),
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        ...overrides,
    };
}
