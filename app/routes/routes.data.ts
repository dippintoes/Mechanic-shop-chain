import routeProvider from "../feature-modules/route.provider";
import { ExcludedPath, ExcludedPaths } from "../middlewares/authorize";
import { Route, Routes } from "./routes.types";

export const routes: Routes = [
  new Route("/auth", routeProvider.AuthRouter),
  new Route("/shop", routeProvider.ShopRouter),
  new Route("/inventory", routeProvider.InventoryRouter),
  new Route("/user", routeProvider.UserRouter),
  new Route("/sale", routeProvider.SaleRouter),
  new Route("/request", routeProvider.RequestRouter),
  new Route("/rewards", routeProvider.RewardsRouter),
  new Route("/ratings", routeProvider.RatingsRouter),
  new Route("/redeem", routeProvider.RedeemRouter),
  new Route("/role", routeProvider.RoleRouter),
];

export const excludedPaths: ExcludedPaths = [
  new ExcludedPath("/auth/login", "POST"),
  new ExcludedPath("/auth/register", "POST"),
  new ExcludedPath("/auth/refresh", "POST"),
  new ExcludedPath("/user/rating", "POST"),
  new ExcludedPath("/role/create", "POST"),
];
