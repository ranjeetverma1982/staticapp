import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const Restorants = () => import(/* webpackChunkName: "group-restorant", webpackPrefetch: true  */'../components/Restorants/Restorants.vue')
const Orders = () => import(/* webpackPrefetch: true */'../components/Orders/Orders.vue')
const RestorantsNearMe = () => import(/* webpackPrefetch: true */'../components/Maps/RestorantsNearMe.vue')
const PageNotFound = () => import(/* webpackPrefetch: true */'../components/Generic/PageNotFound.vue')
const RestorantDetails = () => import(/* webpackChunkName: "group-restorant", webpackPrefetch: true  */'../components/Restorants/RestorantDetails.vue')
const OrderDetails = () => import(/* webpackPrefetch: true */'../components/Orders/OrderDetails.vue')

const CartDetails = () => import(/* webpackPrefetch: true */'@/components/Cart/CartDetails.vue')

import store from '../store'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: { name: 'restorants' },
    meta: {
      requiresAuth: false
    }
  },
  {
    path: '/restorants',
    name: 'restorants',
    components: {
      default: Restorants,
      'right-sidebar': RestorantsNearMe
    },
    meta: {
      title: 'My Restorants',
      requiresAuth: false
    }
  },
  {
    path: '/restorants/:id(\\d+)',
    name: 'restorantdetails',
    props: {
      default: route => {
        return {
          restorantId: route.params.id
        }
      },
      'right-sidebar': router => {
        return {

        }
      }
    },
    components: {
      default: RestorantDetails,
      'right-sidebar': CartDetails
    },
    meta: {
      requiresAuth: false,
      transitionEnter:'animate__animated animate__slideInDown'
    }
  },
  {
    path: '/orders',
    name: 'orders',
    component: Orders,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/orders/:id([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})',
    name: 'orderdetails',
    props: true,
    component: OrderDetails,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/orders/:orderCode',
    name: 'orderdetailsbycode',
    props: true,
    component: OrderDetails,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/nearme',
    name: 'nearme',
    component: RestorantsNearMe,
    meta: {
      requiresAuth: false,
      requiresLocation: true
    }
  },
 
  {
    path: '/:pathMatch(.*)*',
    component: PageNotFound
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
  linkActiveClass: "active-route",
  linkExactActiveClass: "exact-active-route",

});
router.beforeEach(async (to, from) => {
  //check for authentication
})

router.beforeResolve(async (to, from) => {
  if (to.meta?.requiresLocation) {
    try {
      await getCurrentLocation();
    }
    catch (error) {
      return false;
    }
  }
})

router.afterEach((to, from) => {
  store.dispatch('collectAnalytic', { path: to.fullPath })
  document.title = "QuickBite: " + (to.meta?.title ?? '');
})

function getCurrentLocation(): Promise<any> {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {

      navigator.geolocation.getCurrentPosition(
        (position: any) => {
          resolve({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        (error: any) => {
          reject(error);
        }
      )

    }
    else {
      reject('Geolocation is not enabled.')
    }
  })
}
export default router;