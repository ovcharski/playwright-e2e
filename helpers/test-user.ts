import dotenv from 'dotenv';

// Loaded here so the values exist wherever this module is imported: global
// setup, and the workers that inherit its environment.
dotenv.config({ quiet: true });

const username = process.env.TEST_USERNAME ?? '';

// The account every authenticated test runs as. Everything the suite knows
// about it lives here, so pointing .env at a different user is enough.
export const testUser = {
    username,
    password: process.env.TEST_PASSWORD ?? '',
    // The name the site shows for the account; set TEST_DISPLAY_NAME when
    // using a user other than the public demo one.
    displayName: process.env.TEST_DISPLAY_NAME ?? 'Automation User',
    // Ultimate Member builds the profile URL from the username.
    profilePath: `user/${username}/`,
};
