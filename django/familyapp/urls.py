from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from accounts.views import LoginView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(('accounts.urls', "accounts"))),
    path('api/', include(('family.urls', "family"))),
    path('api/', include(('task_list.urls', "task_list"))),
    path('auth/', include('rest_framework.urls')),
    # path('family/', include('family.urls')),'

    # Authentication
    path('api/token/', LoginView.as_view(), name='login'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),

]
