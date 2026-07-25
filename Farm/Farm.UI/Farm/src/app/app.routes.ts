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
import { Farms } from './admin/farms/farms';
import { Fields } from './admin/fields/fields';
import { Sensors } from './admin/sensors/sensors';
import { ActionableTasks } from './admin/actionable-tasks/actionable-tasks';
import { Crops } from './admin/crops/crops';
import { CropRefs } from './admin/crop-refs/crop-refs';
import { Users } from './admin/users/users';
import { LoginAdmin } from './admin/login-admin/loginAdmin';
;

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
    children: [
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      { path: 'users', component: Users },
      { path: 'farms', component: Farms },
      { path: 'fields', component: Fields },
      { path: 'sensors', component: Sensors },
      { path: 'tasks', component: ActionableTasks },
      { path: 'crops', component: Crops },
      { path: 'cropRefs', component: CropRefs },
    ]
  },
  {path:'signin',component: Login},
  {path:'signup',component: Register},
  {path:'',component: HomePage},
  {path:'**',component: HomePage}
];
