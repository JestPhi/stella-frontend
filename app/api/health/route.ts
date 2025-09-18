import { createRoute, RouteTypes } from "../../utils/routeFactory";

const healthCheck = createRoute(RouteTypes.HEALTH)(async () => {
  return {
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "stella-web",
  };
});

export const GET = healthCheck;
