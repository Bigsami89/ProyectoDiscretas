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
 * Dibuja el grafo completo en el canvas, manejando bucles y aristas múltiples.
 */
function dibujarGrafo(grafo, visitados = [], aristasMST = []) {
    const canvas = document.getElementById("canvas-grafo");
    const ctx = canvas.getContext("2d");
    const radioNodo = 20;
    
    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Agrupar aristas por par de nodos para detectar múltiples caminos
    const gruposAristas = {};
    grafo.aristas.forEach(arista => {
        const nodos = [arista.origen, arista.destino].sort();
        const clave = nodos.join("|"); // Usar pipe para evitar conflicto con nombres con guion
        if (!gruposAristas[clave]) gruposAristas[clave] = [];
        gruposAristas[clave].push(arista);
    });

    const centroX = 400; // Mismo que en Grafo
    const centroY = 200;

    // Dibujar aristas
    Object.keys(gruposAristas).forEach(clave => {
        const aristas = gruposAristas[clave];
        const partes = clave.split("|");
        const uNombre = partes[0];
        const vNombre = partes[1] || partes[0];

        const idxU = grafo.indiceNodos[uNombre];
        const idxV = grafo.indiceNodos[vNombre];
        
        if (idxU === undefined || idxV === undefined) return;

        const p1 = grafo.posiciones[idxU];
        const p2 = grafo.posiciones[idxV];

        aristas.forEach((arista, index) => {
            const esMST = aristasMST.some(a => 
                (a.desde === arista.origen && a.hasta === arista.destino && Math.abs(a.peso - arista.peso) < 0.01) ||
                (a.desde === arista.destino && a.hasta === arista.origen && Math.abs(a.peso - arista.peso) < 0.01)
            );

            ctx.beginPath();
            ctx.lineWidth = esMST ? 4 : 2;
            ctx.strokeStyle = esMST ? "#27ae60" : "#d1d1d1";
            ctx.font = "bold 12px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            if (uNombre === vNombre) {
                // CASO: Bucle (Self-loop) RADIAL
                // Calculamos dirección desde el centro hacia el nodo
                const dx = p1.x - centroX;
                const dy = p1.y - centroY;
                const angulo = Math.atan2(dy, dx);
                
                // Distancia del centro del bucle al nodo
                const distLoop = 30 + (index * 15);
                const loopCenterX = p1.x + Math.cos(angulo) * distLoop;
                const loopCenterY = p1.y + Math.sin(angulo) * distLoop;
                const loopRadio = 15 + (index * 5);

                ctx.arc(loopCenterX, loopCenterY, loopRadio, 0, 2 * Math.PI);
                ctx.stroke();
                
                // Peso al final del bucle
                const pesoX = p1.x + Math.cos(angulo) * (distLoop + loopRadio + 10);
                const pesoY = p1.y + Math.sin(angulo) * (distLoop + loopRadio + 10);
                
                ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
                ctx.fillRect(pesoX - 12, pesoY - 8, 24, 16);
                ctx.fillStyle = "#e67e22";
                ctx.fillText(arista.peso, pesoX, pesoY);
            } else {
                // CASO: Arista normal o múltiple (Bezier)
                const midX = (p1.x + p2.x) / 2;
                const midY = (p1.y + p2.y) / 2;

                if (aristas.length === 1) {
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();

                    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
                    ctx.fillRect(midX - 12, midY - 8, 24, 16);
                    ctx.fillStyle = "#333";
                    ctx.fillText(arista.peso, midX, midY);
                } else {
                    const dx = p2.x - p1.x;
                    const dy = p2.y - p1.y;
                    const len = Math.sqrt(dx * dx + dy * dy);
                    const nx = -dy / len;
                    const ny = dx / len;
                    
                    const offset = (index - (aristas.length - 1) / 2) * 40;
                    const cpX = midX + nx * offset;
                    const cpY = midY + ny * offset;

                    ctx.moveTo(p1.x, p1.y);
                    ctx.quadraticCurveTo(cpX, cpY, p2.x, p2.y);
                    ctx.stroke();

                    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
                    ctx.fillRect(cpX - 12, cpY - 8, 24, 16);
                    ctx.fillStyle = "#333";
                    ctx.fillText(arista.peso, cpX, cpY);
                }
            }
        });
    });

    // Dibujar nodos (encima de las aristas)
    grafo.nodos.forEach((nombre, i) => {
        const p = grafo.posiciones[i];
        const estaVisitado = visitados[i];

        ctx.beginPath();
        ctx.arc(p.x, p.y, radioNodo, 0, 2 * Math.PI);
        
        if (estaVisitado) {
            ctx.fillStyle = "#2c3e50";
            ctx.strokeStyle = "#27ae60";
            ctx.lineWidth = 3;
        } else {
            ctx.fillStyle = "#fff";
            ctx.strokeStyle = "#333";
            ctx.lineWidth = 1;
        }
        
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = estaVisitado ? "#fff" : "#333";
        ctx.font = "bold 14px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(nombre, p.x, p.y);
    });
}

/**
 * Procesa la entrada del usuario, valida los datos y crea el objeto Grafo.
 * @returns {Grafo|null} El objeto grafo o null si hay errores críticos.
 */
function leerEntradaUsuario() {
    const inputNodos = document.getElementById("input-nodos");
    const inputAristas = document.getElementById("input-aristas");
    const errorDiv = document.getElementById("mensaje-error");
    
    // Limpiar errores previos
    errorDiv.style.display = "none";
    errorDiv.innerHTML = "";
    let errores = [];

    const nombresNodos = inputNodos.value.split(",").map(n => n.trim()).filter(n => n !== "");
    
    // Validación 1: Debe haber nodos
    if (nombresNodos.length === 0) {
        errores.push("Error: Debes ingresar al menos un nombre de nodo.");
    }

    // Si hay errores de nodos, no continuamos
    if (errores.length > 0) {
        mostrarErrores(errores);
        return null;
    }

    const grafo = new Grafo(nombresNodos);

    // Procesar aristas: formato A-B:5
    const textoAristas = inputAristas.value;
    const partesAristas = textoAristas.split(",").map(s => s.trim()).filter(s => s !== "");
    
    partesAristas.forEach(p => {
        // Validar formato básico usando Regex para mayor precisión
        // Formato esperado: NodoOrigen-NodoDestino:Peso (Peso puede ser decimal)
        const regex = /^([^-]+)-([^:]+):(\d+(\.\d+)?)$/;
        const match = p.match(regex);

        if (!match) {
            errores.push(`Error de formato en arista "${p}": Debe ser Origen-Destino:Peso (ej: A-B:5).`);
            return;
        }

        const [_, orig, dest, peso] = match;
        const nombreOrig = orig.trim();
        const nombreDest = dest.trim();

        // Validación 2: Los nodos deben existir en la lista de nodos
        if (grafo.indiceNodos[nombreOrig] === undefined) {
            errores.push(`Error en arista "${p}": El nodo "${nombreOrig}" no está en la lista de nodos.`);
        } else if (grafo.indiceNodos[nombreDest] === undefined) {
            errores.push(`Error en arista "${p}": El nodo "${nombreDest}" no está en la lista de nodos.`);
        } else {
            // Si todo está bien, agregar la arista
            grafo.agregarArista(nombreOrig, nombreDest, peso);
        }
    });

    // Si hubo errores en las aristas, los mostramos
    if (errores.length > 0) {
        mostrarErrores(errores);
        // Nota: Permitimos continuar si algunas aristas son válidas, 
        // pero podrías decidir retornar null aquí si quieres ser estricto.
    }

    return grafo;
}

/**
 * Muestra una lista de errores en la interfaz.
 * @param {string[]} errores Lista de mensajes de error.
 */
function mostrarErrores(errores) {
    const errorDiv = document.getElementById("mensaje-error");
    errorDiv.style.display = "block";
    
    const ul = document.createElement("ul");
    errores.forEach(err => {
        const li = document.createElement("li");
        li.textContent = err;
        ul.appendChild(li);
    });
    errorDiv.appendChild(ul);
}
