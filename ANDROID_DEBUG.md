# 🔧 DEBUGGING: SENSORES EN ANDROID - GUÍA COMPLETA

## ❓ ¿Por qué dice "Sensores no disponibles"?

### Causas Comunes

```
1. DISPOSITIVO:
   ❌ Falta de acelerómetro/giroscopio
   ✓ Solución: Verificar en Ajustes > Acerca del teléfono

2. NAVEGADOR:
   ❌ Firefox, Opera, algunos navegadores no soportan DeviceOrientation
   ✓ Solución: Usar Chrome, Edge, Samsung Internet

3. PERMISOS:
   ❌ iOS 13+: Usuario rechazó permiso de movimiento
   ✓ Solución: Ir a Ajustes > Safari > Movimiento y Orientación > ON

4. HTTPS:
   ❌ DeviceOrientation solo funciona en HTTPS (excepto localhost)
   ✓ Solución: Usar HTTPS en producción

5. SANDBOX:
   ❌ WebView restringida (algunos navegadores integrados)
   ✓ Solución: Usar navegador completo
```

---

## 🔍 Cómo Debuggear en Android

### Paso 1: Abrir DevTools

**Chrome/Edge:**
1. Abre el juego en http://localhost:5175
2. Presiona F12 o Ctrl+Shift+I (o Command+Option+I en Mac)
3. Ve a la pestaña **Console**

### Paso 2: Ver Logs de Detección

Verás mensajes como:
```
[TILT] Iniciando detección de sensores...
[TILT] DeviceOrientationEvent disponible: true
[TILT] ¿Es mobile? true
[TILT] Detectado Android/WebView - registrando listener sin permiso
[TILT] Esperando primer evento de deviceorientation...
```

### Paso 3: Probar Movimiento

**Si ves "Sensores OK":**
✅ El sistema está funcionando

**Si NO ves "Sensores OK":**
1. Mueve el teléfono hacia adelante y atrás
2. Espera 3-5 segundos
3. Si sigue sin funcionar, revisa los pasos siguientes

---

## 📱 Pasos por Navegador

### ✅ Chrome / Chromium (RECOMENDADO)

```
1. Abre http://localhost:5175
2. Presiona ⋮ > Configuración > Avanzado > Privacidad
3. Busca "Sensores de movimiento" o "Motion/Orientation"
4. Verifica que está HABILITADO
5. Vuelve a cargar la página
6. Intenta jugar
```

**Si pregunta permiso:**
- Click en "Permitir"
- El juego debería detectar sensores inmediatamente

---

### 🔸 Firefox

**PROBLEMA:** Firefox NO soporta bien DeviceOrientation en móvil

```
Alternativa:
1. Cambia a Chrome o Edge
2. O usa botones en lugar de tilt
3. (Nosotros mostramos automáticamente botones si no hay sensores)
```

---

### 🍎 Safari (iOS)

```
1. Abre en Safari (no Chrome app)
2. Ve a Ajustes > Safari > Movimiento y Orientación
3. Desactiva y vuelve a activar
4. Recarga la página
5. Safari pedirá permiso
6. Click en "Permitir"
```

---

### Samsung Internet

```
1. Abre el navegador Samsung Internet
2. ⋮ > Configuración > Sitios y descargas
3. Habilita "Movimiento y Orientación"
4. Recarga el juego
```

---

## 🧪 Test de Sensores

### Método 1: Console Log (Fácil)

```javascript
// Abre DevTools (F12) y pega esto en la consola:

navigator.permissions.query({name:'accelerometer'}).then(result => {
  console.log('Acelerómetro:', result.state);
});

navigator.permissions.query({name:'gyroscope'}).then(result => {
  console.log('Giroscopio:', result.state);
});

// Espera a ver:
// Acelerómetro: granted (BIEN)
// Acelerómetro: denied (BLOQUEADO)
// Acelerómetro: prompt (PEDIR)
```

### Método 2: DeviceOrientation Directo

```javascript
// En la consola:

let eventFired = false;

window.addEventListener('deviceorientation', (e) => {
  if (!eventFired) {
    console.log('✓ DeviceOrientation funciona!');
    console.log('Beta (frente-atrás):', e.beta);
    console.log('Gamma (izq-der):', e.gamma);
    console.log('Alpha (rotación):', e.alpha);
    eventFired = true;
  }
});

// Ahora mueve tu teléfono
// Si ves los ángulos = FUNCIONA
```

### Método 3: Sitio de Prueba

```
Abre en tu teléfono:
https://deviceorientation-demo.appspot.com/

Si funciona aquí pero NO en nuestro juego = Problema en nuestro código
Si NO funciona aquí = Problema de dispositivo/permisos
```

---

## 🛠️ Soluciones Paso a Paso

### CASO 1: "Sensores no disponibles" en Android Chrome

**Paso 1: Limpiar caché**
```
Chrome > ⋮ > Historial > Borrar datos > 
Marcar: "Cookies e imágenes en caché" > BORRAR
```

**Paso 2: Recargar página**
```
F5 o Ctrl+Shift+R (fuerza caché limpia)
```

**Paso 3: Permitir movimiento**
```
Si Chrome pregunta "¿Permitir acceso a sensores?" → PERMITIR
```

**Paso 4: Probar en DevTools**
```
F12 > Console > Pega esto:
let eventCount = 0;
window.addEventListener('deviceorientation', () => {
  eventCount++;
  console.log(`Evento #${eventCount}`);
}, true);

Mueve el teléfono. Si ves números = funciona
```

---

### CASO 2: iOS Safari

**Paso 1: Verificar permisos**
```
Ajustes > Safari > Movimiento y Orientación
Debe estar ACTIVADO (verde)
```

**Paso 2: Recargar Safari**
```
Safari pedirá permiso la primera vez
Click en "Permitir"
```

**Paso 3: Verificar HTTPS**
```
La URL debe iniciar con HTTPS (no HTTP)
Localhost es excepción
```

---

### CASO 3: WebView (In-app Browser)

**Problema:** Muchas apps (Facebook, Instagram, Twitter) usan WebView restringida

**Solución:**
```
1. En lugar de abrir el link en la app
2. Selecciona "Abrir en navegador"
3. Se abre Chrome/Safari nativo
4. Ahora funciona
```

---

## 📊 Tabla de Solución

| Síntoma | Causa Probable | Solución |
|---------|----------------|----------|
| "Sensores no disponibles" + sin permiso | Permisos bloqueados | Habilitar en Ajustes |
| "Sensores no disponibles" + sin event | DeviceOrientation no soportado | Cambiar navegador |
| Funciona a veces, falla otras | Throttling del navegador | Reiniciar navegador |
| Funciona en otro dispositivo | Hardware específico | Usar ese dispositivo |
| Funciona en escritorio (emulador) | Emulador no tiene sensores | Probar en teléfono real |

---

## 🎯 Checklist de Debugging

```
□ ¿El dispositivo tiene acelerómetro?
  Ajustes > Acerca del teléfono > Especificaciones

□ ¿El navegador es Chrome/Edge/Safari?
  (Firefox no soporta bien)

□ ¿Están habilitados los permisos de movimiento?
  Chrome: Configuración > Privacidad
  iOS: Ajustes > Safari > Movimiento y Orientación

□ ¿La conexión es HTTPS en producción?
  (localhost es excepción)

□ ¿Abriste en navegador nativo?
  (No en WebView de apps)

□ ¿El dispositivo se movió después de abrir?
  (El primer evento puede tomar 1-2 segundos)

□ ¿Verificaste la consola?
  DevTools (F12) > Console
```

---

## 💡 Logs Esperados (Éxito)

```console
[TILT] Iniciando detección de sensores...
[TILT] DeviceOrientationEvent disponible: true
[TILT] ¿Es mobile? true
[TILT] Detectado Android/WebView - registrando listener sin permiso
[TILT] Esperando primer evento de deviceorientation...
                    ↓ (Mueves el dispositivo)
[Evento de deviceorientation recibido]
✓ Sensores OK - Inclina el dispositivo
```

---

## ⚡ Si Todo Falla

**Fallback automático:**
El juego detecta si no hay sensores y muestra botones:

```
⬆️ SKIP    ⬇️ CORRECTA

Esto permite jugar sin sensores
(solo con toques en pantalla)
```

**Es completamente normal y funcional** para jugar sin tilt.

---

## 🔗 Referencias

- [MDN DeviceOrientation API](https://developer.mozilla.org/en-US/docs/Web/API/DeviceOrientation)
- [Can I Use - DeviceOrientation](https://caniuse.com/deviceorientation)
- [Test DeviceOrientation](https://www.html5rocks.com/en/tutorials/device/orientation/)
- [Chrome Support](https://support.google.com/chrome/answer/114662)

