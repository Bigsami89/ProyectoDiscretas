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
     * Es una matriz cuadrada n x n donde A[i][j] es el peso de la arista entre i y j.
     * Se asume grafo no dirigido para este ejercicio.
     */
    obtenerMatrizAdyacencia() {
        const n = this.nodos.length;
        const matriz = Array.from({ length: n }, () => Array(n).fill(0));

        this.aristas.forEach(arista => {
            const i = this.indiceNodos[arista.origen];
            const j = this.indiceNodos[arista.destino];
            matriz[i][j] = arista.peso;
            matriz[j][i] = arista.peso; // Simétrico por ser no dirigido
        });

        return matriz;
    }

    /**
     * Calcula la matriz de incidencia.
     * Es una matriz n x m (nodos x aristas).
     */
    obtenerMatrizIncidencia() {
        const n = this.nodos.length;
        const m = this.aristas.length;
        const matriz = Array.from({ length: n }, () => Array(m).fill(0));

        this.aristas.forEach((arista, col) => {
            const i = this.indiceNodos[arista.origen];
            const j = this.indiceNodos[arista.destino];
            matriz[i][col] = 1;
            matriz[j][col] = 1;
        });

        return matriz;
    }
}
