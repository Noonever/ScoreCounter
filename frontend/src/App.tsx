import './App.css';

import {
  createBrowserRouter, 
  Route, 
  Link, 
  createRoutesFromElements,
  RouterProvider
} from 'react-router-dom';

import RootLayout from './layouts/RootLayout';
import CreateLayout from './layouts/CreateLayout';

import Home from './pages/Home';
import Templates from './pages/Templates';
import NewTemplate from './pages/NewTemplate';

import DynamicFrom from './components/DymanicForm';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout/>}>
      <Route index element={<Home/>} />

      <Route path="/create" element={<CreateLayout/>}>
        <Route path="templates" element={<Templates/>} />
        <Route path="new-template" element={<NewTemplate></NewTemplate>} />
      </Route>
      
    </Route>
  )
)


function App() {
  return (
    <RouterProvider router={router}></RouterProvider>
  );
}

export default App;
