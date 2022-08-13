import { createBrowserHistory, Location } from "history";
import React, { useContext, useLayoutEffect, useState } from "react";

function locationToRoute({ location }: { location: Location }) {
  return {
    path: location.pathname,
    // could include other properties like hash, query params, etc.
  };
}

const history = createBrowserHistory();
export const RouterContext = React.createContext({
  route: locationToRoute(history),
  history,
});

type Props = {
  children: React.ReactNode;
};

const RouterProvider = ({ children }: Props) => {
  const [route, setRoute] = useState(locationToRoute(history));

  useLayoutEffect(() => {
    const handleRouteChange = (location: { location: Location }) => {
      const route = locationToRoute(location);
      setRoute(route);
    };

    let unlisten = history.listen(handleRouteChange);
    return () => {
      unlisten();
    };
  }, []);

  return <RouterContext.Provider value={{ route, history }}>{children}</RouterContext.Provider>;
};

const useRouter = () => useContext(RouterContext);

export { useRouter, RouterProvider, history };
