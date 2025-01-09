import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

// Firebase imports
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';

// HTTP Client y Forms
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

// Common utilities
import { CommonModule } from '@angular/common';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(
      HttpClientModule,
      ReactiveFormsModule,
      CommonModule
    ),
    provideFirebaseApp(() =>
      initializeApp({
        apiKey: "AIzaSyACGjA2kk7WeSAyxhFm-sgj4tkuyv2JAZw",
        authDomain: "app-de-tickets.firebaseapp.com",
        projectId: "app-de-tickets",
        storageBucket: "app-de-tickets.appspot.com", // Corregido
        messagingSenderId: "688248719961",
        appId: "1:688248719961:web:5c43399189c46327067f48"
      })
    ),
    provideAuth(() => getAuth()), // Proveedor de autenticación
    provideFirestore(() => getFirestore()), // Proveedor de Firestore
    provideZoneChangeDetection({ eventCoalescing: true }), // Optimización de zonas
    provideRouter(routes), // Configuración de rutas
  ],
};
