import React from "react";
import {Route} from "react-router-dom";

// the Route component takes a prop called component that represents the comp that will be rendered when a matching
// route is found. childProps will be sent to this comp
// it can also take a render method in place of component, so we control whats passed in to our component
// so we can create a component that returns a Route and takes a component and childProps prop. This allows us to
// pass in the component we want rendered and the props we want applied
// props is what is Route passes us, cProps is what we set
export default ({component: C, props: cProps, ...rest}) =>
    <Route {...rest} render={props => <C {...props} {...cProps} />} />;