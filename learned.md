**TESTING**
- Methods
- Server methods: server.use(), HttpResponse.error()
- getBy !== findBy (async)
- vi.fn() to mock functions
- extract render() method to a separated function so you dont have to retype all things like const {user, trigger, onChange} = renderComponent()
- _TESTING SELECT_: careful about testing button functions in a select HTML (default, having to click once to expose the options and THEN click to choose what you need - you cant directly simulate a click onto the desire option at the start - the testing lib emulates real human interactions)
- _TESTING INPUT_: e.g. Seach Box
- _TESTING IMAGES_: e.g. ProductImageGallery
- _TESTING LIBRARY COMPONENT_: Remember to check what kinda setup it needs to run (e.g: Toast component needs Toaster)
- _TESTING API_:
  + Replicate database (factory to produce mock products) with all queries methods (like a mock ORM just not typed - findFirst, where)
  + Importance of beforeAll (initialize server) and afterAll (clearServer)
  + Testing loading state + query lib
- _TESTING WITH PROVIDERS_: 
  + The order to which to wrap the provider goes from data to UI (Theme provider for Radix shall be the innermost if paired with ReactQuery QueryClient and CartProvider)
- _TESTING FORMS_: Same 2 steps: Rendering + user action
  +  Render:
    * Input fields
    * Default Values
    * Initial data
    * Drop-down options
  + User action:
    * Interaction between fields (checkbox enable/ disable UI)
    * Validation rules
    * Form submission
    * Form feedback & UX (Loading, toast...)
- _TESTING WITH CONTEXT/REDUX_:
  + As ALWAYS: Test the behavior, not the implementation
- _DEBUGGING CONSOLE_: 
  + Figure out what test is causing the warning (use .only)
- _TESTING AUTHENTICATION_:
  + Registration, log in, log out, change password, update profile data...
- _TESTING ROUTES_:
  + Route Setup, Invalid routes

**SETTING UP**

- Tests > Components + mocks(db+server+handler) + setup
- "test:ui": "vitest --ui" To get a comprehensive UI on how the test goes
- Check eslint + ts file to ensure typed test, promise linted correctly 
- A separate setup file (in tests folder) to include the import of testing library (so you dont have to re-import all the reusable fn phrases like describe, expect etc) => add into vitest config file
- Use fakerjs, msw to mock data + server
- "coverage": "vitest run --coverage" is insanely powerful to check if your tests are thorough

_OPTIONAL_:
- concurrently: "start": "concurrently \"npm run server\" \"npm run dev\"", to run both the backend and frontend
- Separated providers file that nested all the providers (auth, query, redux)
- Ctrl shift p => organize import
- Ctrl . => import ALL
- Shift - Alt - right arr: expand selection (or see dropdown selection in VScode => Quickly select codeblocks)
- Ctrl + End: Go to end of file
- Ctrl + Shift + \: Jump between matching brackets
- IMPORTANT: Ctrl click a letter inside a word will select the whole word
- npm un : uninstall packages
**Usual STEPS (methodically)**
- Loading state
- Error handling
- Data rendering 
- Logic flow: Arrange/ Act/ Assert
- Refactor(Group database thingy (even with db query) separately from render fn)


_Micro_:
- it.todo to write all the tests you had in mind
- it.skip to debug or focus on other tests first
- TDD: Write a failing test