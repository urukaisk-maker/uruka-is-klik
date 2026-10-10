# Urukais KLick

> Autocompletado y edición de código con **MiniCPM5** local, sin nube ni telemetría.

[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![VS Code](https://img.shields.io/badge/VS%20Code-%5E1.90-007ACC.svg)](https://code.visualstudio.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6.svg)](https://www.typescriptlang.org/)
[![Backend](https://img.shields.io/badge/backend-llama.cpp-black.svg)](https://github.com/ggerganov/llama.cpp)

Extensión de VS Code que conecta con un servidor **llama.cpp** local corriendo
**MiniCPM5-2B** o **MiniCPM5-1B** para ofrecer:

- ✨ **Autocompletado inline** (ghost text) mientras escribes.
- 🗣️ **Chat lateral** con contexto de código.
- 🛠️ **Comandos rápidos**: explicar, refactorizar, corregir, generar tests.

Todo el procesamiento ocurre en tu máquina. **Cero llamadas externas.**

---

## Tabla de contenidos

- [Estado del proyecto](#estado-del-proyecto)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [Rendimiento medido](#rendimiento-medido)
- [Solución de problemas](#solución-de-problemas)
- [Arquitectura](#arquitectura)
- [Roadmap](#roadmap)
- [Licencia](#licencia)

---

## Estado del proyecto

✅ **Alpha funcional (v0.1.0)** — verificado end-to-end en hardware sin GPU.

**Entorno de referencia:**

| Componente | Detalle |
|---|---|
| Hardware | Dell Latitude E7470 (Intel i5-6300U, Intel HD 520, 8 GB RAM) |
| OS | Arch Linux, kernel 6.x |
| Backend | llama.cpp build 11429 (`/usr/bin/llama-server` de `pacman -S llama-cpp`) |
| Modelo probado | `MiniCPM5-2B-Q4_K_M` (1.6 GB) |
| VS Code | 1.90+ |

**Lo que funciona hoy:**

- [x] Ghost text tras ~2-4 s de pausa
- [x] Aceptar con `Tab`, descartar con `Esc`
- [x] Comandos `Explicar`, `Refactorizar`, `Corregir error`
- [x] Panel de chat lateral
- [x] Desactivación de *thinking* en autocompletado (3× más rápido)

---

## Requisitos

| Componente | Versión mínima | Notas |
|---|---|---|
| VS Code | 1.90 | Cualquier edición |
| Node.js | 20 | Solo para compilar la extensión |
| llama.cpp | build ≥ 11429 | Necesario soporte de arquitectura MiniCPM5 |
| RAM | 4 GB libres | ~2 GB para el modelo 2B en Q4_K_M |
| Disco | 2 GB | GGUF del modelo |

**No se necesita GPU.** El backend CPU de llama.cpp es suficiente.

---

## Instalación

### 1. Backend (llama.cpp)

#### Arch Linux

```bash
sudo pacman -S llama-cpp
