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

    // El árbol debe tener n-1 aristas
    for (let k = 0; k < n - 1; k++) {
        let min = Infinity;
        let u = -1;
        let v = -1;

        // Buscamos la arista más pequeña que conecte un nodo visitado con uno no visitado
        for (let i = 0; i < n; i++) {
            if (visitados[i]) {
                for (let j = 0; j < n; j++) {
                    if (!visitados[j] && matrizAdy[i][j] !== 0) {
                        if (matrizAdy[i][j] < min) {
                            min = matrizAdy[i][j];
                            u = i;
                            v = j;
                        }
                    }
                }
            }
        }

        // Si encontramos una arista válida
        if (u !== -1 && v !== -1) {
            aristasMST.push({
                desde: nodos[u],
                hasta: nodos[v],
                peso: min
            });
            pesoTotal += min;
            visitados[v] = true;
            
            // Pausa para visualizar el paso
            if (callbackPaso) {
                await new Promise(resolve => setTimeout(resolve, 800));
                await callbackPaso(visitados, aristasMST);
            }
        } else {
            // El grafo no es conexo
            break;
        }
    }

    return {
        aristasMST,
        pesoTotal
    };
}
