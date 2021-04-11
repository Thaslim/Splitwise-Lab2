import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import { Provider } from 'react-redux';
import Login from './components/user/Login';
import Signup from './components/user/Signup';
import Landing from './components/landingPage/Landing';
import Navbar from './components/landingPage/Navbar';
import Profile from './components/user/Profile';
import CreateGroup from './components/groups/CreateGroup';
import PrivateRoute from './components/routing/PrivateRoute';
import DashboardLayout from './components/dashboard/DashboardLayout';
import Dashboard from './components/dashboard/Dashboard';
import Groups from './components/dashboard/Groups';
import EditGroup from './components/dashboard/EditGroup';
// Redux
import store from './store';
import Alert from './components/landingPage/Alert';
import { loadUser } from './actions/auth';
import setToken from './utils/setToken';
import MyGroups from './components/dashboard/MyGroups';
import RecentActivity from './components/dashboard/RecentActivity';

const App = () => {
  useEffect(() => {
    if (localStorage.token) {
      setToken(localStorage.token);
    }
    store.dispatch(loadUser());
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <>
          <Navbar />

          <Alert />
          <Switch>
            <Route exact path='/' component={Landing} />
            <Route exact path='/login' component={Login} />
            <Route exact path='/signup' component={Signup} />
            <PrivateRoute exact path='/me' component={Profile} />
            <PrivateRoute exact path='/new-group' component={CreateGroup} />
            <PrivateRoute exact path='/my-groups' component={MyGroups} />
            <>
              <DashboardLayout />
              <PrivateRoute exact path='/dashboard' component={Dashboard} />
              <PrivateRoute exact path='/groups/:id' component={Groups} />
              <PrivateRoute
                exact
                path='/my-groups/get-group/:id'
                component={EditGroup}
              />
              <PrivateRoute path='/activity' component={RecentActivity} />
            </>
          </Switch>
        </>
      </Router>
    </Provider>
  );
};

export default App;
