# 🧪 PRUEBA COMPLETA: JUEGO DE PUNTA A PUNTA

## FLUJO 1: SINGLE PLAYER (Un Jugador)

### Paso 1: Iniciar el juego
- [ ] Abrir http://localhost:5175 en el navegador
- [ ] Debe aparecer la pantalla de inicio (HomeScreen) con opciones:
  - [ ] "Jugar" (single player)
  - [ ] "Multiplayer"
  - [ ] "Tabla de Posiciones"
  - [ ] "Configuración"
  - [ ] [Opcional] "📥 Descargar App" (si el navegador lo soporta)

### Paso 2: Seleccionar categoría
- [ ] Hacer clic en "Jugar"
- [ ] Debe aparecer pantalla de configuración o ir directamente a seleccionar categoría
- [ ] Verificar que hay 8 categorías disponibles:
  - [ ] General
  - [ ] Deportes
  - [ ] Animales
  - [ ] Tecnología
  - [ ] Países
  - [ ] Música
  - [ ] Películas
  - [ ] Comida

### Paso 3: Pre-juego (countdown 3..2..1)
- [ ] Seleccionar una categoría (e.g., "Deportes")
- [ ] Debe aparecer pantalla con countdown:
  - [ ] "3" (1 segundo)
  - [ ] "2" (1 segundo)
  - [ ] "1" (1 segundo)
  - [ ] "¡YA!" + inicio del juego
- [ ] Verificar que el sensor está OK o muestra "Usando botones"

### Paso 4: GameScreen - JUGANDO 15 SEGUNDOS
- [ ] Timer en la esquina superior izquierda mostrando tiempo restante
- [ ] Palabra grande en el centro de la pantalla (mayúsculas)
- [ ] Puntuación en esquina superior derecha
- [ ] Dos botones (o sensores):
  - [ ] Botón ARRIBA o inclinación hacia adelante = SKIP (palabra pasada)
  - [ ] Botón ABAJO o inclinación hacia atrás = CORRECTA

### Paso 5: Acciones durante el juego (15 segundos)
Realizar acciones de prueba:
- [ ] Presionar botón "CORRECTA" 5 veces
  - [ ] La palabra debe cambiar cada vez
  - [ ] El score debe subir
  - [ ] Debe sonar un sonido (si soundEnabled)
  - [ ] Debe vibrar el dispositivo (si vibrationEnabled)
  - [ ] Debe haber flash visual
  - [ ] El contador "✓" debe subir
- [ ] Presionar botón "SKIP" 3 veces
  - [ ] La palabra debe cambiar
  - [ ] Score NO debe cambiar
  - [ ] El contador "⊘" debe subir

### Paso 6: Timer se agota
- [ ] Después de 15 segundos, el juego debe terminar automáticamente
- [ ] No debería aceptar más inputs

### Paso 7: EndGameScreen - RESULTADOS
- [ ] Debe mostrar:
  - [ ] "¡Juego Finalizado!" con emoji 🎉
  - [ ] Puntuación Final (ejemplo: 5 puntos)
  - [ ] Respuestas Correctas (ejemplo: 5)
  - [ ] Palabras Pasadas (ejemplo: 3)
  - [ ] Lista de palabras acertadas (tags verdes)
  - [ ] Lista de palabras pasadas (tags grises)

### Paso 8: Guardar en Tabla de Posiciones
- [ ] Campo de texto para ingresar nombre de jugador
- [ ] Por defecto: "Jugador"
- [ ] Modificar el nombre (e.g., "Benicio")
- [ ] Presionar "Guardar en Tabla de Posiciones"
- [ ] Debe mostrar: "✓ Score guardado para Benicio"

### Paso 9: Volver al Inicio
- [ ] Presionar botón "Volver al Inicio"
- [ ] Debe volver a la pantalla de inicio

### Paso 10: Validar Tabla de Posiciones
- [ ] Hacer clic en "Tabla de Posiciones"
- [ ] Debe mostrar el score que acabamos de guardar:
  - [ ] Nombre: "Benicio"
  - [ ] Puntuación: 5
  - [ ] Correctas: 5
  - [ ] Pasadas: 3
- [ ] Verificar que está ordenado por puntuación (de mayor a menor)

---

## FLUJO 2: MULTIPLAYER (Dos Jugadores)

### Paso 1: Crear sala de multiplayer
- [ ] Desde HomeScreen, hacer clic en "Multiplayer"
- [ ] Debe aparecer MultiplayerSetupScreen
- [ ] Opción por defecto: "Crear Sala"

### Paso 2: Configurar Sala (Jugador 1 - CREADOR)
- [ ] Ingresar nombre: "Jugador1"
- [ ] Seleccionar categoría: "Animales"
- [ ] Duración: 15 segundos (default)
- [ ] Presionar "Crear Sala"
- [ ] Debe generar código de 6 caracteres (e.g., "ABC123")
- [ ] Mostrar:
  - [ ] Código de sala: ABC123
  - [ ] Botón "Copiar Código"
  - [ ] URL compartible
  - [ ] Opción "Listo para jugar"

### Paso 3: Abrir segunda pestaña del navegador (Jugador 2)
- [ ] CTRL+T o CMD+T para nueva pestaña
- [ ] Ir a http://localhost:5175
- [ ] Debe aparecer HomeScreen

### Paso 4: Unirse a la Sala (Jugador 2 - SECUNDARIO)
- [ ] Hacer clic en "Multiplayer"
- [ ] Seleccionar "Unirse a Sala"
- [ ] Ingresar nombre: "Jugador2"
- [ ] Ingresar código: "ABC123"
- [ ] Presionar "Entrar"
- [ ] Debe unirse a la sala y mostrar:
  - [ ] "✓ Unido a la sala ABC123"
  - [ ] Opción "Listo para jugar"

### Paso 5: AMBOS JUGADORES JUEGAN (15 segundos)
**Pestaña 1 (Jugador1):**
- [ ] Presionar "Listo para jugar"
- [ ] Debe ir a GameScreen de la categoría "Animales"
- [ ] Comienza el countdown 3..2..1
- [ ] Juega durante 15 segundos:
  - [ ] Presiona 6 veces "CORRECTA"
  - [ ] Presiona 2 veces "SKIP"

**Pestaña 2 (Jugador2):**
- [ ] Presionar "Listo para jugar"
- [ ] Debe ir a GameScreen de la categoría "Animales"
- [ ] Comienza el countdown 3..2..1
- [ ] Juega durante 15 segundos:
  - [ ] Presiona 4 veces "CORRECTA"
  - [ ] Presiona 3 veces "SKIP"

### Paso 6: Ambos ven resultados
**Pestaña 1 (Jugador1):**
- [ ] Después de 15s, aparece EndGameScreen
- [ ] Resultados: Score 6, Correctas 6, Pasadas 2
- [ ] Campo nombre ya tiene "Jugador1"
- [ ] Presiona "Guardar en Tabla de Posiciones"

**Pestaña 2 (Jugador2):**
- [ ] Después de 15s, aparece EndGameScreen
- [ ] Resultados: Score 4, Correctas 4, Pasadas 3
- [ ] Campo nombre tiene "Jugador2"
- [ ] Presiona "Guardar en Tabla de Posiciones"

### Paso 7: Tabla de Posiciones - Verificar ambos scores
- [ ] En cualquiera de las pestañas, ir a "Tabla de Posiciones"
- [ ] Debe mostrar AMBOS jugadores ordenados por puntuación:
  - [ ] #1: Jugador1 - 6 puntos (si Jugador1 ganó)
  - [ ] #2: Jugador2 - 4 puntos
- [ ] O inversamente si Jugador2 ganó

---

## FLUJO 3: VALIDACIONES ADICIONALES

### Persistencia de Datos
- [ ] Recargar la página (F5)
- [ ] Los scores debe seguir en la Tabla de Posiciones
- [ ] Los nombres deben persistir

### Orientación Pantalla
- [ ] En GameScreen, girar el dispositivo a horizontal
- [ ] Debe forzar landscape-primary automáticamente
- [ ] Elementos deben reordenarse correctamente

### Controles Tilt
- [ ] En GameScreen, si hay sensor:
  - [ ] Inclinar hacia adelante = SKIP
  - [ ] Inclinar hacia atrás = CORRECTA
- [ ] Si no hay sensor:
  - [ ] Botones deben estar visibles
  - [ ] Botones deben funcionar

### Variedad de Palabras
- [ ] Jugar varias veces
- [ ] Las palabras deben ser diferentes entre sesiones
- [ ] No debe repetir palabra en la misma partida

### Categorías Funcionan
- [ ] Jugar con cada categoría al menos una vez
- [ ] Verificar que cada categoría tiene palabras distintas

---

## CHECKLIST FINAL

- [ ] ✓ Single player: Inicio → Juego → Resultados → Tabla
- [ ] ✓ Multiplayer: Crear → Unirse → Jugar simultáneamente → Ver scores
- [ ] ✓ 8 categorías funcionan
- [ ] ✓ Timer de 15 segundos es preciso
- [ ] ✓ Datos persisten en localStorage
- [ ] ✓ Orientación horizontal forzada
- [ ] ✓ Controles funcionan (botones o tilt)
- [ ] ✓ Tabla de posiciones actualizada
- [ ] ✓ Sin errores en consola del navegador

---

## NOTAS IMPORTANTES

1. **localStorage**: Los datos se guardan en el navegador, no en servidor real
2. **Multiplayer**: Funciona en 2 pestañas del mismo navegador o en dispositivos diferentes compartiendo código
3. **Persistencia**: Los datos surviven F5 (reload) pero no clearing de localStorage
4. **Offline**: La app funciona completamente offline gracias al service worker (PWA)

---

## CÓMO VERIFICAR ERRORES

**Abrir DevTools (F12 o CMD+Option+I):**
1. Pestaña **Console** - Debe estar vacía (sin errores rojos)
2. Pestaña **Network** - Todos los recursos deben cargar (status 200)
3. Pestaña **Application** > **localStorage** - Verificar claves:
   - `game-settings`
   - `leaderboard`
   - `adivina_rooms`
   - `adivina_current_room`
   - `adivina_player_id`

