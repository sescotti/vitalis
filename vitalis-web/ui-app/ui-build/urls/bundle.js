App.Urls.set(({
  "es": {
    "vitalis:index": "",
    "vitalis:login": "login",
    "vitalis:signup": "signup",
    "vitalis:home": "app",
    "vitalis:patients": "app/patients",
    "vitalis:monitoring": "app/monitoring/:id",
    "vitalis:requests": "app/requests",
    "vitalis:new_request": "app/requests/new",
    "vitalis:modules": "app/modules",
    "vitalis:new_monitoring": "app/modules/:moduleId/new_monitoring",
    "vitalis:measurements": "app/monitoring/:monitoringId/sensors/:measurementType",
    "vitalis:new_module": "app/new_modules"
  }
})[App.Config.lang]);