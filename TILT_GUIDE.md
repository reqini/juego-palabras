# 🎮 SISTEMA DE TILT MEJORADO - GUÍA TÉCNICA

## ✨ Mejoras Implementadas

### 1. **Sensibilidad Aumentada**
- **Antes**: Threshold de 25° (muy alto, lento en responder)
- **Ahora**: Threshold de 20° (más sensible, detección más rápida)

### 2. **Algoritmo de Hysteresis**
Implementa un sistema de "zona de transición" para evitar flickering:
```
Estado anterior: UP   → Neutral → DOWN   ✓ (se permite)
Estado anterior: UP   → Neutral → UP     ✓ (se permite)
Estado anterior: UP   → Neutral → Casi-UP → UP (se bloquea para evitar flicker)
```

### 3. **Respuesta Más Rápida**
| Métrica | Antes | Ahora | Mejora |
|---------|-------|-------|--------|
| Cooldown mínimo | 600ms | 400ms | **33% más rápido** |
| Debounce | 200ms | 150ms | **25% más rápido** |
| Respuesta total | ~800ms | ~550ms | **31% más rápido** |

### 4. **Indicador Visual Mejorado**

```
╔═══════════════════════════════════════════╗
║         ⬆️ SKIP                           ║
║  🟢━━━━━━━━━┃━━━━━━━━🔴                   ║ ← Barras de color
║      ↑      ↑      ↑                      ║
║   SKIP    NEUTRAL  CORRECT                ║
║                                           ║
║  Beta: -45° 🔼 SKIP!                      ║ ← Estado en vivo
║                                           ║
║         ⬇️ CORRECT                        ║
╚═══════════════════════════════════════════╝
```

**Colores y Significados:**
- 🟢 **Verde (Izquierda)**: Zona SKIP (tilt hacia adelante)
- 🟡 **Amarillo (Centro)**: Zona NEUTRAL (sin acción)
- 🔴 **Rojo (Derecha)**: Zona CORRECT (tilt hacia atrás)

### 5. **Feedback en Tiempo Real**
Cuando el dispositivo está inclinado:
```
Beta: -25° 🔼 SKIP!        ← Aviso visual cuando se activa SKIP
Beta: 30°  🔽 CORRECT!     ← Aviso visual cuando se activa CORRECT
```

El indicador tiene:
- ✨ Brillo pulsante cuando está en zona activa
- 🎨 Color dinámico (verde/rojo según acción)
- 📍 Posición que sigue el movimiento del dispositivo en tiempo real

---

## 🔧 Cómo Funciona Técnicamente

### Flujo de Detección

```typescript
DeviceOrientationEvent (Beta del acelerómetro)
         ↓
    Calibración (baseline)
         ↓
    Calcular Delta (Beta - BaseBeta)
         ↓
    Aplicar Hysteresis
         ↓
    Comparar con Thresholds (-20° y +20°)
         ↓
    Verificar Cooldown (400ms)
         ↓
    Ejecutar Acción (onTiltUp o onTiltDown)
         ↓
    Aplicar Debounce (150ms)
```

### Estados del Sistema

| Estado | Condición | Acción | Sonido | Vibración |
|--------|-----------|--------|--------|-----------|
| **UP** | Beta < -20° | SKIP | ✓ | ✓ |
| **NEUTRAL** | -20° ≤ Beta ≤ +20° | Esperar | — | — |
| **DOWN** | Beta > +20° | CORRECT | ✓ | ✓ |

---

## 📱 Cómo Usar (Para Jugadores)

### Calibración
1. Abre el juego en GameScreen
2. El sistema automáticamente calibra con tu posición actual
3. Ves "Calibrando..." luego "Sensores OK"

### Durante el Juego

**PARA HACER SKIP (⬆️):**
- Inclina el dispositivo **hacia ADELANTE** (pantalla apunta hacia abajo)
- Verás "🔼 SKIP!" en el indicador
- La palabra cambia automáticamente

**PARA MARCAR CORRECTA (⬇️):**
- Inclina el dispositivo **hacia ATRÁS** (pantalla apunta hacia arriba)
- Verás "🔽 CORRECT!" en el indicador
- El score sube automáticamente

### Indicador de Control

El indicador muestra en TIEMPO REAL:
```
┌─────────────────────────────┐
│ Inclinación actual: -35°    │ ← Número exacto
│ Estado: 🔼 SKIP!            │ ← Acción activa
└─────────────────────────────┘
```

---

## 🎯 Ventajas vs Sistema Anterior

| Aspecto | Anterior | Nuevo | Beneficio |
|--------|----------|-------|-----------|
| **Sensibilidad** | Threshold 25° | Threshold 20° | Más fácil activar |
| **Fluidez** | Flickering común | Hysteresis | Movimientos suaves |
| **Velocidad** | ~800ms | ~550ms | Juego más responsivo |
| **Feedback** | Básico | Visual avanzado | Más satisfactorio |
| **Control** | Zona muerta grande | Zonas claras | Más preciso |

---

## 🐛 Troubleshooting

### "El tilt no funciona"
✓ Verifica que el navegador pide permiso para sensores
✓ En iOS: Ve a Ajustes > Safari > Movimiento y Orientación
✓ Espera 3 segundos después del countdown

### "Funciona pero se activa al azar"
✓ Espera a que termine la calibración
✓ Mantén el dispositivo quieto durante los primeros segundos
✓ No hagas movimientos muy bruscos

### "Funciona pero muy lento"
✓ Ya fue optimizado (400ms cooldown)
✓ Si sigue lento, verifica el dispositivo (sensores)
✓ Intenta en otro navegador o dispositivo

---

## 📊 Métricas del Sistema

```
Threshold (sensibilidad):        20°
Cooldown mínimo entre acciones:  400ms
Debounce después de acción:      150ms
Zona neutral:                    40° total (-20° a +20°)
Hysteresis margin:               5°
Frecuencia de detección:         ~60Hz (DeviceOrientation)
```

---

## 🚀 Optimizaciones Futuras

Si hay problemas, se puede ajustar:
1. **Threshold**: Cambiar a 15° (muy sensible) o 25° (menos sensible)
2. **Cooldown**: Reducir a 300ms (muy rápido) o 500ms (más estable)
3. **Debounce**: Ajustar a 100ms (máx respuesta) o 200ms (más estable)

```typescript
// En SettingsContext.tsx, agregar:
tiltThreshold: 20,      // Cambiar aquí
tiltCooldown: 400,      // Agregar aquí si es necesario
tiltDebounce: 150,      // Agregar aquí si es necesario
```

