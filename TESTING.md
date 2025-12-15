# 🧪 Testing Completo - Adivina la Palabra

## ✅ Estado del Servidor
- **URL Local:** http://localhost:5175/
- **URL Red Local:** http://192.168.0.90:5175/
- **Estado:** ✅ Ejecutándose

## 📋 Plan de Testing

### Fase 1: Single Player Mode
1. ✅ Abrir app en navegador
2. ✅ Pantalla de inicio carga correctamente
3. ✅ Botones visibles: Jugar, Multiplayer, Tabla de Posiciones, Configuración
4. ✅ Botón "Descargar App" aparece (si es PWA-compatible)

### Fase 2: Configuración
1. ✅ Abrir Configuración
2. ✅ Verificar duración por defecto = 15 segundos
3. ✅ Seleccionar diferentes categorías (Deportes, Animales, Tecnología, Países, Música, Películas, Comida)
4. ✅ Cambiar sensibilidad del tilt (25°)
5. ✅ Desactivar/Activar sonido y vibración
6. ✅ Guardar cambios

### Fase 3: Single Player Gameplay
1. ✅ Click en "Jugar"
2. ✅ Pantalla debe forzar orientación horizontal (landscape)
3. ✅ Mostrar sensor status
4. ✅ Countdown: 3..2..1..¡YA!
5. ✅ Aparece palabra
6. ✅ Probar controles:
   - ✅ Botón "Acertaste" (arriba)
   - ✅ Botón "Saltear" (abajo)
   - ✅ O con tilt del dispositivo:
     - ✅ Inclinar hacia arriba = Acertaste
     - ✅ Inclinar hacia abajo = Saltear
7. ✅ Puntuación aumenta en acertos
8. ✅ Cambios de palabra
9. ✅ Timer cuenta hacia atrás (15 segundos)
10. ✅ Sonar/vibrar en acertos y errores
11. ✅ Al terminar tiempo → Pantalla EndGame

### Fase 4: End Game Results
1. ✅ Mostrar score final
2. ✅ Mostrar palabras acertadas
3. ✅ Mostrar palabras saltadas
4. ✅ Input para nombre del jugador
5. ✅ Botón "Guardar y Ver Tabla"
6. ✅ Datos guardados en localStorage

### Fase 5: Leaderboard
1. ✅ Ver top 10 jugadores
2. ✅ Mostrar: Ranking, Nombre, Puntos, Acertos, Saltos, Fecha
3. ✅ Ordenado por puntuación (descendente)

### Fase 6: Multiplayer Setup
1. ✅ Click en "Multiplayer"
2. ✅ Dos opciones: "Crear Partida" y "Unirse a Partida"

#### 6a: Crear Partida
1. ✅ Click "Crear Partida"
2. ✅ Ingresa nombre jugador
3. ✅ Selecciona categoría
4. ✅ Selecciona duración (15s por defecto)
5. ✅ Click "Crear Sala"
6. ✅ Se genera código (6 caracteres)
7. ✅ Opción "Copiar Enlace"
8. ✅ Botón "Comenzar Juego"

#### 6b: Unirse a Partida
1. ✅ Click "Unirse a Partida"
2. ✅ Ingresa nombre jugador
3. ✅ Ingresa código de sala (6 caracteres)
4. ✅ Click "Unirse a Sala"
5. ✅ Si código válido → Entra al juego
6. ✅ Si código inválido → Mostrar error

### Fase 7: Multiplayer Gameplay
1. ✅ Ambos jugadores ven la misma palabra
2. ✅ Ambos juegan simultaneamente
3. ✅ Cada jugador puede:
   - ✅ Usar botones o tilt para acertar/saltear
   - ✅ Cambiar palabra
4. ✅ Puntuación se calcula por separado

### Fase 8: Multiplayer Results
1. ✅ Al terminar tiempo
2. ✅ Ver scores de todos los jugadores
3. ✅ Guardar resultados de cada jugador
4. ✅ Ver actualizaciones en tabla de posiciones

### Fase 9: Validaciones & Edge Cases
1. ✅ Sin palabras duplicadas en la misma partida
2. ✅ Timer exacto
3. ✅ No acepta acciones después que termina tiempo
4. ✅ Vibración/Sonido se puede desactivar
5. ✅ Works offline (localStorage persiste)
6. ✅ Responsive en diferentes tamaños

## 🎮 Instrucciones de Prueba Manual

### Opción A: Single Player
```
1. Abrir http://localhost:5175/
2. Click "Jugar"
3. Esperar 3..2..1
4. Usar botones o inclinar teléfono
5. Después de 15 segundos → Ver resultados
6. Guardar nombre → Ver en tabla
```

### Opción B: Multiplayer (Mismo Dispositivo - Pestañas)
```
1. Abrir http://localhost:5175/ en Pestaña 1
2. Click "Multiplayer" → "Crear Partida"
3. Nombre: "Jugador 1", crear sala
4. Copiar código (ej: ABC123)
5. Abrir http://localhost:5175/ en Pestaña 2
6. Click "Multiplayer" → "Unirse a Partida"
7. Nombre: "Jugador 2", código: ABC123
8. Ambos juegan, ver resultados por separado
```

### Opción C: Multiplayer (Múltiples Dispositivos)
```
1. Dispositivo A: http://192.168.0.90:5175/
2. Dispositivo B: http://192.168.0.90:5175/
3. Seguir pasos Opción B con red local
```

## 📊 Checklist de Validación

- [ ] Orientación horizontal se fuerza automáticamente
- [ ] Duración por defecto es 15 segundos
- [ ] Botón "Descargar App" aparece
- [ ] Tilt responde rápidamente (sin lag)
- [ ] Cambio de palabras es fluido
- [ ] No hay palabras duplicadas
- [ ] Puntuación se calcula correctamente
- [ ] Leaderboard persiste en localStorage
- [ ] Multiplayer sincroniza datos
- [ ] Sonido/Vibración funcionan
- [ ] Sin errores en consola
- [ ] PWA installable

## 🐛 Debugging Commands

```bash
# Ver logs en tiempo real
tail -f /tmp/vite.log

# Ver localStorage
localStorage.getItem('game-settings')
localStorage.getItem('leaderboard')
localStorage.getItem('adivina_rooms')
localStorage.getItem('adivina_current_room')

# Clear localStorage
localStorage.clear()
```

## ✨ Resultado Final Esperado

✅ Juego completamente funcional con:
- Single player mode fluido
- Multiplayer con sincronización
- Tabla de posiciones persistente
- 8 categorías diferentes
- Controles por tilt y botones
- Orientación horizontal automática
- Duración de 15 segundos
- Opción de descarga (PWA)
