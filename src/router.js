import { createRouter, createWebHistory } from 'vue-router';
import RegisterPage from './views/RegisterView.vue';
import LoginPage from './views/LoginView.vue'
import Dashboard from './views/DashboardView.vue'

// Define route components
const routes = [
    { path: '/', component: RegisterPage },
    { path: '/register', component: RegisterPage },
    { path: '/login', component: LoginPage },
    { path: '/dashboard', component: Dashboard },
];

// Create the router instance
const router = createRouter({
    history: createWebHistory(),
    routes, // short for `routes: routes`
});

export default router;