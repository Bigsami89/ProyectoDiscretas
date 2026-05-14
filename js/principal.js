/**
 * Archivo principal que coordina la ejecución.
 */
document.addEventListener("DOMContentLoaded", () => {
    const botonProcesar = document.getElementById("boton-procesar");

    // Evento de clic para iniciar el procesamiento
    botonProcesar.addEventListener("click", async () => {
        // 1. Leer los datos ingresados
        const grafo = leerEntradaUsuario();
        
        if (grafo) {
            // Mostrar sección de resultados inmediatamente
            document.getElementById("resultados").style.display = "block";
            document.getElementById("resultados").scrollIntoView({ behavior: 'smooth' });

            // Dibujar grafo inicial (sin visitados)
            dibujarGrafo(grafo);

            // 2. Ejecutar el algoritmo de Prim con callback para animación
            const mst = await calcularPrim(grafo, async (visitados, aristasActuales) => {
                // Redibujar en cada paso
                dibujarGrafo(grafo, visitados, aristasActuales);
                // Actualizar la lista de aristas en tiempo real
                actualizarDatosPrimUI({ 
                    aristasMST: aristasActuales, 
                    pesoTotal: aristasActuales.reduce((sum, a) => sum + a.peso, 0) 
                });
            });
            
            // 3. Mostrar los resultados finales (matrices, etc)
            mostrarResultados(grafo, mst);
        }
    });
});
