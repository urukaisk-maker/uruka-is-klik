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
  - [1. Backend (llama.cpp)](#1-backend-llamacpp)
  - [2. Extensión](#2-extensión)
- [Configuración](#configuración)
- [Uso](#uso)
- [Rendimiento esperado](#rendimiento-esperado)
- [Solución de problemas](#solución-de-problemas)
- [Arquitectura](#arquitectura)
- [Roadmap](#roadmap)
- [Licencia](#licencia)

---

## Estado del proyecto

🚧 **Alpha (v0.1.0)** — funcional en CPU. Probado en:
- **Hardware**: Dell Latitude E7470 (Intel i5-6300U, Intel HD 520, 8 GB RAM)
- **OS**: Arch Linux, kernel 6.x
- **Backend**: llama.cpp build 11429+ con soporte MiniCPM5
- **Modelos**: `MiniCPM5-1B-Q4_K_M`, `MiniCPM5-2B-Q4_K_M`

---

## Requisitos

| Componente | Versión mínima | Notas |
|---|---|---|
| VS Code | 1.90 | Cualquier edición |
| Node.js | 20 | Solo para compilar la extensión |
| llama.cpp | build ≥ 11429 | Necesario soporte de MiniCPM5 |
| RAM | 4 GB libres | 2 GB para el modelo, 2 GB para el IDE |
| Disco | 2 GB | GGUF del modelo |

**No se necesita GPU.** Funciona en CPU con cuantización Q4_K_M.

---

## Instalación

### 1. Backend (llama.cpp)

#### Linux (Arch)

```bash
sudo pacman -S llama-cpp
