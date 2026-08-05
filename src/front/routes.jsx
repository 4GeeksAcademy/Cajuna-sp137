// Import necessary components and functions from react-router-dom.

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import { EmployeeList } from "./pages/EmployeeList";
import { EmployeeDetail } from "./pages/EmployeeDetail";
import { EmployeeCreate } from "./pages/EmployeeCreate";
import { EmployeeEdit } from "./pages/EmployeeEdit";
import { EmployeeDelete } from "./pages/EmployeeDelete";
import { MaterialList } from "./pages/MaterialList";
import { MaterialDetail } from "./pages/MaterialDetail";
import { MaterialCreate } from "./pages/MaterialCreate";
import { MaterialEdit } from "./pages/MaterialEdit";
import { MaterialDelete } from "./pages/MaterialDelete";
import { MaterialRequestList } from "./pages/MaterialRequestList";
import { MaterialRequestDetail } from "./pages/MaterialRequestDetail";
import { MaterialRequestCreate } from "./pages/MaterialRequestCreate";
import { MaterialRequestEdit } from "./pages/MaterialRequestEdit";
import { MaterialRequestDelete } from "./pages/MaterialRequestDelete";
import { CompanyCreate } from "./pages/CompanyCreate";
import { TimeEntryList } from "./pages/TimeEntryList";
import { TimeEntryCreate } from "./pages/TimeEntryCreate";
import { TimeEntryDetail } from "./pages/TimeEntryDetail";
import { TimeEntryEdit } from "./pages/TimeEntryEdit";
import { TimeEntryDelete } from "./pages/TimeEntryDelete";
import { VacationRequestList } from "./pages/VacationRequestList";
import { VacationRequestCreate } from "./pages/VacationRequestCreate";
import { VacationRequestDetail } from "./pages/VacationRequestDetail";
import { VacationRequestEdit } from "./pages/VacationRequestEdit";
import { VacationRequestDelete } from "./pages/VacationRequestDelete";
import { PermitRequestList } from "./pages/PermitRequestList";
import { PermitRequestCreate } from "./pages/PermitRequestCreate";
import { PermitRequestDetail } from "./pages/PermitRequestDetail";
import { PermitRequestEdit } from "./pages/PermitRequestEdit";
import { PermitRequestDelete } from "./pages/PermitRequestDelete";
import { MedicalLeaveRequestList } from "./pages/MedicalLeaveRequestList";
import { MedicalLeaveRequestCreate } from "./pages/MedicalLeaveRequestCreate";
import { MedicalLeaveRequestDetail } from "./pages/MedicalLeaveRequestDetail";
import { MedicalLeaveRequestEdit } from "./pages/MedicalLeaveRequestEdit";
import { MedicalLeaveRequestDelete } from "./pages/MedicalLeaveRequestDelete";

export const router = createBrowserRouter(
  createRoutesFromElements(
    // CreateRoutesFromElements function allows you to build route elements declaratively.
    // Create your routes here, if you want to keep the Navbar and Footer in all views, add your new routes inside the containing Route.
    // Root, on the contrary, create a sister Route, if you have doubts, try it!
    // Note: keep in mind that errorElement will be the default page when you don't get a route, customize that page to make your project more attractive.
    // Note: The child paths of the Layout element replace the Outlet component with the elements contained in the "element" attribute of these child paths.

    // Root Route: All navigation will start from here.
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >

      {/* Nested Routes: Defines sub-routes within the BaseHome component. */}
      <Route path="/" element={<Home />} />
      <Route path="/single/:theId" element={<Single />} />  {/* Dynamic route for single items */}
      <Route path="/demo" element={<Demo />} />
      <Route path="/employees" element={<EmployeeList />} />
      <Route path="/employees/new" element={<EmployeeCreate />} />
      <Route path="/employees/:id" element={<EmployeeDetail />} />
      <Route path="/employees/:id/edit" element={<EmployeeEdit />} />
      <Route path="/employees/:id/delete" element={<EmployeeDelete />} />

      <Route path="/materials" element={<MaterialList />} />
      <Route path="/materials/new" element={<MaterialCreate />} />
      <Route path="/materials/:id" element={<MaterialDetail />} />
      <Route path="/materials/:id/edit" element={<MaterialEdit />} />
      <Route path="/materials/:id/delete" element={<MaterialDelete />} />

      <Route path="/material-requests" element={<MaterialRequestList />} />
      <Route path="/material-requests/new" element={<MaterialRequestCreate />} />
      <Route path="/material-requests/:id" element={<MaterialRequestDetail />} />
      <Route path="/material-requests/:id/edit" element={<MaterialRequestEdit />} />
      <Route path="/material-requests/:id/delete" element={<MaterialRequestDelete />} />

      <Route path="/time-entries" element={<TimeEntryList />} />
      <Route path="/time-entries/new" element={<TimeEntryCreate />} />
      <Route path="/time-entries/:id" element={<TimeEntryDetail />} />
      <Route path="/time-entries/:id/edit" element={<TimeEntryEdit />} />
      <Route path="/time-entries/:id/delete" element={<TimeEntryDelete />} />

      <Route path="/companies/new" element={<CompanyCreate />} />

      <Route path="/vacation-requests" element={<VacationRequestList />} />
      <Route path="/vacation-requests/new" element={<VacationRequestCreate />} />
      <Route path="/vacation-requests/:id" element={<VacationRequestDetail />} />
      <Route path="/vacation-requests/:id/edit" element={<VacationRequestEdit />} />
      <Route path="/vacation-requests/:id/delete" element={<VacationRequestDelete />} />

      <Route path="/permit-requests" element={<PermitRequestList />} />
      <Route path="/permit-requests/new" element={<PermitRequestCreate />} />
      <Route path="/permit-requests/:id" element={<PermitRequestDetail />} />
      <Route path="/permit-requests/:id/edit" element={<PermitRequestEdit />} />
      <Route path="/permit-requests/:id/delete" element={<PermitRequestDelete />} />

      <Route path="/medical-leave-requests" element={<MedicalLeaveRequestList />} />
      <Route path="/medical-leave-requests/new" element={<MedicalLeaveRequestCreate />} />
      <Route path="/medical-leave-requests/:id" element={<MedicalLeaveRequestDetail />} />
      <Route path="/medical-leave-requests/:id/edit" element={<MedicalLeaveRequestEdit />} />
      <Route path="/medical-leave-requests/:id/delete" element={<MedicalLeaveRequestDelete />} />

    </Route>
  )
);