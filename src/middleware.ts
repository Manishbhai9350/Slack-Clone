import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";



const IsAuthPage = createRouteMatcher(["/auth"]);


export default convexAuthNextjsMiddleware(async (request,{convexAuth}) => {
  const IsAuthenticated = (await convexAuth.isAuthenticated());
  // Checking If user is trying to access the public pages without authenticating 
  if(!IsAuthPage(request) && !IsAuthenticated) {
      return nextjsMiddlewareRedirect(request,'/auth')
  }

  // // Redirecting the user to / if he is trying to access Auth page if he is Authenticated
  if(IsAuthenticated && IsAuthPage(request)) {
  return nextjsMiddlewareRedirect(request,'/')
  }

  return;
})





export const config = {
  // The following matcher runs middleware on all routes
  // except static assets.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};