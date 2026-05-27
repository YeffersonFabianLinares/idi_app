# App Entrega de Resultados

![React Native](https://img.shields.io/badge/React%20Native-black?logo=react)
![React Native](https://img.shields.io/badge/Expo-black?logo=expo)
![Git](https://img.shields.io/badge/git-black?logo=git)
![iOS](https://img.shields.io/badge/iOS-black?logo=apple)
![Git](https://img.shields.io/badge/Android-black?logo=android)

Aplicación móvil desarrollada con **React Native** y **Expo (SDK 54)**. Utiliza un sistema de navegación basado en pestañas (Tabs) mediante **Expo Router** y control de estados/validaciones robustas para la entrega de servicios.

---

## 🛠️ Stack Tecnológico

*   **Framework:** React 19 / React Native 0.81
*   **Ecosistema:** Expo SDK 54 (Workflow Prebuild/Bare)
*   **Enrutamiento:** Expo Router (File-based routing)
*   **Formularios:** React Hook Form + Zod (Validación de esquemas)
*   **HTTP Client:** Axios
*   **Persistencia Segura:** Expo Secure Store

---

## 🚀 Guía de Instalación Rápida

Sigue estos pasos en tu terminal para clonar el proyecto y levantar el entorno de desarrollo móvil en tu Mac.

### 1. Clonar el repositorio
```bash
git clone \\192.168.73.74/gitidime/mobile/EntregaResultados/app.git/
cd app
```

### 2. Instalar dependencias de Node
Instala todos los paquetes de Node especificados en el `package.json`:
```bash
npm install
```
> 💡 **Nota:** Si utilizas `yarn` o `pnpm`, puedes ejecutar `yarn install` o `pnpm install` respectivamente. generalmente es `npm install`

---

## ⚡ Comandos de Ejecución

El proyecto utiliza scripts nativos de Expo para compilar y ejecutar la aplicación en simuladores o dispositivos reales:

*   **Iniciar servidor de desarrollo (Metro):**
    ```bash
    npx expo start -c
    ```
* **Escanear el QR que genera**
> 💡 **Nota:** Debes estar conectado a la misma `red` para poder interactuar con la app
---

## 🔒 Características de Seguridad y Almacenamiento

La aplicación incluye soporte nativo para el ecosistema Apple/Android a través de las siguientes librerías ya instaladas:
*   `expo-secure-store`: Utilizado para cifrar y almacenar tokens de sesión de manera segura en el Keychain de iOS.
*   `react-native-reanimated`: Animaciones fluidas de interfaz a 60 FPS ejecutadas directamente en el hilo nativo.
