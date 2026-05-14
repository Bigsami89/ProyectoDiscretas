/**
 * Clase para representar y gestionar un grafo.
 */
class Grafo {
    constructor(nombresNodos) {
        // Almacena los nombres de los nodos
        this.nodos = nombresNodos.map(n => n.trim()).filter(n => n !== "");
        // Almacena las aristas como objetos { origen, destino, peso }
        this.aristas = [];
        // Mapa para obtener el índice de un nodo por su nombre
        this.indiceNodos = {};
        // Posiciones para dibujo
        this.posiciones = [];

        const centroX = 400;
        const centroY = 200;
        const radio = 150;

        this.nodos.forEach((nombre, index) => {
            this.indiceNodos[nombre] = index;
            
            // Layout circular
            const angulo = (2 * Math.PI * index) / this.nodos.length;
            this.posiciones.push({
                x: centroX + radio * Math.cos(angulo),
                y: centroY + radio * Math.sin(angulo)
            });
        });
    }

    /**
     * Agrega una arista al grafo.
     */
    agregarArista(origen, destino, peso) {
        if (this.indiceNodos[origen] !== undefined && this.indiceNodos[destino] !== undefined) {
            this.aristas.push({
                origen,
                destino,
                peso: parseFloat(peso)
            });
        }
    }

    /**
     * Calcula la matriz de adyacencia.
     * @returns {number[][]} Matriz cuadrada n x n.
     * Una matriz de adyacencia registra las conexiones entre pares de nodos.
     * Si existe una arista entre el nodo i y el nodo j con peso w, entonces A[i][j] = w.
     * En caso de multigrafos, conservamos el peso MÍNIMO para favorecer el algoritmo de Prim.
     */
    obtenerMatrizAdyacencia() {
        const n = this.nodos.length;
        const matriz = Array.from({ length: n }, () => Array(n).fill(0));

        this.aristas.forEach(arista => {
            const i = this.indiceNodos[arista.origen];
            const j = this.indiceNodos[arista.destino];
            
            const pesoActual = matriz[i][j];
            // Si es la primera arista (0) o si el nuevo peso es menor, actualizamos
            if (pesoActual === 0 || arista.peso < pesoActual) {
                matriz[i][j] = arista.peso;
                matriz[j][i] = arista.peso; 
            }
        });

        return matriz;
    }

    /**
     * Calcula la matriz de incidencia.
     * @returns {number[][]} Matriz de n x m (Nodos x Aristas).
     * Una matriz de incidencia muestra la relación entre los nodos (filas) y las aristas (columnas).
     * Si la arista k conecta los nodos i y j, entonces M[i][k] = 1 y M[j][k] = 1.
     * En caso de bucles (self-loops), el valor es 2 ya que la arista incide dos veces en el mismo nodo.
     */
    obtenerMatrizIncidencia() {
        const n = this.nodos.length;
        const m = this.aristas.length;
        const matriz = Array.from({ length: n }, () => Array(m).fill(0));

        this.aristas.forEach((arista, col) => {
            const i = this.indiceNodos[arista.origen];
            const j = this.indiceNodos[arista.destino];
            
            if (i === j) {
                // Bucle: la arista incide dos veces en el mismo vértice
                matriz[i][col] = 2;
            } else {
                // Arista normal: incide en dos vértices distintos
                matriz[i][col] = 1;
                matriz[j][col] = 1;
            }
        });

        return matriz;
    }
}
