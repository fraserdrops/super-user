import React from "react";
import { RouterContext } from "./RouterContext";

type Props = {
  routeMap: Record<string, React.ReactNode>;
  fallback: string;
};

export default function Routes({ routeMap, fallback }: Props) {
  const { route, history } = React.useContext(RouterContext);

  const matchedRoute = Object.keys(routeMap).find((path) => {
    const pathSegments = path.split("/");
    const routeSegments = route.path.split("/");

    // is a match if the path has the same number of segments as the route
    // and each segment matches the route segment
    const isMatch =
      pathSegments.length === routeSegments.length &&
      pathSegments.every((pathSegment, index) => {
        // : indicates a placeholder for a parameter
        // if the path segment is a placeholder and the route segment has a value then it's a match
        if (pathSegment[0] === ":" && routeSegments[index]) {
          return true;
        }
        return pathSegment === routeSegments[index];
      });

    return isMatch;
  });

  if (!matchedRoute) {
    history.replace(fallback);
    return <>{routeMap[fallback]}</>;
  }

  return <>{routeMap[matchedRoute]}</>;
}
