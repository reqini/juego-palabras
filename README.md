# Adivina la Palabra — PWA (Heads Up)

Juego móvil en horizontal, instalable PWA, totalmente offline.

Características principales
- React + TypeScript + Vite
- PWA con `vite-plugin-pwa` (service worker + manifest)
- Sensores de inclinación (DeviceOrientationEvent)
- Fallback con botones grandes si no hay sensores
- Leaderboard offline (localStorage)
- Calibración de inclinación
- Dataset local de palabras (categorías: general, películas, comida)

Defaults
- Duración por defecto: 60s
- Umbral inclinación por defecto: 25° (ajustable)
- Cooldown anti-doble trigger: 900ms
- Score: +1 por correcta, 0 por skip

Estructura relevante
- `index.html`
- `vite.config.ts` (configura PWA)
- `manifest.json` (PWA)
- `src/main.tsx`
- `src/app` — App, pantallas y SettingsContext
- `src/hooks` — `useDeviceTiltControls`, `usePersistentState`
- `src/data/words.ts` — listas de palabras
- `src/lib` — utilidades (`leaderboard`, `utils`)
- `src/styles` — CSS

Instalación (requerimientos)
- Node.js >= 18 recomendado
- Yarn como package manager

Pasos (dev)

```bash
# instalar dependencias
yarn install

# modo desarrollo
yarn dev

# build producción
yarn build

# previsualizar build
yarn preview
```

Cómo instalar la PWA

- Android (Chrome/Chromium): abrir la app en el navegador, tocar el menú y elegir "Instalar app" o "Añadir a pantalla de inicio".
- iOS (Safari): abrir la app, tocar el botón compartir -> "Añadir a pantalla de inicio" (nota: iOS no muestra el banner de instalación como Chrome).

Modo offline
- La app está precacheada por el service worker (vite-plugin-pwa). Al hacer `build` y servir el `dist`, los assets y scripts quedarán cached.
- Leaderboard y ajustes se guardan en `localStorage`.

Sensores y calibración

- La app usa `DeviceOrientationEvent`.
- En iOS (Safari) se requiere permiso explícito. La app solicita permiso antes de usar los sensores; sigue el flujo de "Calibración" para habilitarlos.
- Calibración: al presionar "Calibrar" se guarda el `beta/gamma` actual como punto neutral.
- Detección de acciones:
  - Inclinar HACIA ARRIBA (beta negativo respecto al baseline) => SKIP
  - Inclinar HACIA ABAJO (beta positivo respecto al baseline) => CORRECTA
- Valores por defecto:
  - `tiltThreshold`: 25° (umbral para detectar arriba/abajo)
  - `cooldown`: 900ms (anti-doble trigger)

Ajustes y debugging
- Desde `Configuración` puedes cambiar la duración, categoría, sensibilidad (umbral), toggles de sonido y vibración, y mezclar categorías.
- En pantalla de calibración verás los valores `beta/gamma` en vivo y el estado `SENSOR OK / NO DISPONIBLE`.

Problemas comunes
- iOS no detecta sensores: dentro de `Configuración` -> `Calibrar`, toca "Iniciar Calibración" para que iOS pregunte el permiso. Si no aparece, abre Ajustes -> Safari -> mueve a "Preguntar" (si aplica) y prueba de nuevo.
- No se oyen sonidos: algunos navegadores requieren una interacción del usuario antes de crear `AudioContext`.
- Vibración no funciona en algunos dispositivos iOS (limitaciones de Apple).

Notas de implementación
- `useDeviceTiltControls` implementa throttle y cooldown. Se prioriza `beta` (front-back tilt) y cae a `gamma` si `beta` no está disponible.
- Evitamos rerenders por cada evento del sensor usando `refs` y throttling.
- `vite-plugin-pwa` está configurado con `injectManifest` y `src/sw.ts`.

Recomendación
- Probar en dispositivo real (Android/iOS) para validar permisos de sensores y comportamiento de vibración.

Si querés, puedo:
- Añadir tests automáticos básicos.
- Mejorar assets (íconos reales).
- Convertir las placeholders de íconos en PNG reales (generar con script).

¡Listo para ejecutar con `yarn install` y `yarn dev`!
