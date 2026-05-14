/**
 * Funciones para manejar la interfaz de usuario.
 */

/**
 * Crea una tabla HTML a partir de una matriz de datos.
 */
function crearTablaHTML(matriz, encabezadosFila, encabezadosColumna) {
    const tabla = document.createElement("table");
    
    // Fila de encabezados de columna
    const headerRow = document.createElement("tr");
    const emptyTh = document.createElement("th");
    headerRow.appendChild(emptyTh);
    
    encabezadosColumna.forEach(texto => {
        const th = document.createElement("th");
        th.textContent = texto;
        headerRow.appendChild(th);
    });
    tabla.appendChild(headerRow);

    // Filas de datos
    matriz.forEach((fila, i) => {
        const tr = document.createElement("tr");
        const thFila = document.createElement("th");
        thFila.textContent = encabezadosFila[i];
        tr.appendChild(thFila);

        fila.forEach(valor => {
            const td = document.createElement("td");
            td.textContent = valor;
            tr.appendChild(td);
        });
        tabla.appendChild(tr);
    });

    return tabla;
}

/**
 * Muestra los resultados en el DOM y dibuja el grafo.
 */
function mostrarResultados(grafo, mst) {
    const seccionResultados = document.getElementById("resultados");
    seccionResultados.style.display = "block";

    // Mostrar Matriz Adyacencia
    const contenedorAdy = document.getElementById("contenedor-adyacencia");
    contenedorAdy.innerHTML = "";
    const matrizAdy = grafo.obtenerMatrizAdyacencia();
    contenedorAdy.appendChild(crearTablaHTML(matrizAdy, grafo.nodos, grafo.nodos));

    // Mostrar Matriz Incidencia
    const contenedorInc = document.getElementById("contenedor-incidencia");
    contenedorInc.innerHTML = "";
    const matrizInc = grafo.obtenerMatrizIncidencia();
    const nombresAristas = grafo.aristas.map((a, idx) => `e${idx + 1}`);
    contenedorInc.appendChild(crearTablaHTML(matrizInc, grafo.nodos, nombresAristas));

    // Mostrar Resultado Final de Prim
    actualizarDatosPrimUI(mst);
}

/**
 * Actualiza la parte textual de los resultados de Prim.
 */
function actualizarDatosPrimUI(mst) {
    document.getElementById("peso-minimo").textContent = `Peso total del MST: ${mst.pesoTotal}`;
    const listaMST = document.getElementById("lista-aristas-mst");
    listaMST.innerHTML = "";
    
    mst.aristasMST.forEach(a => {
        const li = document.createElement("li");
        li.textContent = `Conexión: ${a.desde} ↔ ${a.hasta} (Peso: ${a.peso})`;
        listaMST.appendChild(li);
    });
}

/**
 * Dibuja el grafo completo en el canvas.
 */
function dibujarGrafo(grafo, visitados = [], aristasMST = []) {
    const canvas = document.getElementById("canvas-grafo");
    const ctx = canvas.getContext("2d");
    
    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar aristas originales
    grafo.aristas.forEach(arista => {
        const i = grafo.indiceNodos[arista.origen];
        const j = grafo.indiceNodos[arista.destino];
        const p1 = grafo.posiciones[i];
        const p2 = grafo.posiciones[j];

        // Verificar si esta arista está en el MST actual
        const esMST = aristasMST.some(a => 
            (a.desde === arista.origen && a.hasta === arista.destino) ||
            (a.desde === arista.destino && a.hasta === arista.origen)
        );

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        
        if (esMST) {
            ctx.strokeStyle = "#27ae60"; // Verde para MST
            ctx.lineWidth = 4;
        } else {
            ctx.strokeStyle = "#ccc"; // Gris para aristas normales
            ctx.lineWidth = 1;
        }
        ctx.stroke();

        // Dibujar peso de la arista
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;
        ctx.fillStyle = "#333";
        ctx.font = "12px Arial";
        ctx.fillText(arista.peso, midX, midY - 5);
    });

    // Dibujar nodos
    grafo.nodos.forEach((nombre, i) => {
        const p = grafo.posiciones[i];
        const estaVisitado = visitados[i];

        ctx.beginPath();
        ctx.arc(p.x, p.y, 20, 0, 2 * Math.PI);
        
        if (estaVisitado) {
            ctx.fillStyle = "#2c3e50"; // Azul oscuro visitado
            ctx.strokeStyle = "#27ae60";
            ctx.lineWidth = 3;
        } else {
            ctx.fillStyle = "#fff";
            ctx.strokeStyle = "#333";
            ctx.lineWidth = 1;
        }
        
        ctx.fill();
        ctx.stroke();

        // Texto del nodo
        ctx.fillStyle = estaVisitado ? "#fff" : "#333";
        ctx.font = "bold 14px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(nombre, p.x, p.y);
    });
}

/**
 * Procesa la entrada del usuario y crea el objeto Grafo.
 */
function leerEntradaUsuario() {
    const textoNodos = document.getElementById("input-nodos").value;
    const textoAristas = document.getElementById("input-aristas").value;

    const nombresNodos = textoNodos.split(",").map(n => n.trim()).filter(n => n !== "");
    if (nombresNodos.length === 0) {
        alert("Por favor, ingresa al menos un nodo.");
        return null;
    }

    const grafo = new Grafo(nombresNodos);

    // Procesar aristas: formato A-B:5
    const partesAristas = textoAristas.split(",").map(s => s.trim()).filter(s => s !== "");
    partesAristas.forEach(p => {
        try {
            const [nodosPart, pesoPart] = p.split(":");
            const [orig, dest] = nodosPart.split("-");
            if (orig && dest && pesoPart) {
                grafo.agregarArista(orig.trim(), dest.trim(), pesoPart.trim());
            }
        } catch (e) {
            console.error("Error al procesar arista:", p);
        }
    });

    return grafo;
}
