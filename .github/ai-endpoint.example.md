I am looking to extend this GTM NestJS API wrapper to include Accounts > User Permissions

API documentation: https://developers.google.com/tag-platform/tag-manager/api/reference/rest/v2/accounts.user_permissions 

Before starting the work you should create a branch `user-permissions` and ensure all development happens on that feature branch.

You should use `src/gtm/accounts/*` as a template

1. Create a new folder `src/gtm/accounts/userPermissions` for the new files
2. Create the `src/gtm/accounts/userPermissions/userPermissions.types.ts` using the response entities from the API documentation
3. Create the `src/gtm/accounts/userPermissions/userPermissions.mocks.ts` using the types and mock data, see other modules mock data for consistency 
4. Create the `src/gtm/accounts/userPermissions/userPermissions.dtos.ts` using the API request Query/Body data from the API documentation
5. Create the `src/gtm/accounts/userPermissions/userPermissions.service.ts` creating the actions for each endpoint in the API documentation, using the mocks, types, dtos etc, each endpoint should have a corresponding function
6. Create the `src/gtm/accounts/userPermissions/userPermissions.module.ts` for bringing everything together.
7. Create the `src/gtm/accounts/userPermissions/userPermissions.test.spec.ts` creating tests for each of the functions in the userPermissions.service.ts file, ensure the tests pass successfully.
8. Include the new `userPermissions.module` in the main `src/gtm/accounts/accounts.module.ts` file as an import
9. Add the new `userPermissions` model, service, types and DTOs as exports to the main `src/index.ts` file
10. Run lint and fix any linting issues
11. Run prettier 
12. Run build and make sure the application builds
13. Run the test suite to ensure tests still pass.
14. Create a PR for this new module from your feature branch to main using the Github CLI.