import React from "react";
import { RouterContext } from "./RouterContext";

type Props = {
  routeMap: Record<string, React.ReactNode>;
  fallback: string;
};

export default function Routes({ routeMap, fallback }: Props) {
  const { route, history } = React.useContext(RouterContext);

  // find if current route matches any of the routes in the routeMap
  const matchedRoute = Object.keys(routeMap).find((routeToMatch) => {
    const routeToMatchSegments = routeToMatch.split("/");
    const currentRouteSegments = route.path.split("/");

    // is a match if the path has the same number of segments as the route
    // and each segment matches the route segment
    const isMatch =
      routeToMatchSegments.length === currentRouteSegments.length &&
      routeToMatchSegments.every((routeToMatchSegment, index) => {
        // : indicates a placeholder for a parameter
        // if the routeToMatch segment is a placeholder and the current route segment has a value then it's a match
        if (routeToMatchSegment[0] === ":" && currentRouteSegments[index]) {
          return true;
        }
        return routeToMatchSegment === currentRouteSegments[index];
      });

    return isMatch;
  });

  // if there's no match then use the fallback route
  if (!matchedRoute) {
    history.replace(fallback);
    return <>{routeMap[fallback]}</>;
  }

  return <>{routeMap[matchedRoute]}</>;
}
