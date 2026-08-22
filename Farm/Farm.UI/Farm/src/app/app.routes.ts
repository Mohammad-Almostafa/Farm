import { Routes } from '@angular/router';
import { Login } from './account/login/login';
import { Register } from './account/register/register';
import { HomePage } from './home-page/home-page';
import { FarmList } from './farms/farm-list/farm-list';
import { FieldList } from './fields/field-list/field-list';
import { SensorPage } from './sensors/sensor-page/sensor-page';
import { Alerts } from './tasks/alerts/alerts';
import { FarmWithWeather } from './weather/farm-with-weather/farm-with-weather';
import { TaskList } from './tasks/task-list/task-list';
import { StatisticsPage } from './statistics/statistics-page/statistics-page';
import { LoginAdmin } from './admin/login-admin/loginAdmin';
import { Unauthorized } from './unauthorized/unauthorized';
import { authGuard } from './gards/auth-guard';
import { MockSensorReading } from './sensors/mock-sensor-reading/mock-sensor-reading';

export const routes: Routes = [
  {path:'home',component: HomePage ,
    children: [
      { path: '', redirectTo: 'farms', pathMatch: 'full' },
      { path: 'farms', component: FarmList },
      { path: 'fields', component: FieldList },
      { path: 'sensors', component: SensorPage },
      { path: 'alerts', component: Alerts },
      { path: 'weather', component: FarmWithWeather },
      { path: 'tasks', component: TaskList },
      { path: 'statistics', component: StatisticsPage }

    ]},
  {path: 'admin', component: LoginAdmin },
  {path:'adminPage',loadComponent:() => import('./admin/admin-page/admin-page').then(c => c.AdminPage),
    canActivate: [authGuard],
    data: { role: 'Admin' },
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      { path: 'users', loadComponent: () => import('./admin/users/users').then(c => c.Users) },
      { path: 'farms', loadComponent: () => import('./admin/farms/farms').then(c => c.Farms) },
      { path: 'fields', loadComponent: () => import('./admin/fields/fields').then(c => c.Fields) },
      { path: 'sensors', loadComponent: () => import('./admin/sensors/sensors').then(c => c.Sensors) },
      { path: 'tasks', loadComponent: () => import('./admin/actionable-tasks/actionable-tasks').then(c => c.ActionableTasks) },
      { path: 'crops', loadComponent: () => import('./admin/crops/crops').then(c => c.Crops) },
      { path: 'cropRefs', loadComponent: () => import('./admin/crop-refs/crop-refs').then(c => c.CropRefs) },
    ]
  },
  {path: 'unauthorized', component: Unauthorized },
  {path:'signin',component: Login},
  {path:'signup',component: Register},
  {path:'mock-sensor',component: MockSensorReading},
  {path:'',component: HomePage},
  {path:'**',component: HomePage}
];
