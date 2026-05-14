/**
 * Implementación del algoritmo de Prim para encontrar el Árbol de Expansión Mínima.
 * Permite una pausa opcional para animación.
 */
async function calcularPrim(grafo, callbackPaso) {
    const nodos = grafo.nodos;
    const n = nodos.length;
    if (n === 0) return { aristasMST: [], pesoTotal: 0 };

    const matrizAdy = grafo.obtenerMatrizAdyacencia();
    const visitados = new Array(n).fill(false);
    const aristasMST = [];
    let pesoTotal = 0;

    // Empezamos desde el primer nodo
    visitados[0] = true;
    
    // Notificar primer paso (solo primer nodo visitado)
    if (callbackPaso) await callbackPaso(visitados, aristasMST);

    // El árbol de expansión mínima debe tener exactamente n-1 aristas para conectar n nodos
    for (let k = 0; k < n - 1; k++) {
        let min = Infinity;
        let u = -1;
        let v = -1;

        // Buscamos la arista más pequeña (GREEDY) que cumpla:
        // 1. Un extremo esté en el conjunto de nodos ya visitados (i)
        // 2. El otro extremo esté en el conjunto de nodos NO visitados (j)
        for (let i = 0; i < n; i++) {
            if (visitados[i]) {
                for (let j = 0; j < n; j++) {
                    // Si el nodo j no ha sido visitado y hay una conexión
                    if (!visitados[j] && matrizAdy[i][j] !== 0) {
                        // Si encontramos un peso menor al mínimo actual, lo guardamos
                        if (matrizAdy[i][j] < min) {
                            min = matrizAdy[i][j];
                            u = i;
                            v = j;
                        }
                    }
                }
            }
        }

        // Si encontramos una arista válida que conecta con un nuevo nodo
        if (u !== -1 && v !== -1) {
            aristasMST.push({
                desde: nodos[u],
                hasta: nodos[v],
                peso: min
            });
            pesoTotal += min;
            visitados[v] = true; // Agregamos el nuevo nodo al conjunto de visitados
            
            // Notificamos a la interfaz para realizar la animación paso a paso
            if (callbackPaso) {
                await new Promise(resolve => setTimeout(resolve, 800)); // Pausa de 800ms
                await callbackPaso(visitados, aristasMST);
            }
        } else {
            // Si no hay más aristas disponibles y no hemos terminado, el grafo es DISCONEXO
            console.warn("El grafo no es conexo, no se puede formar un MST completo.");
            break;
        }
    }

    return {
        aristasMST,
        pesoTotal
    };
}
