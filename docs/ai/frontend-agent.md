This file defines mandatory coding and architectural rules for AI agents and must be followed strictly.
Impact Zone Frontend v2 — Agent Instructions

Project Overview

This is Impact Zone, a gym/fitness club management PWA built with React 19. It handles members, plans, calendars, check-ins, point-of-sale, settings, reports, and dashboards with real-time
updates via Socket.IO.

Tech Stack

- Framework: React 19.1.1 (functional components only, no class components)
- Build: Vite 7.1.2 with SWC — dev server runs on port 5175, output dir is build/
- State: Redux Toolkit 2.9.0 (slices + plain async action creators — NOT createAsyncThunk)
- Routing: React Router DOM 7.8.2 (BrowserRouter, nested routes, lazy loading with Suspense)
- UI Library: PrimeReact 10.9.7 (theme: lara-light-blue), PrimeFlex 4.0.0 for grid/utilities
- Styling: SCSS with CSS custom properties + PrimeFlex utility classes + Styled Components for dynamic styles
- HTTP: Axios 1.11.0 with custom instance and interceptors
- Real-time: Socket.IO Client 4.8.1
- Icons: PrimeIcons (pi pi-_) and Bootstrap Icons (bi bi-_)
- Font: Manrope (Google Fonts, weights: 400, 500, 600, 700)
- Date: Moment.js 2.30.1
- No TypeScript. No testing framework. No Formik/React Hook Form.

Path Aliases (configured in vite.config.js)

Always use these aliases for imports — never use deep relative paths when an alias exists:

@assets → src/assets
@store → src/store
@services → src/services
@api → src/services/api
@endPoints → src/services/endPoints
@shared → src/shared
@inputs → src/shared/inputs
@buttons → src/shared/buttons
@utils → src/utils
@views → src/views
@formValidations → src/utils/formValidations
@socket → src/sockets/SocketContext.jsx

Directory Structure

src/
├── assets/ # Images, SVGs, Lottie JSON animations
├── components/ # App-level components (Toast, Auth windows, GlobalSearch, etc.)
├── hooks/ # Custom hooks (useCreditCard, useCurrencyFormatter)
├── layout/ # Topbar, RecentCheckIn, main layout shell
├── pages/ # Public pages (Login, ForgetPassword, NotFound)
├── routes/ # Route config: PrivateRoutes/ (per feature), ProtectedRoutes.jsx
├── services/ # API layer
│ ├── api.js # Generic API wrapper (default export)
│ ├── axiosInstance.js # Axios instance with auth interceptors
│ ├── auth.js # Token storage (localStorage/sessionStorage)
│ └── endPoints/ # Endpoint constants grouped by module (index.js barrel)
├── shared/ # Reusable UI components
│ ├── inputs/ # 27 custom form inputs (CustomInput, CustomDropdown, etc.)
│ ├── buttons/ # PrimaryButton, PrimaryButtonSmall
│ ├── overlays/ # CustomConfirmDialog, CustomDialog
│ ├── table/ # CustomTable (wraps PrimeReact DataTable)
│ ├── layout/ # ListPageLayout, FormPageLayout, DetailsPageLayout
│ ├── cards/ # CustomCard, CustomListItem, CustomGridLayout
│ ├── calendar/ # FullCalendar wrapper
│ ├── tabView/ # Tab components
│ ├── sidebar/ # Sidebar navigation
│ ├── skeletons/ # Loading skeleton components
│ ├── pageBuilder/ # GrapesJS integration
│ └── ... # accordion, tree, animations, context, etc.
├── sockets/ # socket.js (config), SocketContext.jsx, SocketListener.jsx
├── store/ # Redux slices organized by feature domain
├── styles/ # Global SCSS: variables.scss, layout/, components/, pages/
├── utils/ # Helpers: common.js, dateTime.js, regex.js, formValidations.js,
│ # permissions.js (DO NOT EDIT), javascript.js, constants.js,
│ # dropdownConstants.js, taxHelpers.js, planHelpers.js, fileHelper.js
└── views/ # Feature modules: Dashboard, CheckIn, Members, Calendar, # Plans, PointOfSale, Reports, Settings, More

Naming Conventions

- Component files: PascalCase .jsx (e.g., CustomInput.jsx, MemberForm.jsx)
- Utility/service files: camelCase .js (e.g., formValidations.js, memberActions.js)
- SCSS files: underscore prefix for partials (\_button.scss, \_sidebar.scss)
- Variables/functions: camelCase (setLoading, handleChange, getMembers)
- Constants: UPPER_SNAKE_CASE (TOKEN_KEY, ACCESS_TOKEN_KEY)
- Redux slices: camelCase with Slice suffix (memberSlice.js, commonSlice.js)
- Redux actions: camelCase with Actions suffix (memberActions.js, taskActions.js)
- Boolean variables: prefix with is/has (isLoading, isForbidden, isAuthenticated)
- Database IDs: always \_id (MongoDB convention)
- Components export: export default for components, named exports for utilities

API Layer Pattern

All API calls go through a single wrapper. Never call axios directly from components.

import api from "@api";
import endPoints from "@endPoints";

// Signature: api(method, url, data?, params?, contentType?)
const res = await api("get", endPoints.MEMBER.MEMBER);
const res = await api("post", endPoints.MEMBER.MEMBER, payload);
const res = await api("put", endPoints.MEMBER.MEMBER + id, payload);
const res = await api("delete", endPoints.MEMBER.MEMBER + id);

Response shape (always):
{ success: boolean, message: string, data: any, meta: any, formErrors: object|null, status: number }

The API wrapper automatically:

- Attaches Authorization: Bearer <token> header
- Attaches x-access-token header for special access
- Sends club header from localStorage
- Dispatches common/setIsForbidden on 403
- Dispatches common/setIsUnAuthenticated on 401
- Scrolls to #error-element when formErrors exist

Endpoints are defined as constants in src/services/endPoints/ and exported via barrel index.js. When adding new endpoints, add them to the relevant module file and re-export from index.js.

Redux Pattern

Slice (src/store/<feature>/<feature>Slice.js):
import { createSlice } from "@reduxjs/toolkit";

const initialState = { items: [] };

const featureSlice = createSlice({
name: "feature",
initialState,
reducers: {
setItems(state, action) {
state.items = action.payload;
},
},
});

export const { setItems } = featureSlice.actions;
export default featureSlice.reducer;

Actions (src/store/<feature>/<feature>Actions.js):

- Plain async thunks (return (dispatch) => async ...), NOT createAsyncThunk
- Accept setLoading callback and next callback as parameters
- Call api(), dispatch slice setters on success, call next(data, formErrors) pattern

import api from "@api";
import endPoints from "@endPoints";
import { setItems } from "./featureSlice";

const getItems = (setLoading) => async (dispatch) => {
if (setLoading) setLoading(true);
const res = await api("get", endPoints.FEATURE.ITEMS);
if (res.success) {
dispatch(setItems(res.data));
}
if (setLoading) setLoading(false);
};

const addItem = (data, setLoading, next) => async (dispatch) => {
setLoading(true);
const res = await api("post", endPoints.FEATURE.ITEMS, data);
if (res.success) {
next(true, null);
} else {
next(null, res.formErrors);
}
setLoading(false);
};

Store registration: After creating a new slice, register it in src/store/index.js.

Form Handling Pattern

Forms use manual useState + the custom formValidation system. Do not introduce Formik or React Hook Form.

import formValidation, { showFormErrors } from "@formValidations";

const [data, setData] = useState({
name: "",
email: "",
formErrors: {}, // Always include formErrors in state
});

const handleChange = ({ name, value }) => {
let formErrors = formValidation(name, value, data);
setData((prev) => ({ ...prev, [name]: value, formErrors }));
};

const handleSubmit = () => {
if (showFormErrors(data, setData)) {
// validation passed — proceed with API call
dispatch(addItem(data, setLoading, handleNext));
}
};

Key rules:

- formValidation() validates on change (field-level)
- showFormErrors() validates all fields on submit (returns true if valid)
- showFormErrors accepts an optional ignore array for fields to skip
- showFormErrors accepts an optional required array for required-only mode
- New field names must be added to the appropriate array in formValidations.js (textFields, numberFields, selectFields, multiSelectFields) or handled as a new case

Component Pattern

All components are functional with hooks. Many use React.memo().

Form inputs — always use the custom shared inputs, never raw PrimeReact inputs:
import CustomInput from "@inputs/CustomInput";
import CustomDropdown from "@inputs/CustomDropdown";
import CustomForm from "@inputs/CustomForm";

  <CustomForm onSubmit={handleSubmit}>
    <CustomInput data={data} onChange={handleChange} name="firstName" />
    <CustomDropdown data={data} onChange={handleChange} name="type" options={options} />
  </CustomForm>

All custom inputs wrap InputLayout which handles labels, error display, and loading skeletons.

Layout wrappers — use from @shared:

- ListPageLayout — for list/table views with search and action buttons
- FormPageLayout — for form pages (wraps with FormPageContext)
- DetailsPageLayout — for detail views

Tables — use CustomTable from @shared/table/, not raw PrimeReact DataTable.

Dialogs — use CustomDialog / CustomConfirmDialog from @shared/overlays/.

Styling Rules

- Use SCSS with CSS custom properties from src/styles/variables.scss
- Use PrimeFlex utility classes for layout (flex, gap-2, justify-content-between, p-3, c-col-12, md:c-col-6)
- Component-specific styles go in src/styles/components/ or src/styles/pages/
- Import new SCSS partials in src/styles/global.scss
- Do not use Tailwind CSS. PrimeFlex is the utility framework here.
- Use styled-components only for dynamic/JS-driven styles, not for static layouts

Color variables (use these, don't hardcode):
--primary-color: #252b42
--text-color-primary: #525252
--text-color-secondary: #777777
--highlight-bg: #f2f5fe
--color-success: #28a745
--color-warning: #ffc107
--color-danger: #dc3545
--color-info: #17a2b8
--border-color: #d1d5db

Routing Rules

- Public routes defined in src/App.jsx (/login, /forgot-password, /404)
- Protected routes defined in src/routes/PrivateRoutes/ — one file per feature module
- Route guard: src/routes/ProtectedRoutes.jsx checks isAuthenticated()
- Use React.lazy() + Suspense for route-level code splitting
- When adding a new route section, create a file in PrivateRoutes/ and import in the main routes config

Authentication

- JWT tokens stored in localStorage (remember me) or sessionStorage
- Functions in src/services/auth.js: authenticate(), isAuthenticated(), logout(), authenticateAccess(), isAuthenticatedAccess(), clearAuthenticatedAccess()
- Special access uses a separate app_token_access key with JWT expiration checking
- Never modify the auth interceptor pattern — it auto-attaches tokens

Real-time (Socket.IO)

- Socket config: src/sockets/socket.js (WebSocket transport, 5 reconnect attempts, 2s delay)
- Context: src/sockets/SocketContext.jsx — use useSocket() hook to access
- Global listener: src/sockets/SocketListener.jsx — listens for db:create, db:update, db:delete
- Socket connects manually (not auto-connect)

Toast Notifications

Two systems available:
// Redux-managed (PrimeReact Toast) — preferred
import { setToast } from "@store/common/commonSlice";
dispatch(setToast({ title: "Success", description: "Item saved", type: "success", life: 3000 }));

// react-hot-toast — for promise-based
import toast from "react-hot-toast";
toast.promise(promise, { loading: "Saving...", success: "Saved!", error: "Failed" });

Environment Variables

All prefixed with VITE* (Vite requirement). Access via import.meta.env.VITE*\*.

VITE_API_BASE_URL # Backend API URL
VITE_SOCKET_URL # Socket.IO server URL
VITE_AUTHORIZE_ENVIRONMENT # Authorize.net env (SANDBOX/PRODUCTION)
VITE_AUTHORIZE_CLIENT_KEY # Authorize.net client key
VITE_AUTHORIZE_API_LOGIN_ID # Authorize.net login ID

Critical Do-Nots

1. Do NOT edit src/utils/permissions.js — it is marked "Don't touch"
2. Do NOT use class components — this codebase is 100% functional + hooks
3. Do NOT use Tailwind — PrimeFlex is the utility framework
4. Do NOT use createAsyncThunk — actions use plain async thunks (dispatch) => async ...
5. Do NOT use raw PrimeReact inputs — always use the Custom wrappers from @inputs
6. Do NOT call axios directly — always use api() from @api
7. Do NOT use relative imports when an alias exists (e.g., use @store not ../../store)
8. Do NOT introduce new state management (no Zustand, MobX, etc.) — use Redux Toolkit slices
9. Do NOT introduce Formik or React Hook Form — use the existing formValidation system
10. Do NOT hardcode colors — use SCSS CSS variables from variables.scss

Adding a New Feature (Checklist)

1. Create view components in src/views/<FeatureName>/
2. Create Redux slice in src/store/<feature>/<feature>Slice.js
3. Create Redux actions in src/store/<feature>/<feature>Actions.js
4. Register slice in src/store/index.js
5. Add endpoint constants in src/services/endPoints/<feature>.js and re-export from index.js
6. Add routes in src/routes/PrivateRoutes/<feature>Routes.js
7. Import routes in the main private routes config
8. Use shared components (CustomInput, CustomTable, ListPageLayout, etc.)
9. Add SCSS in src/styles/ if needed, import in global.scss
